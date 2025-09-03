import { BrowserWindow, screen, dialog } from "electron";
import path from "path";
import deepmerge from "deepmerge";
import { windowProfiles } from "./window.config";
import { is } from "@electron-toolkit/utils";

const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const ELECTRON_RENDERER_URL = process.env["ELECTRON_RENDERER_URL"];

export interface WindowConfig {
  name: string;
  route: string;
  browserWindowOptions?: Electron.BrowserWindowConstructorOptions;
  openDevTools?: boolean;
}

type WindowProfile = Omit<WindowConfig, "name">;

class WindowManager {
  private windows: Map<string, BrowserWindow>;
  private readonly profiles: Record<string, WindowProfile>;

  constructor(profiles: Record<string, WindowProfile>) {
    this.windows = new Map();
    this.profiles = profiles;
  }

  public create(name: string, overrides: Partial<WindowProfile> = {}): BrowserWindow {
    const existingWindow = this.get(name);
    if (existingWindow) {
      if (existingWindow.isMinimized()) existingWindow.restore();
      existingWindow.focus();
      return existingWindow;
    }

    const profile = this.profiles[name];
    if (!profile) {
      throw new Error(`[WindowManager] Window profile "${name}" not found.`);
    }

    const finalProfile = deepmerge(profile, overrides);
    const finalConfig: WindowConfig = {
      name,
      ...finalProfile
    };

    return this._createWindow(finalConfig);
  }

  private _createWindow(config: WindowConfig): BrowserWindow {
    const defaultOptions: Electron.BrowserWindowConstructorOptions = {
      width: 800,
      height: 600,
      show: false,
      autoHideMenuBar: true,
      webPreferences: {
        preload: path.join(__dirname, "../preload/index.js"),
        nodeIntegration: true,
        contextIsolation: false,
        nodeIntegrationInWorker: false,
        sandbox: false
      }
    };

    const { width, height } = {
      ...defaultOptions,
      ...config.browserWindowOptions
    };
    const { bounds } = screen.getPrimaryDisplay();
    const x = Math.ceil(bounds.x + (bounds.width - (width || 800)) / 2);
    const y = Math.ceil(bounds.y + (bounds.height - (height || 600)) / 2);

    const finalOptions = deepmerge(defaultOptions, {
      ...config.browserWindowOptions,
      x,
      y
    });

    const windowInstance = new BrowserWindow(finalOptions);
    this.windows.set(config.name, windowInstance);

    // ===== 页面加载逻辑 =====
    if (is.dev && (VITE_DEV_SERVER_URL || ELECTRON_RENDERER_URL)) {
      const devBase = ELECTRON_RENDERER_URL || VITE_DEV_SERVER_URL;
      const devUrl = `${devBase}/#/${config.route}/`;
      windowInstance.loadURL(devUrl).catch((error) => {
        dialog.showErrorBox("窗口加载错误", error.message);
      });
    } else {
      windowInstance
        .loadFile(path.join(__dirname, "../renderer/index.html"), {
          hash: `/${config.route}`
        })
        .catch((error) => {
          dialog.showErrorBox("窗口加载错误", error.message);
        });
    }

    if (config.openDevTools) {
      windowInstance.webContents.openDevTools();
    }

    windowInstance.once("ready-to-show", () => {
      windowInstance.show();
    });

    windowInstance.on("closed", () => {
      this.windows.delete(config.name);
    });

    return windowInstance;
  }

  // ====== 工具方法 ======
  public get(name: string): BrowserWindow | undefined {
    return this.windows.get(name);
  }

  public getAll(): BrowserWindow[] {
    return Array.from(this.windows.values());
  }

  public send(name: string, channel: string, ...args: any[]): void {
    const win = this.get(name);
    if (win) {
      win.webContents.send(channel, ...args);
    }
  }

  public close(name: string): void {
    const win = this.get(name);
    if (win) {
      win.close();
      this.windows.delete(name);
    }
  }

  public closeAll(): void {
    for (const win of this.windows.values()) {
      win.close();
    }
    this.windows.clear();
  }
}

export default new WindowManager(windowProfiles);
