<script setup lang="ts">
  import LeftPanel from "@renderer/components/LeftPanel.vue";
  import MainPreview from "@renderer/components/MainPreview.vue";
  import RightPanel from "@renderer/components/RightPanel.vue";
  import PhotoTimeline from "@renderer/components/PhotoTimeline.vue";
  import usePhotoTimeline from "@renderer/hooks/photo-timeline";
  import useLeftPanel from "@renderer/hooks/left-panel";
  import { ElProgress } from "element-plus";
  import { watch, ref } from "vue";

  const { folderPath, outputPath, template, handleSelectFolder } = useLeftPanel();
  const { photos, selectedPhoto, handlePhotoClick, loadPhotos, progress, loading } = usePhotoTimeline();

  // 水印配置
  const watermarkConfig = ref({
    text: "© 2025 My Photos",
    fontSize: 16,
    color: "white",
    blur: 10,
    photoBorderRadius: 15,
    photoBoxShadow: "0 6px 16px rgba(0, 0, 0, 0.4)",
    photoMargin: 30
  });

  // 监听文件夹路径变化，自动加载图片
  watch(folderPath, (newPath) => {
    if (newPath) {
      loadPhotos(newPath);
    } else {
      photos.value = [];
    }
  });
</script>

<template>
  <div class="main-container">
    <el-container>
      <el-container>
        <el-aside width="300px">
          <left-panel
            v-model:folder-path="folderPath"
            v-model:output-path="outputPath"
            v-model:template="template"
            @select-folder="handleSelectFolder"
          />
        </el-aside>
        <el-main>
          <main-preview :photo="selectedPhoto || undefined" :template="template" :watermark-config="watermarkConfig" />

          <!-- 加载进度条 -->
          <div v-if="loading" class="progress-container">
            <el-progress
              :percentage="progress.total ? Math.round((progress.completed / progress.total) * 100) : 0"
              :format="() => `${progress.completed}/${progress.total}`"
            />
            <p class="progress-text">正在加载: {{ progress.current }}</p>
          </div>
        </el-main>
        <el-aside width="300px">
          <right-panel />
        </el-aside>
      </el-container>
      <el-footer height="90px">
        <photo-timeline :photos="photos" :gap="12" :border-radius="6" @photo-click="handlePhotoClick" />
      </el-footer>
    </el-container>
  </div>
</template>

<style scoped>
  @import "main.css";

  .progress-container {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    background: white;
    padding: 10px;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 100;
  }

  .progress-text {
    margin: 5px 0 0 0;
    text-align: center;
    font-size: 12px;
    color: #666;
  }
</style>
