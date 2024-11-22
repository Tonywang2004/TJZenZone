<template>
    <div class="w-[1120px] mx-auto">
        <div
            class="mt-[70px] relative before:absolute before:mr-[36px] before:w-[16px] before:bg-gradient-to-r before:from-primary before:to-[#43B8EA] before:h-[56px] before:block before:content-['']">
            <div class="flex text-[36px] font-bold leading-none ml-[60px]">
                {{ config.apply.title }}
            </div>
        </div>
        <p></p>
        <div class="chat-container">
            <div class="chat-item">
                <div class="chat-answer">
                {{ start }}
                </div>
            </div>
            <div class="chat-item" v-for="(message, index) in messages" :key="index">
            <!-- 用户发送的消息 -->
            <div class="chat-ask" v-if="message.role==='user'">{{ message.content }}</div>
            <!-- AI 回复的消息 -->
            <div class="chat-answer" v-if="message.role==='system'">{{ message.content }}</div>
            </div>
            <el-button type="primary" id="start-btn" @click="startRecognition">开始语音输入</el-button>
            <el-button type="primary" @click="changemethod">{{auto}}</el-button>
            <el-button type="primary" v-if="auto==='手动发送'" @click="sendmessage">发送</el-button>
            <div v-if="auto==='手动发送'">
              <p></p>
              <el-input v-model="result" style="width: 100%" placeholder="Please input" />
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useConfig } from '@/composables/config';
import {ref} from 'vue'
import axios from 'axios'
const start="你好！有什么我能帮助你的吗？\n"
const auto=ref("自动发送")
//添加信息使用.push
const messages=ref([
        {"role": "system", "content": "You are a helpful assistant."},
      ])
console.log(messages)
const config = useConfig();
const result=ref("");
// 检查浏览器是否支持 SpeechRecognition
const recognitionSupported = "webkitSpeechRecognition" in window;
let startRecognition: any;

if (recognitionSupported) {
  // 初始化语音识别实例
  const recognition = new webkitSpeechRecognition();
  recognition.lang = "zh-CN"; // 设置语言为中文

  // 定义开始语音识别的方法
  startRecognition = () => {
      recognition.start(); // 开始识别
      result.value = "正在识别";
      recognition.onresult = (event: { results: { transcript: any; }[][]; }) => {
        const speechResult = event.results[0][0].transcript;
        result.value = speechResult
     };
     //对话传入后端并在添加
    //  const responce=axios.post("");
    //  messages[messages.length-1].answer=responce.data;
      recognition.onerror = (event) => {
        result.value = '发生错误：${event.error}'
      };
    };
  }
  else {
    console.error("浏览器不支持 SpeechRecognition");
    // 定义一个占位函数防止报错
    startRecognition = () => {
      result.value = "当前浏览器不支持语音识别功能。";
    };
  }

const changemethod=()=>{
  if(auto.value==="自动发送"){
    auto.value="手动发送";
    result.value='';
  }
  else{
    auto.value="自动发送";
  }
}

const sendmessage=()=>{
  messages.value.push({"role": "user", "content": result.value});

  axios.post("http://localhost:9000/chat/send",messages.value).then(res=>{
    messages.value.push({"role": "system", "content": res.data});
    console.log(messages);
    //清空输入框
    result.value='';
  })

}
</script>
<style lang="less" scoped>
:deep(.my-content) {
    display: inline-block;
    background: #EFEFEF;
    width: 807px;
}

:deep(.my-label) {
    display: inline-block;
    width: 186px;
}
.chat-container {
  padding: 20px;
  background-color: #f0f4f8;
}

.chat-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

.chat-ask {
  /* 右对齐，模拟用户的消息 */
  align-self: flex-end;
  background: #419fff;
  color: #fff;
  border-radius: 12px 2px 12px 12px;
  padding: 8px;
  max-width: 80%; /* 确保内容不超过屏幕宽度 */
  word-break: break-all; /* 长单词自动换行 */
  margin-bottom: 10px;
}
.chat-answer {
  /* 左对齐，模拟AI的回复 */
  align-self: flex-start;
  background: #daedff;
  color: #333;
  border-radius: 12px;
  padding: 8px;
  max-width: 80%; /* 确保内容不超过屏幕宽度 */
  word-break: break-all; /* 长单词自动换行 */
}
</style>