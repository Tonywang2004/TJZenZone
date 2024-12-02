import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        username: '', // 全局 username
        loggedIn: 0, // 初始状态为 0
    }),
    actions: {
        setUsername(name) {
            this.username = name; // 更新 username
        },
        logIn() {
            this.loggedIn = 1; // 设置为登录状态
        },
        logOut() {
            this.loggedIn = 0; // 设置为未登录状态
        },
    },
});
