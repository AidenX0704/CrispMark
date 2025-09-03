import { WindowConfig } from "./WindowManager";

type WindowProfile = Omit<WindowConfig, "name">;

export const windowProfiles: Record<string, WindowProfile> = {
  // --- 主窗口配置 ---
  main: {
    route: "main",
    browserWindowOptions: {
      width: 1280,
      height: 800,
      minWidth: 940,
      minHeight: 560,
      title: "照片水印1.0",
      show: false
    },
    openDevTools: !process.env.VITE_DEV_SERVER_URL
  },

  // --- 设置窗口配置 ---
  settings: {
    route: "settings",
    browserWindowOptions: {
      width: 640,
      height: 480,
      title: "设置",
      resizable: false,
      maximizable: false,
      minimizable: false
    }
  },

  // --- “关于” 弹窗配置 ---
  about: {
    route: "about",
    browserWindowOptions: {
      width: 320,
      height: 240,
      title: "关于照片水印",
      resizable: false,
      maximizable: false,
      minimizable: false,
      modal: true // 模态窗口
    }
  }
};
