<template>
  <div class="mbti-test">
    <h1>MBTI 人格测试</h1>
    <div v-if="currentQuestion < questions.length">
      <h2>{{ questions[currentQuestion].question }}</h2>
      <div>
        <label v-for="level in levels" :key="level">
          <input type="radio" :value="level" v-model="userAnswers[currentQuestion]" />
          {{ level }}
        </label>
      </div>
      <button @click="nextQuestion">下一题</button>
    </div>
    <div v-else>
      <h2>测试结束</h2>
      <p>你的人格类型是：{{ getResult() }}</p>
      <p>感谢参与测试！</p>
      <button @click="restartTest">重新测试</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentQuestion: 0,
      userAnswers: [], // 存储用户的答案
      answers: {
        E: 0, // 外向
        I: 0, // 内向
        S: 0, // 感觉
        N: 0, // 直觉
        T: 0, // 思考
        F: 0, // 感情
        J: 0, // 判断
        P: 0, // 知觉
      },
      levels: [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5], // 认同程度
      questions: [
        { question: "我通常在社交场合中充满活力，和很多人互动让自己感到愉快。", dimension: "E" },
        { question: "在周末时，我更喜欢外出与朋友相聚，参与社交活动。", dimension: "E" },
        { question: "我在工作或学习时，更倾向于与他人讨论和交流想法。", dimension: "E" },
        { question: "当我感到疲惫时，我更喜欢独处，充电后再恢复精力。", dimension: "I" },
        { question: "我更喜欢依赖实际的事实和数据来做决策，而不是抽象的理论或想法。", dimension: "T" },
        { question: "在处理问题时，我更注重细节和具体的操作，而不是全局的趋势或大方向。", dimension: "S" },
        { question: "我倾向于以创新和新的方法来看待事物，而不是遵循传统和已有的经验。", dimension: "N" },
        { question: "我喜欢从整体的角度来思考问题，依赖直觉而不是具体的事实。", dimension: "N" },
        { question: "在做决策时，我倾向于依赖逻辑分析和理性推理，而不是考虑情感因素。", dimension: "T" },
        { question: "我倾向于直截了当地表达自己的意见，即使可能会伤害到他人。", dimension: "T" },
        { question: "我认为人际关系的和谐比任务的效率更为重要。", dimension: "F" },
        { question: "我更注重公平和公正，喜欢根据客观标准来评判人和事。", dimension: "F" },
        { question: "我喜欢制定清晰的计划并严格按照计划执行任务。", dimension: "J" },
        { question: "我不喜欢受到严格的规则或安排的约束，更喜欢灵活处理问题。", dimension: "P" },
        { question: "我倾向于完成一项任务后，再考虑下一步的行动，而不是同时处理多个任务。", dimension: "J" },
        { question: "我喜欢保持灵活性和开放性，避免过于固定的计划或决策。", dimension: "P" }
      ],
    };
  },
  methods: {
    nextQuestion() {
      const selection = this.userAnswers[this.currentQuestion];
      if (selection !== undefined) {
        const question = this.questions[this.currentQuestion];

        // 根据选择的认同程度更新得分
        if (question.dimension === "E") {
          this.answers.E += selection; // 认同程度累加到E
          this.answers.I -= selection; // 认同程度减少到I
        } else if (question.dimension === "I") {
          this.answers.I += selection; // 认同程度累加到I
          this.answers.E -= selection; // 认同程度减少到E
        } else if (question.dimension === "S") {
          this.answers.S += selection; // 认同程度累加到S
          this.answers.N -= selection; // 认同程度减少到N
        } else if (question.dimension === "N") {
          this.answers.N += selection; // 认同程度累加到N
          this.answers.S -= selection; // 认同程度减少到S
        } else if (question.dimension === "T") {
          this.answers.T += selection; // 认同程度累加到T
          this.answers.F -= selection; // 认同程度减少到F
        } else if (question.dimension === "F") {
          this.answers.F += selection; // 认同程度累加到F
          this.answers.T -= selection; // 认同程度减少到T
        } else if (question.dimension === "J") {
          this.answers.J += selection; // 认同程度累加到J
          this.answers.P -= selection; // 认同程度减少到P
        } else if (question.dimension === "P") {
          this.answers.P += selection; // 认同程度累加到P
          this.answers.J -= selection; // 认同程度减少到J
        }

        this.currentQuestion++;
      }
    },
    getResult() {
      const { E, I, S, N, T, F, J, P } = this.answers;
      const personalityType =
        (E > I ? 'E' : 'I') +
        (S > N ? 'S' : 'N') +
        (T > F ? 'T' : 'F') +
        (J > P ? 'J' : 'P');
      return personalityType;
    },
    restartTest() {
      this.currentQuestion = 0;
      this.userAnswers = [];
      this.answers = {
        E: 0,
        I: 0,
        S: 0,
        N: 0,
        T: 0,
        F: 0,
        J: 0,
        P: 0,
      };
    },
  },
};
</script>

<style scoped>
.mbti-test {
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
