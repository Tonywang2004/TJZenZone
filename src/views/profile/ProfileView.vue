<template>
  <div class="profile-view">
    <h1>个人资料</h1>
    <div class="profile-content">
      <!-- 左侧个人信息 -->
      <div class="profile-info">
        <h2>个人基本信息</h2>
        <div class="card">
          <ul class="profile-list">
            <li>
              <h3>用户名</h3>
              <p>{{ username }}</p>
            </li>
            <li>
              <h3>邮箱</h3>
              <p>{{ email }}</p>
            </li>

            <li>
              <br>
              <br>
              <h3>预留：定期报告位置</h3>
              <br>
              <br>

            </li>

          </ul>
        </div>
      </div>

      <!-- 右侧网站使用资料 -->
      <div class="site-info">
        <h2>网站使用资料</h2>
        <div class="card">
          <ul class="profile-list">
            <li>
              <h3>人格类型测试结果</h3>
              <p>{{ mbti }}</p>
            </li>
            <li>
              <h3>白噪音偏好</h3>
              <p>{{ whitenoisePreference }}</p>
            </li>
          </ul>
          <!-- 游戏时长柱状图 -->
          <h3 class="chart-title">游戏时长</h3>
          <div class="chart-container">
            <canvas id="gameDurationChart"></canvas>
          </div>


        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/userStore';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title, BarController } from 'chart.js';

// 注册Chart.js需要的模块
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

// 响应式数据
const email = ref('');
const mbti = ref('');
const whitenoisePreference = ref('');
const gameDurations = ref<{ [key: string]: string }>({});  // 修改类型为string，表示分钟数
const username = useUserStore().username; // 获取当前用户名
const gameNames = ['2048', 'memory-match', 'ctr'];

// API 请求函数
const getEmail = async () => {
  try {
    const response = await axios.post('http://localhost:9000/profile/email', { username });
    email.value = response.data;
  } catch (error) {
    console.error('获取邮箱失败:', error);
  }
};

const getMbti = async () => {
  try {
    const response = await axios.post('http://localhost:9000/profile/mbti', { username });
    mbti.value = response.data;
  } catch (error) {
    console.error('获取MBTI失败:', error);
  }
};

const getWhitenoisePreference = async () => {
  try {
    const response = await axios.post('http://localhost:9000/profile/whitenoise', { username });
    whitenoisePreference.value = response.data;
    console.log('获取白噪音偏好成功:', whitenoisePreference.value);
  } catch (error) {
    console.error('获取白噪音偏好失败:', error);
  }
};

// 获取所有游戏的游戏时长
const getGameDuration = async (gameName: string) => {
  try {
    const response = await axios.get(`http://localhost:9000/api/gamestate/${username}/${gameName}`);
    return response.data.gameDuration || 0;
  } catch (error) {
    console.error(`获取【${gameName}】游戏时长失败`, error);
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

const getAllGameDurations = async () => {
  const durations: { [key: string]: string } = {};  // 明确声明durations的类型
  for (const gameName of gameNames) {
    const gameDurationInSeconds = await getGameDuration(gameName);
    durations[gameName] = convertSecondsToMinutes(gameDurationInSeconds);
  }
  gameDurations.value = durations;
  renderChart();
};

// 渲染柱状图
const renderChart = () => {
  const ctx = document.getElementById('gameDurationChart') as HTMLCanvasElement;
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(gameDurations.value),
      datasets: [{
        label: '游戏时长（分钟）',
        data: Object.values(gameDurations.value).map(time => {
          const [minutes, seconds] = String(time).split(' ');  // 将时间转换为字符串后拆分
          const minutesNum = parseInt(minutes);
          const secondsNum = seconds ? parseInt(seconds) : 0;
          return minutesNum + (secondsNum / 60);  // 将秒数转化为分钟并加上
        }),
        backgroundColor: ['#FF6347', '#36A2EB', '#FFCE56'],
        borderColor: ['#FF6347', '#36A2EB', '#FFCE56'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            label: (tooltipItem) => {
              const game = tooltipItem.label;
              const duration = tooltipItem.raw as number;  // 强制转换为数字类型
              return `${game}: ${duration.toFixed(2)}分钟`;
            }
          }
        }
      },
      scales: {
        x: { beginAtZero: true },
        y: { beginAtZero: true }
      }
    }
  });
};

// 获取所有数据
const getData = async () => {
  await getEmail();
  await getMbti();
  await getWhitenoisePreference();
  await getAllGameDurations();
};

// 页面挂载时获取数据
onMounted(() => {
  getData();
});
</script>

<style scoped>
.profile-view {
  font-family: 'Arial', sans-serif;
  background-color: #f4f7fa;
  padding: 20px;
  max-width: 1200px;
  /* 限制最大宽度 */
  margin: 0 auto;
  /* 居中 */
  height: auto;
}

.profile-content {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 20px;
  /* 调整顶部间距 */
}

.profile-info,
.site-info {
  flex: 1;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  /* 限制单个部分的最大宽度 */
  width: 100%;
  /* 保证在小屏时宽度为100% */
}

.card {
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}

.profile-info h2,
.site-info h2 {
  color: #333;
  font-size: 1.5em;
  margin-bottom: 15px;
}

.profile-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.profile-list li {
  margin-bottom: 12px;
  padding: 12px;
  background-color: #f9f9f9;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.profile-list li:hover {
  background-color: #e0f7fa;
}

h3 {
  color: #007BFF;
}

p {
  color: #555;
  font-size: 1.2em;
}

.chart-container {
  max-width: 100%;
  height: 300px;
  margin-top: 20px;
  /* 图表和内容之间的间距 */
}

canvas {
  width: 100% !important;
  height: 100% !important;
}

@media (max-width: 768px) {
  .profile-content {
    flex-direction: column;
    gap: 15px;
    /* 更小的间隙 */
  }

  .profile-info,
  .site-info {
    max-width: none;
    /* 在小屏时不限制宽度 */
    width: 100%;
  }
}
</style>
