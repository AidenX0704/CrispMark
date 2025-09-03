import { ElectronAPI } from "@electron-toolkit/preload";

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      selectFolder: () => Promise<string | null>;
      scanFolderImages: (folderPath: string) => Promise<any>;
      getImageExif: (imagePath: string) => Promise<any>;
      getImageDataUrl: (imagePath: string) => Promise<any>;
    };
  }
}
