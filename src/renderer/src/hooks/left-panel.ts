import { ref } from "vue";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function useLeftPanel() {
  const folderPath = ref("");
  const outputPath = ref("");
  const template = ref("");

  // 处理文件夹选择
  const handleSelectFolder = async (): Promise<void> => {
    const path = await window.api.selectFolder();
    if (path) {
      folderPath.value = path;
    }
  };

  return {
    folderPath,
    outputPath,
    template,
    handleSelectFolder
  };
}
