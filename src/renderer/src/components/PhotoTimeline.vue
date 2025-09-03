<script setup lang="ts">
  import { computed } from "vue";
  import { ElScrollbar } from "element-plus";

  interface Photo {
    id: string | number;
    url: string;
    name?: string;
    [key: string]: any;
  }

  interface Props {
    photos: Photo[];
    itemWidth?: number;
    itemHeight?: number;
    gap?: number;
    borderRadius?: number;
  }

  const props = withDefaults(defineProps<Props>(), {
    photos: () => [],
    itemWidth: 70,
    itemHeight: 70,
    gap: 8,
    borderRadius: 4
  });

  const emit = defineEmits<{
    (e: "photoClick", photo: Photo): void;
  }>();

  const handlePhotoClick = (photo: Photo): void => {
    emit("photoClick", photo);
  };

  // 计算样式
  const photoListStyle = computed(() => ({
    gap: `${props.gap}px`
  }));

  const photoItemStyle = computed(() => ({
    width: `${props.itemWidth}px`,
    height: `${props.itemHeight}px`,
    borderRadius: `${props.borderRadius}px`
  }));
</script>

<template>
  <div class="photo-timeline">
    <el-scrollbar>
      <div class="photo-list" :style="photoListStyle">
        <div
          v-for="photo in photos"
          :key="photo.id"
          class="photo-item"
          :style="photoItemStyle"
          @click="handlePhotoClick(photo)"
        >
          <img
            :src="photo.url.startsWith('http') ? photo.url : `local://${photo.url}`"
            :alt="photo.name || 'photo'"
            :style="photoItemStyle"
            loading="lazy"
          />
          <div v-if="photo.name" class="photo-name">
            {{ photo.name }}
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<style scoped>
  .photo-timeline {
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 12px;
    background: var(--el-bg-color-overlay);
    border-radius: 8px;
  }

  .photo-list {
    display: flex;
    align-items: center;
    padding: 8px 0;
  }

  .photo-item {
    position: relative;
    cursor: pointer;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
    flex-shrink: 0;
  }

  .photo-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .photo-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .photo-name {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    font-size: 12px;
    padding: 2px 4px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* 自定义滚动条样式 */
  :deep(.el-scrollbar__bar.is-horizontal) {
    height: 6px;
  }

  :deep(.el-scrollbar__thumb) {
    background-color: var(--el-color-primary-light-7);
    border-radius: 3px;
  }
</style>
