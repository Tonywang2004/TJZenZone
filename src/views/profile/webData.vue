<template>
    <div class="app">
        <!-- 左侧部分：功能导航 -->
        <div class="sidebar">
            <h2>基本数据信息</h2>
            <p class="user-count">当前网站总注册用户量：{{ users.length }}</p>
            <div class="navigation-buttons">
                <button v-for="btn in navigationButtons" :key="btn.value" @click="changeChart(btn.value)"
                    class="nav-btn">
                    {{ btn.label }}
                </button>
            </div>
        </div>

        <!-- 右侧渲染部分 -->
        <div class="content">
            <!-- 默认视图部分 -->
            <div v-if="currentView === 'default'" class="default-view">
                <h3>项目说明</h3>
                <p>
                    ZenZone
                    是一个旨在提供数字化放松体验的项目，结合互动功能、解压游戏和情绪支持，帮助用户减轻压力、放松身心。我们的目标是通过创新的方式，提供一种可以帮助用户调整情绪的数字环境，满足现代人在快节奏生活中对心理健康和情绪管理的需求。
                </p>
                <div>
                    本项目包含多个模块，用户可以通过不同的功能部分来进行数据查看和互动。功能模块包括：
                    <ul>
                        <li><strong>AI对话</strong>：通过与智能AI的互动，用户可以获得情感支持，帮助缓解压力和焦虑。AI能够根据用户的情绪变化提供个性化的回应和陪伴，创造一个温馨的对话环境，帮助用户在轻松愉快的氛围中释放压力。
                        </li>

                        <li><strong>心理小测试</strong>：用户可以通过参与简单的心理测试，了解自己的情绪状态。测试结果会为用户提供有针对性的反馈，帮助用户识别情绪波动，并提供科学的建议，帮助其更好地管理自己的心理健康。
                        </li>

                        <li><strong>游戏时长数据</strong>：展示用户在各种在线小游戏中的使用时长，帮助了解用户偏好与参与度。</li>
                        <li><strong>白噪声时长数据</strong>：记录用户播放不同类型白噪音的时长，为用户提供科学的放松辅助。</li>
                    </ul>
                    用户可以通过选择不同的功能模块，深入了解他们的活动数据，或者参与互动，获得更多个性化的体验。
                </div>
            </div>

            <!-- 游戏数据部分 -->
            <div v-if="currentView === 'game'" class="chart-section">
                <h3>网站游戏时长数据</h3>
                <canvas id="gameDurationChart"></canvas>
                <div>
                    <p>
                        本部分展示了用户在不同游戏中的总时长数据。每个游戏的时长都是基于用户参与游戏的时间进行统计，帮助分析游戏的使用趋势、用户的偏好以及游戏的参与度。此数据对于优化游戏体验和提升用户满意度有重要意义。
                    </p>
                    <p>
                        通过这些数据，项目团队可以深入了解用户在不同游戏模块上的投入时间，从而调整游戏内容和推送策略，以提升用户体验。
                    </p>
                </div>
            </div>

            <!-- 白噪音数据部分 -->
            <div v-if="currentView === 'noise'" class="chart-section">
                <h3>网站白噪声时长数据</h3>
                <canvas id="whiteNoiseChart"></canvas>
                <div>
                    <p>
                        本部分展示了用户使用不同类型白噪音的总时长数据。白噪音是帮助用户放松和集中注意力的有效工具，广泛应用于冥想、学习、睡眠等场景。通过此数据，用户可以了解自己在各类白噪音类型中的使用习惯。
                    </p>
                    <p>
                        我们提供多种白噪音类型，用户可以选择适合自己的音频类型来缓解压力和提升放松效果。数据展示有助于用户对比不同类型白噪音的效果，从而优化其放松策略。
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import axios from 'axios';
import Chart from 'chart.js/auto';
// 响应式数据
// 功能按钮配置
const navigationButtons = [
    { label: '项目说明', value: 'default' },  // 默认视图按钮
    { label: '游戏数据部分', value: 'game' },
    { label: '白噪声数据部分', value: 'noise' },
];
const users = ref<any[]>([]);
// 存储所有用户名
const usernames = ref<string[]>([]);
const gameNames = ['2048', 'memory-match', 'ctr']; // 游戏名称列表
const gameDurations = ref<{ [gameName: string]: string }>({
    '2048': '0分钟',
    'memory-match': '0分钟',
    'ctr': '0分钟',
});  // 存储每个游戏的总时长
// 响应式数据，用来存储每种白噪声类型的总时长
const whitenoiseDurations = ref<{ [type: string]: string }>({

});
// 获取白噪声类型列表（统一小写）
const whitenoiseTypes = [
    'boating',
    'cafe',
    'crickets',
    'fire',
    'forest',
    'rain',
    'thunder',
    'waves',
    'wind'
];
const currentView = ref('default'); // 当前视图

