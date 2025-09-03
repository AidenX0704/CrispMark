<script setup lang="ts">
  import LeftPanel from "@renderer/components/LeftPanel.vue";
  import MainPreview from "@renderer/components/MainPreview.vue";
  import RightPanel from "@renderer/components/RightPanel.vue";
  import PhotoTimeline from "@renderer/components/PhotoTimeline.vue";
  import usePhotoTimeline from "@renderer/hooks/photo-timeline";
  import useLeftPanel from "@renderer/hooks/left-panel";

  const { folderPath, outputPath, template, handleSelectFolder } = useLeftPanel();
  const { photos, selectedPhoto, handlePhotoClick } = usePhotoTimeline();
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
          <main-preview :photo="selectedPhoto || undefined" />
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
</style>
