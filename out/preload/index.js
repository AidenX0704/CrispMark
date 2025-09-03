"use strict";
const electron = require("electron");
const preload = require("@electron-toolkit/preload");
const api = {
  selectFolder: () => electron.ipcRenderer.invoke("folder:select"),
  getFolderImages: (folderPath) => electron.ipcRenderer.invoke("folder:getImages", folderPath),
  getExif: (filePath) => electron.ipcRenderer.invoke("exif:get", filePath),
  getImageStream: (filePath) => electron.ipcRenderer.invoke("file:getStream", filePath)
};
if (process.contextIsolated) {
  try {
    electron.contextBridge.exposeInMainWorld("electron", preload.electronAPI);
    electron.contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = preload.electronAPI;
  window.api = api;
}
