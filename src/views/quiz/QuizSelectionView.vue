<template>
    <div class="container">
        <div class="test-list">
            <div class="test-item" v-for="(item, index) in quizNames">
                <h2>{{ item.name }}</h2>
                <button @click="enterTest(quizNames[index].id)">进入测试</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import router from '@/router';

const quizNames = ref<{ name: string; id: number }[]>([]);

const getQuizNames = async () => {
    const res = await axios.post('http://localhost:9000/quiz/getQuizNames');
    quizNames.value = res.data;
}

const enterTest = (id: number) => {
    router.push({ name: 'quiz', params: { id: id } });
}

// 在组件挂载时获取测验名称
onMounted(() => {
    getQuizNames();
});
</script>

<style scoped>
.container {
    max-width: 800px;
    margin: auto;
    text-align: center;
}

.test-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

.test-item {
    margin: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 10px;
    width: 200px;
}

button {
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}
</style>