<template>
  <div class="model-box">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="配置管理" name="first">
        <el-button type="primary" @click="toSave">保存</el-button>
        <el-form  label-width="80px" label-position="top">

          <el-form-item label="pika 文生视频:单次扣积分">
            <el-input-number style="max-width: 300px" min="0" v-model="mjDrawConfig.TEXTVIDEO.integral"></el-input-number>
          </el-form-item>
          <el-form-item label="pika 图生视频:单次扣积分">
            <el-input-number style="max-width: 300px" min="0" v-model="mjDrawConfig.IMAGEVIDEO.integral"></el-input-number>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

import { getAllMjDrawConfig,saveOrUpdateConfig
} from "@/api/gomagic/mjDrawConfig";
export default {
  name: "Post",
  dicts: ['sys_normal_disable'],
  data() {
    return {
      activeName: 'first',
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 岗位表格数据
      postList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      AddServerDiglog:false,
      AddServer:{
        accountId:"",

      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: undefined,
        userId: undefined,
        status: undefined
      },
      // 表单参数
      addMjAccount: {
        mjGuildId:"",
        mjChannelId:"",
        mjUserToken:"",
        mjSessionId:"",
        mjUserAgent:"",
        mjCoreSize:3,
        mjQueueSize:10,
        mjTimeoutMinutes:5,
      },
      // 表单校验
      rules: {
        userId: [
          { required: true, message: "用户id不能为空", trigger: "blur" }
        ],
        code: [
          { required: true, message: "兑换码不能为空", trigger: "blur" }
        ]
      },
      mjDrawConfig:{
        IMAGE:{
          name:'IMAGE',
          integral:0
        },
        BLEND:{
          name: 'BLEND',
          integral:0
        },
        DESCRIBE:{
          name: 'DESCRIBE',
          integral:0
        },
        UPSCALE:{
          name: 'UPSCALE',
          integral:0
        },
        VARIATE:{
          name: 'VARIATE',
          integral:0
        },
        RESET:{
          name: 'RESET',
          integral:0
        },
        TEXTVIDEO:{
          name: 'TEXTVIDEO',
          integral:0
        },
        IMAGEVIDEO:{
          name: 'IMAGEVIDEO',
          integral:10
        }
      }
    };
  },
  created() {
    this.getList();
    this.getMjDrawConfig();
  },
  methods: {
    toSave(){
      const param=[];
      param.push(this.mjDrawConfig.IMAGE)
      param.push(this.mjDrawConfig.BLEND)
      param.push(this.mjDrawConfig.DESCRIBE)
      param.push(this.mjDrawConfig.UPSCALE)
      param.push(this.mjDrawConfig.VARIATE)
      param.push(this.mjDrawConfig.RESET)
      param.push(this.mjDrawConfig.TEXTVIDEO)
      param.push(this.mjDrawConfig.IMAGEVIDEO)
      console.log("数据",param)
      saveOrUpdateConfig(param).then(res=>{
        this.$message.success("更新成功");
        this.getMjDrawConfig();
      })
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    /** 查询岗位列表 */
    getList() {
      this.loading = true;
      this.loading=false;
      // listPageMjAccount(this.queryParams).then(response => {
      //   this.postList = response.rows;
      //   this.total = response.total;
      //   this.loading = false;
      // });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        postId: undefined,
        postCode: undefined,
        postName: undefined,
        postSort: 0,
        status: "0",
        remark: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.postId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增账户";
    },
    /** 提交按钮 */
    submitForm: function() {
      addMjAccount(this.addMjAccount).then(res=>{
        this.$message.success("添加成功")
        this.open=false
        this.getList()
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal.confirm('是否确认删除id为"' + row.id + '"的数据项？').then(function() {
        return deleteAccount(row.id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /**同步按钮*/
    toSynchronizeAccount(row){
      synchronizeAccount(row.id).then(res=>{
        this.$message.success("点击同步成功，请等待一会后刷新页面")
      })
    },
    toAddServer(row){
      this.AddServerDiglog=true
      this.AddServer.accountId=row.id
    },
    toCreateContainer(){
      createContainer(this.AddServer).then(res=>{
        this.$message.success("创建服务成功");
        this.AddServerDiglog=false;
        this.getList();
      })
    },
    toStartContainer(row){
      starterContainer(row.containerId).then(res=>{
        this.$message.success("启动容器")
        this.getList()
      })
    },
    getMjDrawConfig(){
      getAllMjDrawConfig().then(res=>{
        if (res.data!=null && res.data!=='' && res.data!==undefined){
          this.mjDrawConfig=res.data
          console.log(this.mjDrawConfig)
        }
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.model-box{
  padding:0 20px;
}
</style>
