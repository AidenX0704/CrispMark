import { dialog, ipcMain } from "electron";
import fs from "fs";
import path from "path";
import { getFileMd5, getThumbnail } from "../../utils/image";
import { runWithConcurrency } from "../../utils/concurrency";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function folderIpc() {
  ipcMain.handle("folder:select", async () => {
    const result = await dialog.showOpenDialog({ properties: ["openDirectory"] });
    if (result.canceled) return null;
    return result.filePaths[0];
  });

  ipcMain.handle("folder:getImages", async (event, folderPath: string) => {
    if (!fs.existsSync(folderPath)) return [];

    const files = fs.readdirSync(folderPath);
    const images = files.filter((f) => /\.(jpg|jpeg|png|gif)$/i.test(f));

    const total = images.length;
    let completed = 0;

    return await runWithConcurrency(
      images,
      async (file) => {
        const fullPath = path.join(folderPath, file);
        const id = await getFileMd5(fullPath);
        const thumb = await getThumbnail(fullPath, 200);

        completed++;
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
      },
      5
    );
  });
}
