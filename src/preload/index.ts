import { ipcRenderer, contextBridge } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

const api = {
  selectFolder: () => ipcRenderer.invoke("folder:select"),
  getFolderImages: (folderPath: string) => ipcRenderer.invoke("folder:getImages", folderPath),
  getExif: (filePath: string) => ipcRenderer.invoke("exif:get", filePath),
  getImageStream: (filePath: string) => ipcRenderer.invoke("file:getStream", filePath)
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
