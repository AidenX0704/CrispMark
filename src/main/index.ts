import { app, BrowserWindow, protocol } from "electron";
import { electronApp, optimizer } from "@electron-toolkit/utils";
import windowManager from "./WindowManager";
import path from "path";
import { registerIpcHandlers } from "./ipc";

app.whenReady().then(() => {
  electronApp.setAppUserModelId("com.electron");

  protocol.registerFileProtocol("local", (request, callback) => {
    const url = request.url.replace("local://", "");
    callback({ path: path.normalize(url) });
  });

  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  windowManager.create("main");

  registerIpcHandlers();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) windowManager.create("main");
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
