import AboutView from '@/views/about/AboutView.vue'
import ApplyView from '@/views/AIchat/ApplyView.vue'
<<<<<<< HEAD
import ContactView from '@/views/personalitytest/ContactView.vue'
import Whitenoise from '@/views/whitenoise/Whitenoise.vue'
=======
import ContactView from '@/views/personalitytest/TestView.vue'
import DonationView from '@/views/whitenoise/DonationView.vue'
>>>>>>> d7cb35f22983c5472aca1737774f35e68314f038
import LoginView from '@/views/login/LoginView.vue'
import NewsDetailView from '@/views/game/NewsDetailView.vue'
import NewsView from '@/views/game/NewsView.vue'
import UserView from '@/views/user/UserView.vue'
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            name: 'home',
            path: '/',
            component: UserView,
            redirect: { name: 'about' },
            children: [
                {
                    name: 'about',
                    meta: {
                        title: 'About',
                    },
                    path: 'about',
                    component: AboutView,
                },
                {
                    name: 'AIchat',
                    meta: {
                        title: '实时AI对话',
                    },
                    path: 'AIchat',
                    component: ApplyView,
                },
                {
                    name: 'game',
                    meta: {
                        title: '解压小游戏',
                    },
                    path: 'game',
                    component: NewsView,
                },
                {
                    name: 'newsDetail',
                    meta: {
                        title: '解压小游戏',
                    },
                    path: 'news/:id',
                    component: NewsDetailView,
                },
                {
                    name: 'personalitytest',
                    meta: {
                        title: '心理小测试',
                    },
                    path: 'personalitytest',
                    component: ContactView,
                },
                {
                    name: 'whitenoise',
                    meta: {
                        title: '解压白噪声',
                    },
                    path: 'whitenoise',
                    component: Whitenoise,
                },
            ],
        },
        {
            name: 'login',
            path: '/login',
            component: LoginView,
        },
    ],
})

export default router