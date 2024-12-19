<template>
  <div class="profile-view">
    <div class="profile-info">
      <h3>个人资料</h3>
      <ol class="profile-list">
        <li>
          <h4>用户名</h4>
          <p>{{ userStore.username }}</p>
        </li>
        <li>
          <h4>邮箱</h4>
          <p>{{ email }}</p>
        </li>
        <li>
          <h4>人格类型</h4>
          <p>{{ mbti }}</p>
        </li>
      </ol>
    </div>
    <div class="charts">
      <div v-if="gamesContent" class="chart-message">
        <div id="gameChart" style="width: 100%; height: 100%;"/>
      </div>
      <div v-else class="chart-message">许多有趣的游戏等您探索！</div>
      <div v-if="whitenoiseContent" class="chart-message">
        <div id="whitenoiseChart" style="width: 100%; height: 100%;"/>
      </div>
      <div v-else class="chart-message">许多白噪声等您探索！</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useUserStore} from '@/store/userStore';
import axios from 'axios';
import {onMounted, ref, nextTick, watch} from 'vue';
import * as echarts from 'echarts';

const userStore = useUserStore();

let email = ref<string>('登录可以查看更多内容！');
let mbti = ref<string>('登录可以查看更多内容！');

let whitenoises = ref<Map<string, number>>(new Map());
let gametypes = ref<Array<string>>([]);
let gamescores = ref<Array<number>>([]);
let gamedurations = ref<Array<number>>([]);

let gamesContent = ref<boolean>(false);
let whitenoiseContent = ref<boolean>(false);

const getData = (async () => {
  const emailRes = await axios.post('http://localhost:9000/profile/email', {username: userStore.username});
  email.value = emailRes.data;
  const mbtiRes = await axios.post('http://localhost:9000/profile/mbti', {username: userStore.username});
  mbti.value = mbtiRes.data;
  const wnRes = await axios.post('http://localhost:9000/profile/whitenoise', {username: userStore.username});
  whitenoises.value = new Map(Object.entries(wnRes.data));
  const gameRes = await axios.post('http://localhost:9000/profile/game', {username: userStore.username});
  for (const game of gameRes.data) { // 字段名需与后端一致
    gametypes.value.push(game['gameType']);
    gamescores.value.push(game['highestScore']);
    gamedurations.value.push(game['duration']);
  }
  gamesContent.value = gametypes.value.length > 0;
  whitenoiseContent.value = whitenoises.value.size > 0;
});

const initGameChart = (()=>{
  if (document.getElementById("gameChart")){
    echarts.init(document.getElementById("gameChart")).setOption({
      title: {
        text: '游戏游玩数据'
      },
      tooltip: {},
      legend: {
        data: ['时长', '最高分']
      },
      xAxis: {
        data: gametypes.value
      },
      yAxis: {},
      series: [{
        name: '时长',
        type: 'bar',
        data: gamedurations.value
      }, {
        name: '最高分',
        type: 'bar',
        data: gamescores.value
      }]
    });
  }
});

const initWhiteNoiseChart =(()=>{
  if (document.getElementById("whitenoiseChart")) {
    echarts.init(document.getElementById("whitenoiseChart")).setOption({
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
    });
  }
})

onMounted(async () => {
  await getData();
  await nextTick();
  initGameChart();
  initWhiteNoiseChart();
});

watch(gamesContent, async (newValue) => {
  if (newValue) {
    await nextTick(); // 确保 DOM 已经更新
    initGameChart();
  }
});

watch(whitenoiseContent, async (newValue) => {
  if (newValue) {
    await nextTick(); // 确保 DOM 已经更新
    initWhiteNoiseChart();
  }
});
</script>

<style scoped>
.profile-view {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  text-align: center;
  font-family: 'Arial', sans-serif;
  padding: 20px;
}

.profile-info {
  width: 50%;
  text-align: left;
}

.charts {
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-list {
  list-style: none;
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

.chart-message {
  width: 80%;
  height: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
}

h3 {
  margin-left: 5%;
  font-size: 2em;
  /* 增大标题字体 */
  color: #007BFF;
  /* 修改标题颜色 */
}

h4 {
  margin-left: 10%;
  color: #82cbff;
  /* 修改子标题颜色 */
}

p {
  margin-left: 15%;
  color: #555;
  /* 修改文本颜色 */
}
</style>