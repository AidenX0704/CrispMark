<script setup lang="ts">
  import { Setting, InfoFilled, FolderOpened, RefreshRight } from "@element-plus/icons-vue";

  defineProps<{
    folderPath: string;
    outputPath: string;
    template: string;
  }>();

  const emit = defineEmits<{
    (e: "update:folderPath", value: string): void;
    (e: "update:outputPath", value: string): void;
    (e: "update:template", value: string): void;
    (e: "selectFolder"): void;
    (e: "selectOutput"): void;
    (e: "openSettings"): void;
    (e: "openAbout"): void;
    (e: "startProcess"): void;
    (e: "openHistory"): void;
    (e: "manageTemplates"): void;
  }>();

  const handleSelectFolder = (): void => emit("selectFolder");
  const handleSelectOutput = (): void => emit("selectOutput");
  const handleStartProcess = (): void => emit("startProcess");
</script>

<template>
  <div class="left-panel">
    <!-- 顶部标题 -->
    <div class="panel-header">
      <h2 class="app-title">批量水印工具</h2>
      <span class="subtitle">Photo Watermark Manager</span>
    </div>

    <el-divider />

    <!-- 核心功能 -->
    <el-form label-width="90px" class="panel-form">
      <!-- 选择照片目录 -->
      <el-form-item label="照片目录">
        <el-button type="primary" :icon="FolderOpened" @click="handleSelectFolder"> 选择文件夹 </el-button>
      </el-form-item>
      <div v-if="folderPath" class="path-text">{{ folderPath }}</div>

      <!-- 输出目录 -->
      <el-form-item label="输出目录">
        <el-button type="success" :icon="FolderOpened" @click="handleSelectOutput"> 选择输出路径 </el-button>
      </el-form-item>
      <div v-if="outputPath" class="path-text">{{ outputPath }}</div>

      <!-- 水印模板选择 -->
      <el-form-item label="水印模板">
        <div class="template-options">
          <el-card
            v-for="tpl in [{ label: '高斯模糊', value: 'A' }]"
            :key="tpl.value"
            shadow="hover"
            :class="['template-card', { active: template === tpl.value }]"
            @click="emit('update:template', tpl.value)"
          >
            <div class="tpl-label">{{ tpl.label }}</div>
          </el-card>
        </div>
      </el-form-item>
    </el-form>

    <el-divider />

    <!-- 扩展功能区 -->
    <div class="extra-tools">
      <el-button type="primary" size="large" style="width: 100%" :icon="RefreshRight" @click="handleStartProcess">
        开始处理
      </el-button>

      <div class="quick-actions">
        <el-tooltip content="软件设置" placement="top">
          <el-button circle :icon="Setting" @click="emit('openSettings')" />
        </el-tooltip>

        <el-tooltip content="关于" placement="top">
          <el-button circle :icon="InfoFilled" @click="emit('openAbout')" />
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .left-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #fafafa;
    border-right: 1px solid #ebeef5;
    padding: 16px;
    box-sizing: border-box;
  }

  .panel-header {
    text-align: center;
    margin-bottom: 12px;
  }

  .app-title {
    font-size: 18px;
    font-weight: bold;
    margin: 0;
  }

  .subtitle {
    font-size: 12px;
    color: #909399;
  }

  .panel-form {
    flex: 1;
    overflow-y: auto;
    padding-right: 4px;
  }

  .path-text {
    margin: -8px 0 12px 92px;
    font-size: 12px;
    color: #606266;
    word-break: break-all;
  }

  .template-options {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .template-card {
    cursor: pointer;
    text-align: center;
    padding: 12px;
    border-radius: 8px;
    transition: all 0.2s ease;
  }
  .template-card.active {
    border: 2px solid #409eff;
    background-color: #ecf5ff;
  }

  .tpl-label {
    font-size: 14px;
    font-weight: 500;
  }

  .extra-tools {
    margin-top: auto;
  }

  .quick-actions {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-top: 12px;
  }
</style>
