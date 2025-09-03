<script setup lang="ts">
  import { ElButton, ElForm, ElFormItem, ElInput, ElSelect, ElOption } from "element-plus";

  // 定义 props，支持 v-model
  defineProps<{
    folderPath: string;
    outputPath: string;
    template: string;
  }>();

  // 向父组件派发事件
  const emit = defineEmits<{
    (e: "update:folderPath", value: string): void;
    (e: "update:outputPath", value: string): void;
    (e: "update:template", value: string): void;
    (e: "selectFolder"): void;
  }>();

  // 触发选择文件夹事件
  const handleSelectFolder = (): void => {
    emit("selectFolder");
  };
</script>

<template>
  <div class="left-panel">
    <el-form label-width="80px">
      <el-form-item label="选择照片">
        <el-button type="primary" @click="handleSelectFolder">选择文件夹</el-button>
        <span v-if="folderPath" style="margin-left: 8px">{{ folderPath }}</span>
      </el-form-item>

      <el-form-item label="输出路径">
        <el-input :model-value="outputPath" placeholder="选择输出路径" @input="emit('update:outputPath', $event)" />
      </el-form-item>

      <el-form-item label="水印模板">
        <el-select :model-value="template" placeholder="选择模板" @update:model-value="emit('update:template', $event)">
          <el-option label="模板 A" value="A" />
          <el-option label="模板 B" value="B" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
  .left-panel {
    padding: 16px;
  }
</style>
