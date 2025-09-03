<script setup lang="ts">
  import { ref } from "vue";

  const opacity = ref(50);
  const position = ref("bottom-right");
</script>

<template>
  <div class="right-panel">
    <el-form label-width="80px">
      <el-form-item label="透明度">
        <el-slider v-model="opacity" :min="0" :max="100" />
      </el-form-item>

      <el-form-item label="位置">
        <el-select v-model="position" placeholder="选择位置">
          <el-option label="左上角" value="top-left" />
          <el-option label="右上角" value="top-right" />
          <el-option label="左下角" value="bottom-left" />
          <el-option label="右下角" value="bottom-right" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
  .right-panel {
    padding: 16px;
  }
</style>
