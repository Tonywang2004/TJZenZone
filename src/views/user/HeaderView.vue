<template>
    <div class="border-0 border-b-[1px] border-b-default border-solid">
        <div class="header">
            <RouterLink :to="{ name: 'home' }">
                <img class='headimage' :src="logo" />
            </RouterLink>
            <div class="flex-1 flex justify-end h-full">
                <div class="flex gap-[48px] h-full items-center">
                    <RouterLink v-for="menu in menus" :to="{ name: menu.name }" custom
                        v-slot="{ isActive, navigate, href }">
                        <div class="h-full flex items-center justify-center whitespace-nowrap relative after:bottom-0 after:absolute after:h-[4px] after:block after:content-[''] after:w-full"
                            :class="{ 'after:bg-primary font-semibold': isActive }">
                            <a class="no-underline text-black" :href="href" @click="navigate">{{ menu.title }}</a>
                        </div>
                    </RouterLink>
                    <img class="shrink-0 w-[32px] h-[32px] rounded-full cursor-pointer"
                        :src="user.loggedIn ? avatar : anonymous" @click="handleAvatarClick" />
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import anonymous from '@/assets/avatar-anonymous.png';
import avatar from '@/assets/avatar.png';
import logo from '@/assets/logo.png';
import { useUser } from '@/composables/user';
import { useRouter } from 'vue-router';

const user = useUser();
const router = useRouter();
const menus = [
    { title: '首页', name: 'about' },
    { title: '实时AI对话', name: 'AIchat' },
    { title: '解压小游戏', name: 'game' },
    { title: '心理小测试', name: 'quizselection' },
    { title: '解压白噪声', name: 'whitenoise' },
]
const handleAvatarClick = () => {
    // if (!user.loggedIn) {
    //     router.push({ name: 'login' });
    //     return;
    // }
    router.push({ name: 'profile' });
}
</script>
<style scoped>
.headimage {
    width: 183px;
    height: 70px;
    filter: invert(1);
}

.header {
    width: 1200px;
    height: 80px;
    margin: 0 auto;
    display: flex;
    align-self: center;
}
</style>