<template>
    <div class="profile-view">
        <h1>个人资料</h1>
        <ol class="profile-list">
            <li>
                <h3>用户名</h3>
                <p>{{ userStore.username }}</p>
            </li>
            <li>
                <h3>邮箱</h3>
                <p>{{ email }}</p>
            </li>
            <li>
                <h3>人格类型</h3>
                <p>{{ mbti }}</p>
            </li>
            <li>
                <h3>白噪音偏好</h3>
                <p>{{ whitenoisePreference }}</p>
            </li>
            <li>
                <h3>游玩时长最长的游戏</h3>
                <p>{{ maxTimeGame }}</p>
            </li>
            <li>
                <h3>最高分游戏</h3>
                <p>{{ highScoreGame }}</p>
            </li>
        </ol>
    </div>
</template>

<script setup lang="ts">

import { useUserStore } from '@/store/userStore';
import axios from 'axios';
import { onMounted, ref } from 'vue';

const userStore = useUserStore();

let email = ref<string>('');
let mbti = ref<string>('');
let whitenoisePreference = ref<string>('');
let maxTimeGame = ref<string>('');
let highScoreGame = ref<string>('');

const getEmail = async () => {
    const response = await axios.post('http://localhost:9000/profile/email', { username: userStore.username });
    console.log(response.data);
    email.value = response.data;
};

const getMbti = async () => {
    const response = await axios.post('http://localhost:9000/profile/mbti', { username: userStore.username });
    console.log(response.data);
    mbti.value = response.data;
};

const getWhitenoisePreference = async () => {
    const response = await axios.post('http://localhost:9000/profile/whitenoise', { username: userStore.username });
    console.log(response.data);
    whitenoisePreference.value = response.data;
};

const getMaxTimeGame = async () => {
    const response = await axios.post('http://localhost:9000/profile/maxtimegame', { username: userStore.username });
    console.log(response.data);
    maxTimeGame.value = response.data;
};

const getHighScoreGame = async () => {
    const response = await axios.post('http://localhost:9000/profile/highscoregame', { username: userStore.username });
    console.log(response.data);
    highScoreGame.value = response.data;
}

const getData = async () => {
    await getEmail();
    await getMbti();
    await getWhitenoisePreference();
    await getMaxTimeGame();
    await getHighScoreGame();
}


onMounted(() => {
    getData();
});
</script>

<style scoped>
.profile-view {
    text-align: center;
    font-family: 'Arial', sans-serif;
    padding: 20px;
}

.profile-list {
    text-align: center;
    list-style: none;
    justify-content: center;
    padding: 0;
    /* 清除默认内边距 */
}

.profile-list li {
    margin: 15px 0;
    /* 增加列表项之间的间距 */
    padding: 10px;
    /* 添加内边距 */
    transition: background-color 0.3s;
    /* 增加过渡效果 */
}

.profile-list li:hover {
    background-color: #e0f7fa;
    /* 鼠标悬停时的背景颜色 */
}

h1 {
    font-size: 2em;
    /* 增大标题字体 */
    color: #333;
    /* 修改标题颜色 */
}

h3 {
    color: #007BFF;
    /* 修改子标题颜色 */
}

p {
    font-size: 1.2em;
    /* 增大段落字体 */
    color: #555;
    /* 修改文本颜色 */
}
</style>