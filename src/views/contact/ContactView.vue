<template>
    <button @click="sendRequest">点击发送信息到网址</button>
    <p>返回的数据：{{ responseData }}</p>
</template>
<script setup lang="ts">
import { useConfig } from '@/composables/config';
import { computed } from 'vue';
import { ref } from "vue";
import axios from 'axios';

const responseData = ref();

const sendRequest = async () => {
  try {
    // 使用 POST 请求发送数据到指定网址
    const response = await axios.post("http://localhost:9000/myHello/greet2", {
      // 要发送的数据，根据需求修改
      name: "value2",
    });
    console.log("请求：", response);
    // 将返回的数据存储到响应式变量中
    responseData.value = response.data;
  } catch (error) {
    console.error("请求失败：", error);
  }
};
const pageSize = 10
const config = useConfig()
const allFaqs = computed(() => config.contact.faqs)
const page = computed(() => Math.ceil(allFaqs.value.length / pageSize))
const data = computed(() => allFaqs.value.slice((page.value - 1) * pageSize, page.value * pageSize))
</script>