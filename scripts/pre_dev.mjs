/**
 * 一下代码用于解决在Windows系统中,Electron主进程在控制台输出中文乱码的问题
 */
import os from "os";
import { execSync } from "node:child_process";

if (os.platform() === "win32") {
  try {
    execSync("chcp 65001", { stdio: "inherit" });
    console.log("已设置控制台编码为UTF-8");
  } catch (error) {
    console.error("设置控制台编码为UTF-8时出错:", error);
  }
}
