<script setup lang="ts">
  import { ref } from "vue";

  const activeTab = ref("template");

  const defaultConfig = {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.85)",
    blur: 60,
    brightness: 0.3,
    saturate: 1.2,
    photoBorderRadius: 16,
    photoBoxShadow: "0 0 0 0 rgba(0, 0, 0, 0.4)",
    photoMargin: 20,
    watermarkPosition: "bottom-right"
  };

  // 相机信息
  const cameraInfo = ref({
    brand: "",
    model: "",
    lens: "",
    aperture: "f/1.8",
    shutter: "1/100s",
    iso: 100,
    location: ""
  });
</script>

<template>
  <div class="right-panel">
    <el-tabs v-model="activeTab" type="border-card" class="right-tabs">
      <!-- 模板配置 Tab -->
      <el-tab-pane label="模板配置" name="template">
        <el-form label-width="100px">
          <el-form-item label="字体大小">
            <el-input-number v-model="defaultConfig.fontSize" :min="10" :max="60" />
          </el-form-item>

          <el-form-item label="字体颜色">
            <el-color-picker v-model="defaultConfig.color" />
          </el-form-item>

          <el-divider>图像效果</el-divider>

          <el-form-item label="模糊程度">
            <el-slider v-model="defaultConfig.blur" :min="0" :max="100" />
          </el-form-item>

          <el-form-item label="亮度">
            <el-slider v-model="defaultConfig.brightness" :min="0" :max="1" :step="0.1" />
          </el-form-item>

          <el-form-item label="饱和度">
            <el-slider v-model="defaultConfig.saturate" :min="0.5" :max="2" :step="0.1" />
          </el-form-item>

          <el-divider>边框与阴影</el-divider>

          <el-form-item label="圆角">
            <el-slider v-model="defaultConfig.photoBorderRadius" :min="0" :max="50" />
          </el-form-item>

          <el-form-item label="外边距">
            <el-slider v-model="defaultConfig.photoMargin" :min="0" :max="50" />
          </el-form-item>

          <el-form-item label="阴影">
            <el-input v-model="defaultConfig.photoBoxShadow" />
          </el-form-item>

          <el-form-item label="水印位置">
            <el-select v-model="defaultConfig.watermarkPosition" style="width: 100%">
              <el-option label="左上角" value="top-left" />
              <el-option label="右上角" value="top-right" />
              <el-option label="左下角" value="bottom-left" />
              <el-option label="右下角" value="bottom-right" />
              <el-option label="居中" value="center" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <!-- 相机信息 Tab -->
      <el-tab-pane label="相机信息" name="camera">
        <el-form label-width="100px">
          <el-form-item label="品牌">
            <el-input v-model="cameraInfo.brand" />
          </el-form-item>

          <el-form-item label="型号">
            <el-input v-model="cameraInfo.model" />
          </el-form-item>

          <el-form-item label="镜头">
            <el-input v-model="cameraInfo.lens" />
          </el-form-item>

          <el-divider>拍摄参数</el-divider>

          <el-form-item label="光圈">
            <el-input v-model="cameraInfo.aperture" />
          </el-form-item>

          <el-form-item label="快门速度">
            <el-input v-model="cameraInfo.shutter" />
          </el-form-item>

          <el-form-item label="ISO">
            <el-input-number v-model="cameraInfo.iso" :min="50" :max="12800" />
          </el-form-item>

          <el-form-item label="地点">
            <el-input v-model="cameraInfo.location" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
  .right-panel {
    flex: 1;
    padding: 16px;
    background: #fff;
    overflow-y: auto;
  }

  .right-tabs {
    height: 100%;
  }

  .extra-panel {
    padding: 8px;
    font-size: 14px;
  }
</style>
