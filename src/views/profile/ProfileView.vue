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
                <p>{{ getEmail() }}</p>
            </li>
            <li>
                <h3>人格类型</h3>
                <p>{{ getMbti() }}</p>
            </li>
            <li>
                <h3>白噪音偏好</h3>
                <p>{{ whitenoisePreference }}</p>
            </li>
            <li>
                <h3>游戏总时长</h3>
                <p>{{ gameTime }}</p>
            </li>
        </ol>
    </div>
</template>
<script setup lang="ts">

import { useUserStore } from '@/store/userStore';
import axios from 'axios';

const userStore = useUserStore();

let whitenoisePreference = '1';
let gameTime = '1';

const getEmail = async () => {
    const response = await axios.post('http://localhost:9000/profile/email', { username: userStore.username });
    return response.data;
};

const getMbti = async () => {
    const response = await axios.post('http://localhost:9000/profile/mbti', { username: userStore.username });
    return response.data;
};

</script>

<style scoped>
.profile-view {
    text-align: center;
    font-family: Arial, sans-serif;
}

.profile-list {
    text-align: center;
    list-style: none;
    justify-content: center;
}
</style>
