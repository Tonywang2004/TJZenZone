<template>
  <div class="psychological-test">
    <h1>心理小测试</h1>
    <div v-if="currentQuestion < questions.length">
      <h2>{{ questions[currentQuestion].question }}</h2>
      <div v-for="(answer, index) in questions[currentQuestion].answers" :key="index">
        <button @click="selectAnswer(index)">{{ answer }}</button>
      </div>
    </div>
    <div v-else>
      <h2>测试结果</h2>
      <p>{{ result }}</p>
      <button @click="restartTest">重新测试</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentQuestion: 0,
      answers: [],
      questions: [
        {
          question: "你最喜欢的季节是？",
          answers: ["春天", "夏天", "秋天", "冬天"],
        },
        {
          question: "你的理想职业是什么？",
          answers: ["医生", "老师", "工程师", "艺术家"],
        },
        {
          question: "你对待困难的态度是？",
          answers: ["勇敢面对", "逃避", "寻求帮助", "找到其他解决办法"],
        },
      ],
    };
  },
  computed: {
    result() {
      return this.answers.length ? `你的选择是：${this.answers.join(', ')}` : '';
    },
  },
  methods: {
    selectAnswer(index) {
      this.answers.push(this.questions[this.currentQuestion].answers[index]);
      this.currentQuestion++;
    },
    restartTest() {
      this.currentQuestion = 0;
      this.answers = [];
    },
  },
};
</script>

<style scoped>
.psychological-test {
  text-align: center;
  font-family: Arial, sans-serif;
}

button {
  margin: 5px;
  padding: 10px 15px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>