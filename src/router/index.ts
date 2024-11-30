import AboutView from '@/views/about/AboutView.vue'
import ApplyView from '@/views/AIchat/ApplyView.vue'
import Whitenoise from '@/views/whitenoise/Whitenoise.vue'
import LoginView from '@/views/login/LoginView.vue'
import NewsDetailView from '@/views/game/NewsDetailView.vue'
import NewsView from '@/views/game/NewsView.vue'
import ProfileView from '@/views/profile/ProfileView.vue'
import QuizView from '@/views/quiz/QuizView.vue'
import QuizsView from '@/views/quiz/QuizsView.vue'
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
                    name: 'quizs',
                    meta: {
                        title: '心理小测试',
                    },
                    path: '/quizs',
                    component: QuizsView,
                    props: true  // 允许通过 props 传递路由参数
                },
                {
                    name: 'quiz',
                    meta: {
                        title: '心理小测试',
                    },
                    path: '/quiz/:id',
                    component: QuizView,
                },
                {
                    name: 'whitenoise',
                    meta: {
                        title: '解压白噪声',
                    },
                    path: 'whitenoise',
                    component: Whitenoise,
                },
                {
                    name: 'profile',
                    path: '/profile',
                    component: ProfileView,
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