// 获取所有用户的数据
const fetchUsers = async () => {
    try {
        const response = await axios.get('http://localhost:9000/api/users');
        users.value = response.data; // 假设后端返回一个用户对象数组

        // 提取出所有的用户名并存储到 usernames 数组中
        usernames.value = users.value.map((user: any) => user.username);

        console.log('Usernames:', usernames.value);  // 打印用户名数组
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};
// 获取单个用户的游戏时长
const getGameDuration = async (username: string, gameName: string) => {
    try {
        const response = await axios.get(`http://localhost:9000/api/gamestate/${username}/${gameName}`);
        return response.data.gameDuration || 0;  // 返回游戏时长（单位：秒）
    } catch (error) {
        // console.error(`获取【${gameName}】游戏时长失败`, error);
        return 0;
    }
};
// 转换秒数为分钟
const convertSecondsToMinutes = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    let timeString = `${minutes}分钟`;
    if (remainingSeconds > 0) {
        timeString += ` ${remainingSeconds}秒`;
    }
    return timeString;
};

// 获取整个网站的游戏总时长
const fetchTotalGameDurations = async () => {
    try {
        // 获取所有用户的列表
        const response = await axios.get('http://localhost:9000/api/users');
        const usernames = response.data.map((user: { username: string }) => user.username);  // 存储所有用户名

        // 初始化一个对象，用于存储每个游戏的总时长
        const totalGameDurations: { [gameName: string]: number } = {};
        gameNames.forEach(gameName => {
            totalGameDurations[gameName] = 0;  // 初始化每个游戏的总时长
        });

        // 获取所有用户的每个游戏的时长，并计算总时长
        const promises = usernames.map(async (username) => {
            const gameDurationPromises = gameNames.map(async (gameName) => {
                const gameDurationInSeconds = await getGameDuration(username, gameName);
                totalGameDurations[gameName] += gameDurationInSeconds;  // 累加到对应的游戏总时长
            });

            // 等待所有游戏时长获取完成
            await Promise.all(gameDurationPromises);
        });

        // 等待所有用户的游戏时长请求完成
        await Promise.all(promises);

        // 转换每个游戏的总时长为分钟格式
        for (const gameName in totalGameDurations) {
            gameDurations.value[gameName] = convertSecondsToMinutes(totalGameDurations[gameName]);
        }
        console.log('所有游戏的总时长数据:', gameDurations.value);
    } catch (error) {
        console.error('获取游戏总时长失败:', error);
    }
};


// 获取单个用户的白噪声时长
const getWhitenoiseDuration = async (username: string) => {
    try {
        const response = await axios.post('http://localhost:9000/profile/whitenoise', { username });
        // console.log(`【${username}】的白噪声时长数据:`, response.data);
        return response.data;  // 返回白噪声时长数据，格式：{ cafe: 9, waves: 65, ... }
    } catch (error) {
        // console.error(`获取【${username}】的白噪声时长失败`, error);
        return {};  // 如果获取失败，返回空对象
    }
};

// 获取整个网站的白噪声总时长
const fetchTotalWhitenoiseDurations = async () => {
    try {
        // 获取所有用户的列表
        const response = await axios.get('http://localhost:9000/api/users');
        const usernames = response.data.map((user: { username: string }) => user.username);  // 存储所有用户名
        // console.log('所有用户:', usernames);

        // 初始化一个对象，用于存储每种白噪声类型的总时长
        const totalWhitenoiseDurations: { [type: string]: number } = {};
        whitenoiseTypes.forEach(type => {
            totalWhitenoiseDurations[type] = 0;  // 初始化每种白噪声的总时长为0
        });

        // 获取所有用户的白噪声时长，并计算总时长
        const promises = usernames.map(async (username) => {
            const whitenoiseData = await getWhitenoiseDuration(username);
            // console.log(`获取【${username}】白噪声数据后，合并白噪声时长:`, whitenoiseData);

            // 累加每种白噪声类型的时长（忽略大小写）
            for (const type in whitenoiseData) {
                const standardizedType = type.toLowerCase(); // 将返回的字段转换为小写
                if (whitenoiseTypes.includes(standardizedType)) {
                    // console.log(`累计【${standardizedType}】的时长: ${whitenoiseData[type]}秒`);
                    totalWhitenoiseDurations[standardizedType] += whitenoiseData[type];  // 累加时长
                }
            }
        });

        // 等待所有用户的白噪声时长请求完成
        await Promise.all(promises);

        // 转换每种白噪声类型的总时长为分钟格式
        for (const type in totalWhitenoiseDurations) {
            whitenoiseDurations.value[type] = convertSecondsToMinutes(totalWhitenoiseDurations[type]);
        }

        console.log('所有白噪声类型的总时长数据:', whitenoiseDurations.value);
    } catch (error) {
        console.error('获取白噪声总时长失败:', error);
    }
};


