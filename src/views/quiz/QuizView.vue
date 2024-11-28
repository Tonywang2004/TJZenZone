<template>
  <div class="container">
    <div v-if="testStatus === true">
      <h2>测试结束</h2>
      <p>你的人格类型是：{{ getResult() }}</p>
      <p>感谢参与测试！</p>
      <button @click="restartTest">重新测试</button>
    </div>
    <div v-else>
      <div v-for="(question, index) in questions">
        <h2>{{ index + 1 }}. {{ question.data.question }}</h2>
        <div class="options">
          <label v-for="level in levels" :key="level" class="option">
            <input type="radio" :value="level" v-model="userAnswers[index]" />
            {{ level }}
          </label>
        </div>
      </div>
      <button @click="submitTest">提交测试</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import router from '@/router';
import { useUserStore } from '@/store/userStore';

interface answer {
  E: number; // 外向
  I: number; // 内向
  S: number; // 感觉
  N: number; // 直觉
  T: number; // 思考
  F: number; // 感情
  J: number; // 判断
  P: number; // 知觉
}

const username = useUserStore().username;
const levels = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]; // 认同程度

// const questions = [
//   { question: "我通常在社交场合中充满活力，和很多人互动让自己感到愉快。", dimension: "E" },
//   { question: "在周末时，我更喜欢外出与朋友相聚，参与社交活动。", dimension: "E" },
//   { question: "我在工作或学习时，更倾向于与他人讨论和交流想法。", dimension: "E" },
//   { question: "当我感到疲惫时，我更喜欢独处，充电后再恢复精力。", dimension: "I" },
//   { question: "我更喜欢依赖实际的事实和数据来做决策，而不是抽象的理论或想法。", dimension: "T" },
//   { question: "在处理问题时，我更注重细节和具体的操作，而不是全局的趋势或大方向。", dimension: "S" },
//   { question: "我倾向于以创新和新的方法来看待事物，而不是遵循传统和已有的经验。", dimension: "N" },
//   { question: "我喜欢从整体的角度来思考问题，依赖直觉而不是具体的事实。", dimension: "N" },
//   { question: "在做决策时，我倾向于依赖逻辑分析和理性推理，而不是考虑情感因素。", dimension: "T" },
//   { question: "我倾向于直截了当地表达自己的意见，即使可能会伤害到他人。", dimension: "T" },
//   { question: "我认为人际关系的和谐比任务的效率更为重要。", dimension: "F" },
//   { question: "我更注重公平和公正，喜欢根据客观标准来评判人和事。", dimension: "F" },
//   { question: "我喜欢制定清晰的计划并严格按照计划执行任务。", dimension: "J" },
//   { question: "我不喜欢受到严格的规则或安排的约束，更喜欢灵活处理问题。", dimension: "P" },
//   { question: "我倾向于完成一项任务后，再考虑下一步的行动，而不是同时处理多个任务。", dimension: "J" },
//   { question: "我喜欢保持灵活性和开放性，避免过于固定的计划或决策。", dimension: "P" }
// ];
const questions = await axios.post("http://localhost:9000/quiz/getQuestions", { quizId: router.currentRoute.value.params.id });

let testStatus = ref(false);
let userAnswers = ref<number[]>(new Array(questions.data.length).fill(0)); // 存储用户的答案
let answers = ref<answer>({ "E": 0, "I": 0, "S": 0, "N": 0, "T": 0, "F": 0, "J": 0, "P": 0 }); // 存储答案

const submitTest = async () => {
  for (let i = 0; i < questions.data.length; i++) {
    const selection = userAnswers.value[i];
    if (selection !== undefined) {
      const question = questions.data[i];

      // 根据选择的认同程度更新得分
      if (question.dimension === "E") {
        answers.value.E += selection; // 认同程度累加到E
        answers.value.I -= selection; // 认同程度减少到I
      } else if (question.dimension === "I") {
        answers.value.I += selection; // 认同程度累加到I
        answers.value.E -= selection; // 认同程度减少到E
      } else if (question.dimension === "S") {
        answers.value.S += selection; // 认同程度累加到S
        answers.value.N -= selection; // 认同程度减少到N
      } else if (question.dimension === "N") {
        answers.value.N += selection; // 认同程度累加到N
        answers.value.S -= selection; // 认同程度减少到S
      } else if (question.dimension === "T") {
        answers.value.T += selection; // 认同程度累加到T
        answers.value.F -= selection; // 认同程度减少到F
      } else if (question.dimension === "F") {
        answers.value.F += selection; // 认同程度累加到F
        answers.value.T -= selection; // 认同程度减少到T
      } else if (question.dimension === "J") {
        answers.value.J += selection; // 认同程度累加到J
        answers.value.P -= selection; // 认同程度减少到P
      } else if (question.dimension === "P") {
        answers.value.P += selection; // 认同程度累加到P
        answers.value.J -= selection; // 认同程度减少到J
      }
    }
    else {
      alert("请选择答案");
      return;
    }
  }
  await axios.post("/quiz/submitQuiz", {
    quizId: router.currentRoute.value.params.id,
    username: username,
    E: answers.value.E,
    I: answers.value.I,
    S: answers.value.S,
    N: answers.value.N,
    T: answers.value.T,
    F: answers.value.F,
    J: answers.value.J,
    P: answers.value.P
  });
  testStatus.value = true;
  console.log("testStatus 更新为：", testStatus);
}

const getResult = () => {
  const { E, I, S, N, T, F, J, P } = answers.value;
  const personalityType =
    (E > I ? 'E' : 'I') +
    (S > N ? 'S' : 'N') +
    (T > F ? 'T' : 'F') +
    (J > P ? 'J' : 'P');
  return personalityType;
};

const restartTest = () => {
  userAnswers.value = new Array(questions.data.length).fill(0);
  answers.value = {
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0,
  };
  testStatus.value = false;
  console.log("testStatus 更新为：", testStatus);
};
</script>

<style scoped>
.container {
  text-align: center;
  font-family: Arial, sans-serif;
}

.options {
  display: flex;
  /* 使用flex布局 */
  justify-content: space-between;
  /* 均匀分布 */
  margin: 20px 0;
}

.option {
  display: flex;
  align-items: center;
  /* 调整横向间距 */
  cursor: pointer;
  padding: 10px;
  border: 2px solid #007BFF;
  border-radius: 5px;
  transition: background-color 0.3s, transform 0.2s;
  flex: 1;
  /* 让选项均匀分布 */
}

.option:hover {
  background-color: #e7f3ff;
  transform: scale(1.02);
}

.option::selection {
  background-color: #007BFF;
}

input[type="radio"] {
  display: none;
}

.level-text {
  margin-left: 10px;
  color: #007BFF;
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
