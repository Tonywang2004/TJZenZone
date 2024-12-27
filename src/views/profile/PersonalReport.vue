<template>
  <div class="app">
    <!-- 左侧部分：功能导航 -->
    <div class="sidebar">
      <h2>基本数据信息</h2>
      <div class="navigation-buttons">
        <button @click="" class="nav-btn">新建报告</button>
        <button v-for="btn in navigationButtons" :key="btn.index" @click=""
                class="nav-btn">
          {{ btn.label }}
        </button>
      </div>
    </div>

    <!-- 右侧渲染部分 -->
    <div class="content">
      <div v-if="currentView == 0" class="no-report-info">
        请选择一个报告或新建一个报告
      </div>
      <div v-else class="charts">
        <h3>网站游戏时长数据</h3>
        <canvas id="gameDurationChart"></canvas>
        <p>本部分展示了您在不同游戏中的总时长数据。通过此数据，您可以了解自己玩的时间最长的游戏是哪个。 </p>
        <h3>网站白噪声时长数据</h3>
        <canvas id="whiteNoiseChart"></canvas>
        <p>
          本部分展示了您使用不同类型白噪音的总时长数据。白噪音是帮助用户放松和集中注意力的有效工具，广泛应用于冥想、学习、睡眠等场景。通过此数据，您可以了解自己在各类白噪音类型中的使用习惯。</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import axios from 'axios';
import Chart from 'chart.js/auto';
import {useUserStore} from '@/store/userStore'

const navigationButtons = [{label: '报告0', index: 0},];
const username = useUserStore().username;
const gameDurations = ref<{ [gameType: string]: number }>({});  // 存储每个游戏的总时长
const whitenoiseDurations = ref<{ [type: string]: string }>({});//存储每种白噪声类型的总时长
const currentView = ref(1); // 当前视图

// 获取单个用户的游戏时长
const getGameDuration = async () => {
  const response = await axios.post(`http://localhost:9000/profile/gametime`, {username: username});
  gameDurations.value = response.data;
};

// 获取单个用户的白噪声时长
const getWhitenoiseDuration = async () => {
  const response = await axios.post('http://localhost:9000/profile/whitenoise', {username: username});
  whitenoiseDurations.value = response.data;
};

const updateGameChart = () => {
  const ctx = document.getElementById('gameDurationChart') as HTMLCanvasElement;
  if (ctx) {
    const labels = Object.keys(gameDurations.value);
    const durations = Object.values(gameDurations.value);
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#57FF33', '#FF8C00']; // 游戏图表颜色数组
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Game Duration (秒)',
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
          y: {beginAtZero: true, ticks: {stepSize: 5}},
          x: {grid: {display: false}}
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                return `${context.label}: ${context.raw} 秒`;
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
    const durations = Object.values(whitenoiseDurations.value);

    const colors = ['#4CAF50', '#FFC107', '#03A9F4', '#9C27B0', '#FF5722']; // 白噪音图表颜色数组
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'White Noise Duration (秒)',
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
          y: {beginAtZero: true, ticks: {stepSize: 2}},
          x: {grid: {display: false}}
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                return `${context.label}: ${context.raw} 秒`;
              }
            }
          }
        }
      }
    });
  }
};
// 页面加载时默认获取数据
onMounted(async () => {
  await getGameDuration();
  await getWhitenoiseDuration();  // 获取所有白噪声类型的总时长
  updateGameChart();
  updateWhiteNoiseChart();
});

</script>

<style scoped>
.app {
  display: flex;
  height: 100vh;
  background-color: #f8f9fa;
  max-width: 1200px;
  margin: 0 auto;
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

.charts {
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