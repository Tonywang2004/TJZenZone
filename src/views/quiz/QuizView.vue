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
        <h2>{{ index + 1 }}. {{ question.discription }}</h2>
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
import { onMounted, ref } from "vue";
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
let questions = ref<{ quesionId: number, quizId: number, discription: string, dimension: string }[]>([]);
console.log("questions: ", questions.value);

let testStatus = ref(false);
let userAnswers = ref<number[]>(new Array(questions.value.length).fill(0)); // 存储用户的答案
let answers = ref<answer>({ "E": 0, "I": 0, "S": 0, "N": 0, "T": 0, "F": 0, "J": 0, "P": 0 }); // 存储答案

const submitTest = async () => {
  for (let i = 0; i < questions.value.length; i++) {
    const selection = userAnswers.value[i];
    if (selection !== undefined) {
      const question = questions.value[i];

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
  if (username !== "" && username !== undefined)
    await axios.post("http://localhost:9000/quiz/submitQuiz", {
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
  userAnswers.value = new Array(questions.value.length).fill(0);
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

onMounted(async () => {
  const response = await axios.post("http://localhost:9000/quiz/getQuestions",
    { id: router.currentRoute.value.params.id });
  questions.value = response.data;
  console.log(questions.value);
});
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
