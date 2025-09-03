import { onMounted, ref } from "vue";
import { Photo } from "@renderer/types/photo";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function usePhotoTimeline() {
  const photos = ref<Photo[]>([
    {
      id: 1,
      url: "/Users/xiao/Desktop/100NCZ_6/DSC_0013.jpg",
      name: "photo1.jpg"
    }
  ]);

  const selectedPhoto = ref<Photo | null>(null);
  const previewPhoto = ref<Photo | null>(null);

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

    handlePhotoClick,
    handlePhotoHover
  };
}
