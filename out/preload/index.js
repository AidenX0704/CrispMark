"use strict";
const electron = require("electron");
const preload = require("@electron-toolkit/preload");
const api = {
  // 选择文件夹
  // 选择图片
  // 获取图片 EXIF 信息
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
