import { onMounted, ref } from "vue";
import { Photo } from "@renderer/types/photo";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function usePhotoTimeline() {
  const photos = ref<Photo[]>([]);
  const loading = ref(false);
  const progress = ref({ completed: 0, total: 0, current: "" });

  const selectedPhoto = ref<Photo | null>(null);
  const previewPhoto = ref<Photo | null>(null);

  const loadPhotos = async (folderPath: string): Promise<void> => {
    if (!folderPath) return;

    loading.value = true;
    progress.value = { completed: 0, total: 0, current: "" };

    try {
      // 监听进度更新
      const progressHandler = (_event: Event, data: { completed: number; total: number; current: string }): void => {
        progress.value = { ...data };
      };

      window.api.onProgress(progressHandler);

      photos.value = await window.api.getFolderImages(folderPath);

      // 移除监听器
      window.api.offProgress(progressHandler);
    } catch (error) {
      console.error("加载图片失败:", error);
    } finally {
      loading.value = false;
      progress.value = { completed: 0, total: 0, current: "" };
    }
  };

  const handlePhotoClick = (photo: Photo): void => {
    selectedPhoto.value = photo;
    console.log("选中的图片:", photo);
  };

  const handlePhotoHover = (photo: Photo): void => {
    previewPhoto.value = photo;
    console.log("悬停的图片:", photo);
  };

  onMounted(() => {});

  return {
    photos,
    selectedPhoto,
    previewPhoto,
    loading,
    progress,
    loadPhotos,

    handlePhotoClick,
    handlePhotoHover
  };
}
