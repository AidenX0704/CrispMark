import { dialog, ipcMain } from "electron";
import fs from "fs";
import path from "path";
import { getFileMd5, getThumbnail } from "../../utils/image";
import pLimit from "p-limit";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function folderIpc() {
  // 选择文件夹
  ipcMain.handle("folder:select", async () => {
    const result = await dialog.showOpenDialog({
      properties: ["openDirectory"]
    });
    if (result.canceled) return null;
    return result.filePaths[0];
  });

  // 获取文件夹下图片（异步并发，限制同时运行 5 个任务）
  ipcMain.handle("folder:getImages", async (event, folderPath: string) => {
    if (!fs.existsSync(folderPath)) return [];

    const files = fs.readdirSync(folderPath);
    const images = files.filter((f) => /\.(jpg|jpeg|png|gif)$/i.test(f));

    const total = images.length;
    let completed = 0;

    const limit = pLimit(5); // 限制最大并发数为 5

    const tasks = images.map((file) =>
      limit(async () => {
        const fullPath = path.join(folderPath, file);
        const id = await getFileMd5(fullPath);
        const thumb = await getThumbnail(fullPath, 200);

        completed += 1;

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
      })
    );

    return Promise.all(tasks);
  });
}
