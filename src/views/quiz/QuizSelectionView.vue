<template>
    <div class="test-list">
        <div class="test-item" v-for="(item, index) in quizNames">
            <h2>{{ item.name }}</h2>
            <button @click="enterTest(quizNames[index].id)">{{ buttonText[index] }}</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import router from '@/router';
import { useUserStore } from '@/store/userStore';

const username = useUserStore().username;
const quizNames = ref<{ name: string; id: number }[]>([]);
const buttonText = ref<string[]>(new Array(quizNames.value.length));

const getQuizs = async () => {
    const res = await axios.post('http://localhost:9000/quiz/getQuizNames');
    quizNames.value = res.data;
    if (username !== "" && username !== undefined) {
        for (let i = 0; i < quizNames.value.length; i++) {
            const res = await axios.post('http://localhost:9000/quiz/getQuizResult', {
                username: username,
                quizId: quizNames.value[i].id
            });
            buttonText.value[i] = res.data ? '重新测试' : '开始测验';
        }
    }
    else
        buttonText.value = buttonText.value.fill("开始测验(游客)");
}

const enterTest = (id: number) => {
    router.push({ name: 'quiz', params: { id: id } });
}

// 在组件挂载时获取测验名称和按钮文字
onMounted(() => {
    getQuizs();
});
</script>

<style scoped>
.test-list {
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    margin: auto;
    text-align: center;
}

.test-item {
    margin: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 100px;
    max-width: 800px;
}

button {
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    justify-self: right;
}

button:hover {
    background-color: #0056b3;
}
</style>