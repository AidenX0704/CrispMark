import { ElectronAPI } from "@electron-toolkit/preload";

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      selectFolder: () => Promise<string | null>;
      getFolderImages: (folderPath: string) => Promise<any>;
      getExif: (imagePath: string) => Promise<any>;
      getImageDataUrl: (imagePath: string) => Promise<any>;
      onProgress: (callback: (event: any, data: any) => void) => void;
      offProgress: (callback: (event: any, data: any) => void) => void;
    };
  }
}