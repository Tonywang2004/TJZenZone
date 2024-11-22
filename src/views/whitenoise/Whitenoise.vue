<!-- src/components/Whitenoise.vue -->
<template>
  <div class="background">
    <!-- 显示 EmotionSelect 组件 -->
    <EmotionSelect
        v-if="isEmotionSelectVisible"
        :isVisible="isEmotionSelectVisible"
        @emotionSelected="handleEmotionSelected"
    />

    <!-- 显示 Popup 组件 -->
    <Popup v-if="!isEmotionSelectVisible" :selectedEmotion="selectedEmotion"/>
  </div>
</template>

<script setup>
import { ref } from "vue";
import EmotionSelect from "./EmotionSelect.vue";
import Popup from "./Popup.vue";

const isEmotionSelectVisible = ref(true); // 控制 EmotionSelect 的显示
const selectedEmotion = ref(""); // 存储用户选择的情绪


// 用户选择情绪后调用
function handleEmotionSelected(emotion) {
  console.log(emotion);
  selectedEmotion.value = emotion; // 保存选择的情绪
  isEmotionSelectVisible.value = false; // 切换到 Popup 组件
}
</script>

<style scoped>
/* 样式 */
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url('@/assets/background.gif'); /* 设置背景图片 */
  background-size: cover; /* 背景图覆盖整个页面 */
  background-position: center; /* 居中背景图 */
  z-index: 1; /* 确保背景在底层 */
}
</style>
