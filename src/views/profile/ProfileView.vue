<template>
    <div class="profile-view">
        <h1>个人资料</h1>
        <ol class="profile-list">
            <li>
                <h3>用户名</h3>
                <p>{{ username }}</p>
            </li>
            <li>
                <h3>邮箱</h3>
                <p>{{ email }}</p>
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

let username = '1';
let email = '1';
let whitenoisePreference = '1';
let gameTime = '1';

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
