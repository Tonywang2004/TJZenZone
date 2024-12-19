<template>
  <div class="profile-view">
    <h1>个人资料</h1>
    <ol class="profile-list">
      <li>
        <h3>用户名</h3>
        <p>{{ userStore.username }}</p>
      </li>
      <li>
        <h3>邮箱</h3>
        <p>{{ email }}</p>
      </li>
      <li>
        <h3>人格类型</h3>
        <p>{{ mbti }}</p>
      </li>
    </ol>
    <!-- 添加柱状图的容器 -->
    <div ref="gameChart" style="width: 600px; height: 400px; justify-self: center;"></div>
    <div ref="whitenoiseChart" style="width: 600px; height: 400px; justify-self: center;"></div>
  </div>
</template>

<script setup lang="ts">

import {useUserStore} from '@/store/userStore';
import axios from 'axios';
import {onMounted, ref} from 'vue';
import * as echarts from 'echarts';

const userStore = useUserStore();

interface gameState {
  gameType: string,
  highScore: number,
  duration: number
}

let email = ref<string>('您未登录！');
let mbti = ref<string>('您未登录！');
let whitenoises = ref<Map<string, number>>(new Map());
let games = ref<Array<gameState>>([]);
let gameChart = ref<HTMLDivElement | null>(null);
let whitenoiseChart = ref<HTMLDivElement | null>(null);

onMounted(async () => {
  const emailRes = await axios.post('http://localhost:9000/profile/email', {username: userStore.username});
  email.value = emailRes.data;
  const mbtiRes = await axios.post('http://localhost:9000/profile/mbti', {username: userStore.username});
  mbti.value = mbtiRes.data;
  const wnRes = await axios.post('http://localhost:9000/profile/whitenoise', {username: userStore.username});
  whitenoises.value = new Map(Object.entries(wnRes.data));
  const gameRes = await axios.post('http://localhost:9000/profile/game', {username: userStore.username});
  for (const game of gameRes.data) { // 字段名需与后端一致
    const type = game['gameType'];
    const score = game['highestScore'];
    const duration = game['gameDuration'];
    games.value.push({gameType: type, highScore: score, duration: duration});
  }

  if (gameChart.value) {
    if (games.value.length === 0) {
      gameChart.value.style.display = 'none';
      gameChart.value.style.width = '0px';
      gameChart.value.style.height = '0px';
    }
    else{
      const myChart = echarts.init(gameChart.value);
      const gametypes = games.value.map(game => game.gameType);
      const gamedurations = games.value.map(game => game.duration);
      const gamescores = games.value.map(game => game.highScore);
      // 配置项
      const option = {
        title: {
          text: '游戏游玩数据'
        },
        tooltip: {},
        legend: {
          data: ['时长', '最高分']
        },
        xAxis: {
          data: gametypes
        },
        yAxis: {},
        series: [{
          name: '时长',
          type: 'bar',
          data: gamedurations
        }, {
          name: '最高分',
          type: 'bar',
          data: gamescores
        }]
      };
      myChart.setOption(option);
    }
  }

  if (whitenoiseChart.value) {
    const myChart = echarts.init(whitenoiseChart.value);
    if (whitenoises.value.size === 0) {
      whitenoiseChart.value.style.display = 'none';
      whitenoiseChart.value.style.width = '0px';
      whitenoiseChart.value.style.height = '0px';
    }
    else{
      // 配置项
      const option = {
        title: {
          text: '白噪声数据'
        },
        tooltip: {},
        legend: {
          data: ['时长']
        },
        xAxis: {
          data: Array.from(whitenoises.value.keys())
        },
        yAxis: {},
        series: [{
          name: '时长',
          type: 'bar',
          data: Array.from(whitenoises.value.values())
        }]
      };
      myChart.setOption(option);
    }
  }
});
</script>

<style scoped>
.profile-view {
  text-align: center;
  font-family: 'Arial', sans-serif;
  padding: 20px;
}

.profile-list {
  text-align: center;
  list-style: none;
  justify-content: center;
  padding: 0;
  /* 清除默认内边距 */
}

.profile-list li {
  margin: 15px 0;
  /* 增加列表项之间的间距 */
  padding: 10px;
  /* 添加内边距 */
  transition: background-color 0.3s;
  /* 增加过渡效果 */
}

.profile-list li:hover {
  background-color: #e0f7fa;
  /* 鼠标悬停时的背景颜色 */
}

h1 {
  font-size: 2em;
  /* 增大标题字体 */
  color: #333;
  /* 修改标题颜色 */
}

h3 {
  color: #007BFF;
  /* 修改子标题颜色 */
}

p {
  font-size: 1.2em;
  /* 增大段落字体 */
  color: #555;
  /* 修改文本颜色 */
}
</style>