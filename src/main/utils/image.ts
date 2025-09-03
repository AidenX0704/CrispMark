import fs from "fs";
import crypto from "crypto";
import sharp from "sharp";

// 计算文件 md5
export function getFileMd5(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("md5");
    const stream = fs.createReadStream(filePath);
    stream.on("data", (data) => hash.update(data));
    stream.on("end", () => resolve(hash.digest("hex")));
    stream.on("error", reject);
  });
}

// 生成缩略图（base64）
export async function getThumbnail(filePath: string, size = 200): Promise<string> {
  const buffer = await sharp(filePath).resize(size).toBuffer();
  return `data:image/jpeg;base64,${buffer.toString("base64")}`;
}
