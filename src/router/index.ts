import AboutView from '@/views/about/AboutView.vue'
import ApplyView from '@/views/apply/ApplyView.vue'
import ContactView from '@/views/contact/ContactView.vue'
import DonationView from '@/views/donation/DonationView.vue'
import LoginView from '@/views/login/LoginView.vue'
import NewsDetailView from '@/views/news/NewsDetailView.vue'
import NewsView from '@/views/news/NewsView.vue'
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
                    name: 'apply',
                    meta: {
                        title: '实时AI对话',
                    },
                    path: 'AIchat',
                    component: ApplyView,
                },
                {
                    name: 'news',
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
                    name: 'contact',
                    meta: {
                        title: '心理小测试',
                    },
                    path: 'test',
                    component: ContactView,
                },
                {
                    name: 'donation',
                    meta: {
                        title: '解压白噪声',
                    },
                    path: 'whitenoise',
                    component: DonationView,
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