<script setup lang="ts">
  import { computed, ref, onMounted, onUnmounted, watch } from "vue";
  import { Photo } from "@renderer/types/photo";

  interface Props {
    photos: Photo[];
    itemWidth?: number;
    itemHeight?: number;
    gap?: number;
    borderRadius?: number;
    scrollStep?: number; // 每次滚动的距离
  }

  const props = withDefaults(defineProps<Props>(), {
    photos: () => [],
    itemWidth: 70,
    itemHeight: 70,
    gap: 8,
    borderRadius: 4,
    scrollStep: 200
  });

  const emit = defineEmits<{
    (e: "photoClick", photo: Photo): void;
  }>();

  // 滚动容器引用
  const scrollContainer = ref<HTMLDivElement>();
  // 滚动状态
  const canScrollLeft = ref(false);
  const canScrollRight = ref(true);
  // 控制按钮显示状态
  const showButtons = ref(false);

  const handlePhotoClick = (photo: Photo): void => {
    emit("photoClick", photo);
  };

  // 处理滚动逻辑
  const handleScroll = (): void => {
    if (!scrollContainer.value) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.value;
    // 计算是否可以向左右滚动
    canScrollLeft.value = scrollLeft > 10;
    canScrollRight.value = scrollLeft < scrollWidth - clientWidth - 10;
  };

  // 处理鼠标滚轮事件
  const handleWheel = (e: WheelEvent): void => {
    e.preventDefault(); // 阻止默认纵向滚动
    if (!scrollContainer.value) return;

    // 横向滚动，根据滚轮方向调整
    scrollContainer.value.scrollBy({
      left: e.deltaY > 0 ? props.scrollStep : -props.scrollStep,
      behavior: "auto"
    });
  };

  // 监听photos变化，重置滚动状态
  watch(
    () => props.photos,
    () => {
      if (scrollContainer.value) {
        scrollContainer.value.scrollLeft = 0;
        // 延迟更新滚动状态，确保DOM已更新
        setTimeout(handleScroll, 0);
      }
    }
  );

  // 绑定事件
  onMounted(() => {
    const container = scrollContainer.value;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      container.addEventListener("wheel", handleWheel, { passive: false });
      container.addEventListener("mouseenter", () => (showButtons.value = true));
      container.addEventListener("mouseleave", () => (showButtons.value = false));

      // 初始检查滚动状态
      handleScroll();
    }
  });

  // 解绑事件
  onUnmounted(() => {
    const container = scrollContainer.value;
    if (container) {
      container.removeEventListener("scroll", handleScroll);
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("mouseenter", () => (showButtons.value = true));
      container.removeEventListener("mouseleave", () => (showButtons.value = false));
    }
  });

  // 样式计算
  const photoListStyle = computed(() => ({
    gap: `${props.gap}px`
  }));

  const photoItemStyle = computed(() => ({
    width: `${props.itemWidth}px`,
    height: `${props.itemHeight}px`,
    borderRadius: `${props.borderRadius}px`
  }));

  // 获取图片 src（优先 thumbnail）
  const getPhotoSrc = (photo: Photo): string => {
    if (photo.thumbnail) {
      return photo.thumbnail;
    }
    return photo.url.startsWith("http") ? photo.url : `local://${photo.url}`;
  };
</script>

<template>
  <div class="photo-timeline">
    <el-scrollbar>
      <div ref="scrollContainer" class="photo-list" :style="photoListStyle">
        <div
          v-for="photo in photos"
          :key="photo.id"
          class="photo-item"
          :style="photoItemStyle"
          @click="handlePhotoClick(photo)"
        >
          <img :src="getPhotoSrc(photo)" :alt="photo.name || 'photo'" :style="photoItemStyle" loading="lazy" />
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
    position: relative;
  }

  .photo-list {
    display: flex;
    align-items: center;
    padding: 8px 0;
    width: 100%;
    overflow: auto;
    scrollbar-width: none;
  }

  .photo-list::-webkit-scrollbar {
    display: none;
  }

  .photo-item {
    position: relative;
    cursor: pointer;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
    flex-shrink: 0;
    overflow: hidden;
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
