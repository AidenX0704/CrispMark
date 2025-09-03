"use strict";
const electron = require("electron");
const utils = require("@electron-toolkit/utils");
const path = require("path");
const deepmerge = require("deepmerge");
const fs = require("fs");
const crypto = require("crypto");
const sharp = require("sharp");
const pLimit = require("p-limit");
const ExifParser = require("exif-parser");
const windowProfiles = {
  // --- 主窗口配置 ---
  main: {
    route: "main",
    browserWindowOptions: {
      width: 1280,
      height: 800,
      minWidth: 940,
      minHeight: 560,
      title: "照片水印1.0",
      show: false
    },
    openDevTools: !process.env.VITE_DEV_SERVER_URL
  },
  // --- 设置窗口配置 ---
  settings: {
    route: "settings",
    browserWindowOptions: {
      width: 640,
      height: 480,
      title: "设置",
      resizable: false,
      maximizable: false,
      minimizable: false
    }
  },
  // --- “关于” 弹窗配置 ---
  about: {
    route: "about",
    browserWindowOptions: {
      width: 320,
      height: 240,
      title: "关于照片水印",
      resizable: false,
      maximizable: false,
      minimizable: false,
      modal: true
      // 模态窗口
    }
  }
};
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const ELECTRON_RENDERER_URL = process.env["ELECTRON_RENDERER_URL"];
class WindowManager {
  windows;
  profiles;
  constructor(profiles) {
    this.windows = /* @__PURE__ */ new Map();
    this.profiles = profiles;
  }
  create(name, overrides = {}) {
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
    const finalConfig = {
      name,
      ...finalProfile
    };
    return this._createWindow(finalConfig);
  }
  _createWindow(config) {
    const defaultOptions = {
      width: 800,
      height: 600,
      show: false,
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
    const { bounds } = electron.screen.getPrimaryDisplay();
    const x = Math.ceil(bounds.x + (bounds.width - (width || 800)) / 2);
    const y = Math.ceil(bounds.y + (bounds.height - (height || 600)) / 2);
    const finalOptions = deepmerge(defaultOptions, {
      ...config.browserWindowOptions,
      x,
      y
    });
    const windowInstance = new electron.BrowserWindow(finalOptions);
    this.windows.set(config.name, windowInstance);
    if (utils.is.dev && (VITE_DEV_SERVER_URL || ELECTRON_RENDERER_URL)) {
      const devBase = ELECTRON_RENDERER_URL || VITE_DEV_SERVER_URL;
      const devUrl = `${devBase}/#/${config.route}/`;
      windowInstance.loadURL(devUrl).catch((error) => {
        electron.dialog.showErrorBox("窗口加载错误", error.message);
      });
    } else {
      windowInstance.loadFile(path.join(__dirname, "../renderer/index.html"), {
        hash: `/${config.route}`
      }).catch((error) => {
        electron.dialog.showErrorBox("窗口加载错误", error.message);
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
  get(name) {
    return this.windows.get(name);
  }
  getAll() {
    return Array.from(this.windows.values());
  }
  send(name, channel, ...args) {
    const win = this.get(name);
    if (win) {
      win.webContents.send(channel, ...args);
    }
  }
  close(name) {
    const win = this.get(name);
    if (win) {
      win.close();
      this.windows.delete(name);
    }
  }
  closeAll() {
    for (const win of this.windows.values()) {
      win.close();
    }
    this.windows.clear();
  }
}
const windowManager = new WindowManager(windowProfiles);
function getFileMd5(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("md5");
    const stream = fs.createReadStream(filePath);
    stream.on("data", (data) => hash.update(data));
    stream.on("end", () => resolve(hash.digest("hex")));
    stream.on("error", reject);
  });
}
async function getThumbnail(filePath, size = 200) {
  const buffer = await sharp(filePath).resize(size).toBuffer();
  return `data:image/jpeg;base64,${buffer.toString("base64")}`;
}
function folderIpc() {
  electron.ipcMain.handle("folder:select", async () => {
    const result = await electron.dialog.showOpenDialog({
      properties: ["openDirectory"]
    });
    if (result.canceled) return null;
    return result.filePaths[0];
  });
  electron.ipcMain.handle("folder:getImages", async (event, folderPath) => {
    if (!fs.existsSync(folderPath)) return [];
    const files = fs.readdirSync(folderPath);
    const images = files.filter((f) => /\.(jpg|jpeg|png|gif)$/i.test(f));
    const total = images.length;
    let completed = 0;
    const limit = pLimit(5);
    const tasks = images.map(
      (file) => limit(async () => {
        const fullPath = path.join(folderPath, file);
        const id = await getFileMd5(fullPath);
        const thumb = await getThumbnail(fullPath, 200);
        completed += 1;
        event.sender.send("folder:progress", {
          completed,
          total,
          current: file
        });
        return {
          id,
          url: fullPath,
          name: path.parse(file).name,
          thumbnail: thumb
        };
      })
    );
    return Promise.all(tasks);
  });
}
function exifIpc() {
  electron.ipcMain.handle("exif:get", async (_, filePath) => {
    const buffer = fs.readFileSync(filePath);
    const parser = ExifParser.create(buffer);
    const result = parser.parse();
    return result.tags;
  });
}
function fileIpc() {
  electron.ipcMain.handle("file:getStream", async (_, filePath) => {
    const buffer = fs.readFileSync(filePath);
    return buffer.toString("base64");
  });
}
function registerIpcHandlers() {
  folderIpc();
  exifIpc();
  fileIpc();
}
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("com.electron");
  electron.protocol.registerFileProtocol("local", (request, callback) => {
    const url = request.url.replace("local://", "");
    callback({ path: path.normalize(url) });
  });
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  windowManager.create("main");
  registerIpcHandlers();
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0) windowManager.create("main");
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
