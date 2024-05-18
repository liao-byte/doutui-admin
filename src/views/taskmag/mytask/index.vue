<template>
  <div class="main_page">
    <div class="box">
        <div class="operation">
          <el-input v-model="city" type="text" auto-complete="off" placeholder="请输入城市" />
          <button @click="startPollingIfStopped">获 取</button>
        </div>
      <div class="ewm">
        <img :src="imgSrc" width="100%" height="100%">
      </div>
      <div class="tips">
        扫码享受抖音生活尊享福利
        <button @click="sendMessage" style="display: none;">发送消息</button>
      </div>
    </div>
    <!-- loading 遮罩层 -->
    <div v-if="loading" class="loading-mask">
      <div class="loading-icon">
        <img src="@/assets/images/loading.gif" alt="light">
      </div>
    </div>
    <!-- 这里是浮动返回的内容 -->
    <div class="floating-div" @click="goBack()">
      <img src="../../../assets/images/goback.png">
      <!-- 例如，你可以添加一个图标或文本 -->
      <i class="fas fa-info-circle"></i> <!-- 使用Font Awesome的图标作为示例 -->
    </div>
  </div>

</template>

<script>
import default_img_url from '@/assets/images/qrcode_default.jpg'
import {initLoginLog,getQRCode} from "@/api/taskmag/mytask";

export default {
  name: 'MyTask',
  props: {
    msg: String
  },
  data () {
    return {
      // 遮罩层
      loading: false,
      taskId:0,
      qrCodeUrl: null, // 用于存储 QR Code 的 URL
      pollingInterval: null, // 轮询的定时器 ID
      pollingSeconds: 0, // 已经过去的轮询秒数
      maxPollingSeconds: 60, // 最大轮询秒数
      isPolling: false, // 标记是否正在轮询
      city: "",
      imgSrc: default_img_url,
      ws: null, // WebSocket 实例
      isConnected: false, // 连接状态
      reconnectInterval: 3000, // 重连间隔，单位：毫秒
      reconnectTimer: null, // 重连定时器
    }
  },
  mounted() {
    this.ctlBar('none');
  },
  created() {
    this.connectWebSocket();
  },
  beforeDestroy() {
    this.ctlBar('block');
    this.stopPolling(); // 组件销毁前停止轮询
    this.closeWebSocket();
  },
  methods: {
    async startPolling() {
      this.loading = true;
      if (this.isPolling) {
        return; // 如果已经在轮询，则不重复启动
      }
      this.isPolling = true;
      this.pollingInterval = setInterval(async () => {
        this.pollingSeconds++;
        try {

          getQRCode(this.taskId).then(response => {
            this.qrCodeUrl = response.data.qrcode; // 更新 QR Code URL
            console.log("qrcode:"+this.qrCodeUrl);
            if(this.qrCodeUrl!=null) {
              this.imgSrc = this.qrCodeUrl;
              this.stopPolling(); // 成功获取后停止轮询
            }
          });

        } catch (error) {
          console.error('Error:', error);
        }

        // 检查是否已经轮询了60秒
        if (this.pollingSeconds >= this.maxPollingSeconds) {
          this.stopPolling();
          console.log("轮循60秒超时，未找到登录码");
          alert("生成失败，请重试");
          //this.$alert("生成失败，请重新操作");
        }
      }, 1000); // 每秒轮询一次
    },

    stopPolling() {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
      this.pollingSeconds = 0;
      this.isPolling = false;
      this.loading = false;
    },

    startPollingIfStopped() {
      //正在轮循则停止
      if (this.isPolling) {
        this.stopPolling();
      }
      try {
        //提交城市

        initLoginLog(this.city).then(response => {
          console.log(response.data);
          this.taskId = response.data.taskId;
          this.startPolling();
          const message = 'city='+this.city+'&taskId='+this.taskId+''; // 要推送的消息
          this.sendMessage(message);
        });

      } catch (error) {
        console.error('Error:', error);
      }
    },

    goBack(){
      this.$router.go(-1);
    },

    ctlBar(display) {
      const myStaticDiv = document.getElementById('tags-view-container');
      myStaticDiv.style.display = display;
      const navbarDivs = document.getElementsByClassName('navbar');
      for (let i = 0; i < navbarDivs.length; i++) {
        navbarDivs[i].style.display = display;
      }
    },

    /*WS*/
    connectWebSocket() {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        return; // 如果已经连接，则不执行任何操作
      }

      this.ws = new WebSocket('ws://38.14.232.206:3004'); // 创建 WebSocket 实例

      this.ws.onopen = () => {
        this.isConnected = true;
        console.log('WebSocket 连接已打开');
        // 发送初始消息等
      };

      this.ws.onmessage = (event) => {
        console.log('接收到消息:', event.data);
        // 处理接收到的消息
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket 错误:', error);
        // 尝试重连
        this.reconnectWebSocket();
      };

      this.ws.onclose = (event) => {
        this.isConnected = false;
        console.log('WebSocket 连接已关闭', event);
        // 尝试重连
        this.reconnectWebSocket();
      };
    },

    reconnectWebSocket() {
      if (this.reconnectTimer) return; // 如果已经有重连定时器，则不执行任何操作

      this.reconnectTimer = setTimeout(() => {
        this.connectWebSocket(); // 尝试重新连接
        this.reconnectTimer = null; // 重置重连定时器
      }, this.reconnectInterval);
    },

    closeWebSocket() {
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }

      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }
    },

    // 发送消息到 WebSocket
    sendMessage(message) {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        console.log('message:'+message);
        this.ws.send(message);
      }
    },

  }
}
</script>

