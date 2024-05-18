<template>
  <div class="model-box">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="模型配置" name="first">

        <el-button type="primary" @click="toAddModel">新增</el-button>
        <el-button type="primary" @click="toSave">保存</el-button>
        <el-collapse v-model="activeNames" @change="handleChange" style="margin:10px 0">
          <el-collapse-item :title="item.modelName" name="1" v-for="(item) in chatConfigList" >
            <el-form label-position="left" label-width="150px" size="small">
              <el-form-item label="模型名称">
                <el-input v-model="item.modelName"></el-input>
              </el-form-item>
              <el-form-item label="显示模型名称">
                <el-input v-model="item.showModelName"></el-input>
              </el-form-item>
              <el-form-item label="模型禁用">
                <el-switch :active-value="0" :inactive-value="1" v-model="item.ban"></el-switch>
              </el-form-item>
              <el-form-item label="单次扣除积分">
                <el-input-number :value="item.integral" min="0"></el-input-number>
              </el-form-item>
              <el-form-item label="平台">
                <el-select v-model="item.platformType" placeholder="请选择">
                  <el-option
                    v-for="items in options"
                    :key="items.value"
                    :label="items.label"
                    :value="items.value">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="接口地址">
                <el-input placeholder="如果不填，将使用平台默认地址" v-model="item.accessUrl"></el-input>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>


      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {getAllModel,saveOrUpdateList} from "@/api/gomagic/chatConfig";

export default {
  name: "Post",
  dicts: ['sys_normal_disable'],
  data() {
    return {
      options: [{
        value: 0,
        label: 'openAI'
      }, {
        value: 1,
        label: '文心一言'
      }],
      activeName: 'first',
      activeNames: ['1'],
      chatConfigList:[]
    }
  },
  created() {
    this.getList();
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleChange(val) {
      console.log(val);
    },
    getList(){
      getAllModel().then(res=>{
        this.chatConfigList=res.data
      })
    },
    toAddModel(){
      const newModel={
        modelName:"新建模块",
        showModelName:"新建模块",
        ban:1,
        integral:1,
        platformType:0,
        accessUrl:"",
      }
      this.chatConfigList.push(newModel);
    },
    toSave(){
      saveOrUpdateList(this.chatConfigList).then(res=>{
        this.$message.success("更新成功")
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.model-box{
  padding:0 10px;
}
</style>
