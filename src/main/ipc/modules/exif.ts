import { ipcMain } from "electron";
import fs from "fs";
import ExifParser from "exif-parser";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function exifIpc() {
  ipcMain.handle("exif:get", async (_, filePath: string) => {
    const buffer = fs.readFileSync(filePath);
    const parser = ExifParser.create(buffer);
    const result = parser.parse();
    return result.tags;
  });
}
