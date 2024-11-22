import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        username: '', // 全局 username
    }),
    actions: {
        setUsername(name) {
            this.username = name; // 更新 username
        },
    },
});