<style>

.main_page {
   max-width: 750px;
   width: 100%;
   margin:0 auto;
   background: red;
   height: 100vh;
   background: #000023 url("../../../assets/images/dy_bg.jpg") no-repeat center;
   background-size: contain;
   position: relative;
   background-size: cover;
   background-repeat: no-repeat;
   background-position: center center;
   background-color: #f0f0f0;
   margin: 0;
   padding: 0;
   box-sizing: border-box;
   min-height: 100vh;
   display: flex;
   flex-direction: column;
   justify-content: space-between;

}

.box {
   position: absolute;
   left: 10%;
   width: 80%;
   top: 52%;
}
.box .tips {
    text-align: center;
    font-weight: bold;
    font-style: italic;
    font-size: 20px;
    letter-spacing: 2px;
    color: #fff;
}
.box .ewm {
   width: 65%;
   aspect-ratio: 1 / 1;
   border-radius: 5px;
   margin:20px auto 20px;
   padding: 10px;
   background: #fff;
   max-width: 250px;
}
.box .ewm img {
   border-radius: 5px;
}
.box .operation {
   background: #fff;
   width: 74%;
   max-width: 300px;
   height: 46px;
   display: flex;
   margin:0 auto;
   border-radius: 5px;
   padding: 0 10px;
   align-items: center;
   justify-content: space-between;
}
.box .operation input {
   width: calc(100% - 10px);
   border-radius: 5px;
   padding: 0 10px;
   height: 34px;
   border: 1px solid #000023;
}
.box .operation button {
   width: 80px;
   display: block;
   border-radius: 5px;
   background:#000023;
   color: #fff;
   border: none;
   height: 36px;
}

/*loading*/
.loading-mask {
   position: fixed;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   background: rgba(0, 0, 0, 0.8); /* 半透明背景 */
   display: flex;
   justify-content: center;
   align-items: center;
   z-index: 9999; /* 确保遮罩层在最上层 */
}

.loading-icon {
   /* 这里添加你的 loading 图标的样式 */
   /* 例如，你可以使用字体图标、SVG 或 GIF 图片等 */
}

.floating-div {
  position: fixed;
  top: 20px; /* 根据需要调整距离顶部的距离 */
  right: 20px; /* 根据需要调整距离右侧的距离 */
  width: 30px;
  height: 30px;
  /*background-color: rgba(255, 0, 0, 0.5); *//* 示例背景色，半透明红色 */
  border-radius: 5px; /* 可选：添加圆角 */
  display: flex; /* 如果需要垂直和水平居中内容 */
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  z-index: 9999; /* 确保它位于其他元素的上方 */
  /* 其他你需要的样式 */
}
.floating-div img{
  width: 90%;
  height: 90%;
}
</style>
