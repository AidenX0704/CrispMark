import { ipcMain } from "electron";
import fs from "fs";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function fileIpc() {
  ipcMain.handle("file:getStream", async (_, filePath: string) => {
    const buffer = fs.readFileSync(filePath);
    return buffer.toString("base64");
  });
}
