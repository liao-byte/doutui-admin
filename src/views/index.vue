<template>
  <div class="dashboard-editor-container">
 <!--
    <panel-group @handleSetLineChartData="handleSetLineChartData"  :user-total="userTotal" :image-total="imageTotal" :message-total="messageTotal" :video-total="videoTotal"/>
-->
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px; line-height: 500px; text-align: center; font-size: 72px; ">
      <!--<line-chart :chart-data="lineChartData" />-->
      抖推生活平台
    </el-row>

<!--    <el-row :gutter="32">-->
<!--      <el-col :xs="24" :sm="24" :lg="8">-->
<!--        <div class="chart-wrapper">-->
<!--          <raddar-chart />-->
<!--        </div>-->
<!--      </el-col>-->
<!--      <el-col :xs="24" :sm="24" :lg="8">-->
<!--        <div class="chart-wrapper">-->
<!--          <pie-chart />-->
<!--        </div>-->
<!--      </el-col>-->
<!--      <el-col :xs="24" :sm="24" :lg="8">-->
<!--        <div class="chart-wrapper">-->
<!--          <bar-chart />-->
<!--        </div>-->
<!--      </el-col>-->
<!--    </el-row>-->


  </div>
</template>

<script>
import PanelGroup from './dashboard/PanelGroup'
import LineChart from './dashboard/LineChart'
import RaddarChart from './dashboard/RaddarChart'
import PieChart from './dashboard/PieChart'
import BarChart from './dashboard/BarChart'
import {getAllNumAndNewAdd} from "@/api/gomagic/gomagicUser";
import {getChatRecordAllNumAndNewAdd} from "@/api/gomagic/chatRecord";
import {getImageAllNumAndNewAdd,getVideoAllNumAndNewAdd} from "@/api/gomagic/userTask";

const lineChartData = {
  addUser: {
    dateList:[],
    numList: [],
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'Index',
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart
  },
  data() {
    return {
    addUser: {
       dateList:[],
        numList: [],
    },
        addMessage:{
            dateList:[],
            numList: [],
        },
      addImage:{
        dateList:[],
        numList: [],
      },
      addVideo:{
        dateList:[],
        numList: [],
      },
      lineChartData: lineChartData.addUser,
      userTotal:0,
      messageTotal:0,
      imageTotal:0,
      videoTotal:0,
    }
  },
  created() {
    this.getUserADDInfo(30);
    this.getChatAllAndNewAdd(30);
    this.getImageDataAllNumAndNewAdd(30);
    this.getVideoDataAllNumAndNewAdd(30);
  },
  methods: {
    handleSetLineChartData(type) {
        console.log("监听到的消息为:{}",type)
        if (type==='addMessage'){
            console.log(this.addMessage)
           this.lineChartData=this.addMessage
        }
        if (type === 'addImage'){
          console.log(this.addImage)
          this.lineChartData=this.addImage
        }
        if (type==='addVideo'){
          console.log(this.addVideo)
          this.lineChartData=this.addVideo
        }
        if (type === 'addUser'){
          console.log(this.addUser)
          this.lineChartData=this.addUser
        }
    },
    getUserADDInfo(day){
      var _this=this;
      getAllNumAndNewAdd(day).then(res=>{
        console.log(res)
        _this.userTotal=res.data.total
        for (let i = 0; i < res.data.everyDayADDList.length; i++) {
          _this.addUser.dateList.push(res.data.everyDayADDList[i].date);
          _this.addUser.numList.push(res.data.everyDayADDList[i].num);
        }
        this.lineChartData=_this.addUser
      })
    },
    getChatAllAndNewAdd(day){
        var _this=this;
        getChatRecordAllNumAndNewAdd(day).then(res=>{
            _this.messageTotal=res.data.total
            for (let i = 0; i < res.data.everyDayADDList.length; i++) {
                _this.addMessage.dateList.push(res.data.everyDayADDList[i].date);
                _this.addMessage.numList.push(res.data.everyDayADDList[i].num);
            }
        })

    },
    getImageDataAllNumAndNewAdd(day){
      const _this = this;
      getImageAllNumAndNewAdd(day).then(res=>{
        _this.imageTotal=res.data.total
        for (let i = 0; i < res.data.everyDayADDList.length; i++) {
          _this.addImage.dateList.push(res.data.everyDayADDList[i].date);
          _this.addImage.numList.push(res.data.everyDayADDList[i].num);
        }
      })
    },
    getVideoDataAllNumAndNewAdd(day){
      const _this = this;
      getVideoAllNumAndNewAdd(day).then(res=>{
        _this.videoTotal=res.data.total
        for (let i = 0; i < res.data.everyDayADDList.length; i++) {
          _this.addVideo.dateList.push(res.data.everyDayADDList[i].date);
          _this.addVideo.numList.push(res.data.everyDayADDList[i].num);
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
