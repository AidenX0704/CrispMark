<script setup lang="ts">
  import { Photo } from "@renderer/types/photo";
  import { ref, onMounted } from "vue";

  interface Props {
    photo?: Photo;
    config?: Record<string, any>;
  }

  const props = withDefaults(defineProps<Props>(), {
    config: () => ({})
  });

  // 默认配置
  const defaultConfig = {
    fontSize: 14,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    textColor: "white",
    logoText: "CAMERA",
    ...props.config
  };

  // 照片EXIF信息
  const exifData = ref<Record<string, any> | null>(null);

  // 获取照片EXIF信息
  onMounted(async () => {
    if (props.photo) {
      try {
        exifData.value = await window.api.getExif(props.photo.url);
      } catch (error) {
        console.error("获取EXIF信息失败:", error);
      }
    }
  });

  // 格式化EXIF信息显示
  const formatExifInfo = () => {
    if (!exifData.value) return "拍摄信息";
    
    const model = exifData.value.Model || "未知设备";
    const focalLength = exifData.value.FocalLength ? `${exifData.value.FocalLength}mm` : "";
    const fNumber = exifData.value.FNumber ? `f/${exifData.value.FNumber}` : "";
    const exposureTime = exifData.value.ExposureTime ? `${exifData.value.ExposureTime}s` : "";
    const iso = exifData.value.ISO ? `ISO${exifData.value.ISO}` : "";
    
    return [focalLength, fNumber, exposureTime, iso].filter(Boolean).join(" | ");
  };
</script>

<template>
  <div class="bottom-marking-wrapper">
    <!-- 照片 -->
    <div class="photo-wrapper">
      <img 
        v-if="photo" 
        :src="`local://${photo.url}`" 
        :alt="photo.name" 
        class="photo"
      />
    </div>
    
    <!-- 底部信息条 -->
    <div 
      class="bottom-info-bar"
      :style="{
        backgroundColor: defaultConfig.backgroundColor,
        color: defaultConfig.textColor,
        fontSize: defaultConfig.fontSize + 'px'
      }"
    >
      <div class="logo-section">
        {{ defaultConfig.logoText }}
      </div>
      <div class="exif-section">
        {{ formatExifInfo() }}
      </div>
    </div>
  </div>
</template>

<style scoped>
  .bottom-marking-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .photo-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  
  .photo {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    display: block;
    object-fit: contain;
  }
  
  .bottom-info-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    padding: 0 15px;
    font-weight: bold;
    flex-shrink: 0;
  }
  
  .logo-section {
    flex: 1;
    text-align: left;
  }
  
  .exif-section {
    flex: 2;
    text-align: right;
  }
</style>