// 辅助函数：将时长字符串（如 '83分钟 6秒'）转换为总分钟数
const convertTimeToMinutes = (timeString: string) => {
    const timeParts = timeString.split(' ');
    let minutes = 0;
    let seconds = 0;

    // 提取分钟数
    if (timeParts[0].includes('分钟')) {
        minutes = parseInt(timeParts[0].replace('分钟', '').trim());
    }

    // 提取秒数（如果有秒数）
    if (timeParts.length > 1 && timeParts[1].includes('秒')) {
        seconds = parseInt(timeParts[1].replace('秒', '').trim());
    }

    // 将秒转换为分钟并返回
    return minutes + seconds / 60;
};

//更换图表
const changeChart = async (view: string) => {
    currentView.value = view;
    // 等待 Vue 完成 DOM 更新，然后再更新图表
    await nextTick();
    if (view === 'game') {
        updateGameChart(); // 更新游戏时长图表
    } else if (view === 'noise') {
        updateWhiteNoiseChart(); // 更新白噪音时长图表
    }
};

const updateGameChart = () => {
    const ctx = document.getElementById('gameDurationChart') as HTMLCanvasElement;
    if (ctx) {
        const gameDurationData = Object.values(gameDurations.value).map(duration => convertTimeToMinutes(duration));
        const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#57FF33', '#FF8C00']; // 游戏图表颜色数组
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(gameDurations.value),
                datasets: [{
                    label: 'Game Duration (分钟)',
                    data: gameDurationData,
                    backgroundColor: gameDurationData.map((_, index) => colors[index % colors.length]),
                    borderColor: '#333',
                    borderWidth: 1,
                    barPercentage: 0.8,
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true, ticks: { stepSize: 5 } },
                    x: { grid: { display: false } }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const value = context.raw;
                                return `${context.label}: ${value.toFixed(2)} 分钟`;
                            }
                        }
                    }
                }
            }
        });
    }
};

const updateWhiteNoiseChart = () => {
    const ctx = document.getElementById('whiteNoiseChart') as HTMLCanvasElement;
    if (ctx) {
        const labels = Object.keys(whitenoiseDurations.value);
        const durations = Object.values(whitenoiseDurations.value).map(duration => convertTimeToMinutes(duration));

        const colors = ['#4CAF50', '#FFC107', '#03A9F4', '#9C27B0', '#FF5722']; // 白噪音图表颜色数组
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'White Noise Duration (分钟)',
                    data: durations,
                    backgroundColor: durations.map((_, index) => colors[index % colors.length]),
                    borderColor: '#333',
                    borderWidth: 1,
                    barPercentage: 0.8,
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true, ticks: { stepSize: 2 } },
                    x: { grid: { display: false } }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const value = context.raw;
                                return `${context.label}: ${value.toFixed(2)} 分钟`;
                            }
                        }
                    }
                }
            }
        });
    }
};
// 页面加载时默认获取数据
onMounted(() => {
    fetchUsers(); // 获取所有用户数据
    fetchTotalGameDurations();
    fetchTotalWhitenoiseDurations();  // 获取所有白噪声类型的总时长
});

</script>

<style scoped>
.app {
    display: flex;
    height: 100vh;
    background-color: #f8f9fa;
    max-width: 1200px;
    margin: 0 auto;
    height: 800px;
}

.sidebar {
    width: 250px;
    padding: 20px;
    background-color: #f4f4f4;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

.content {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    background-color: #fff;
}

h2 {
    font-size: 1.5rem;
    margin-bottom: 15px;
}

.user-count {
    font-size: 1.1rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
}

.total-duration {
    font-size: 1.1rem;
    color: #333;
    margin-bottom: 20px;
}

.navigation-buttons {
    display: flex;
    flex-direction: column;
}

.nav-btn {
    background-color: #007bff;
    color: white;
    padding: 10px;
    margin: 5px 0;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.nav-btn:hover {
    background-color: #0056b3;
}

.chart-section {
    margin-top: 20px;
}

h3 {
    color: #007bff;
    font-size: 1.25rem;
    margin-bottom: 10px;
}

canvas {
    width: 100% !important;
    height: 300px;
    background-color: #e0e0e0;
    border-radius: 8px;
}

div {
    font-size: 1rem;
    color: #555;
    margin-top: 10px;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .app {
        flex-direction: column;
    }

    .sidebar {
        width: 100%;
        box-shadow: none;
        padding: 10px;
    }

    .content {
        width: 100%;
        padding: 10px;
    }
}
</style>