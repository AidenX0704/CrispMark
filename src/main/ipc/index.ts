import folderIpc from "./modules/folder";
import exifIpc from "./modules/exif";
import fileIpc from "./modules/file";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function registerIpcHandlers() {
  folderIpc();
  exifIpc();
  fileIpc();
}
