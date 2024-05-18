<template>
  <div class="model-box">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="账号池" name="first">
        <div>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
            >新增</el-button>
          </el-col>
        </el-row>

        <el-table v-loading="loading" :data="postList" @selection-change="handleSelectionChange">
          <el-table-column label="账户名称" align="center" prop="mjAccountName" />
          <el-table-column label="服务器id" align="center" prop="mjGuildId" />
          <el-table-column label="通道id" align="center" prop="mjChannelId" />
<!--          <el-table-column label="快速剩余时间" align="center" prop="mjFastTime" />-->
<!--          <el-table-column label="总用量" align="center" prop="mjLifeTime" />-->
<!--          <el-table-column label="relax用量" align="center" prop="mjRelaxedTime" />-->
<!--          <el-table-column label="隐私模式" align="center" prop="mjVisibilityMode" />-->
          <el-table-column label="运行状态" >
            <template slot-scope="scope">
              <div v-if="scope.row.mjStatus ===0">待启动</div>
              <div v-if="scope.row.mjStatus === 1">运行中</div>
              <div v-if="scope.row.mjStatus === 2">服务停止</div>
            </template>

          </el-table-column>
          <el-table-column label="操作"  class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                v-if="scope.row.mjStatus ===0"
                @click="toStartContainer(scope.row)"
              >启动服务</el-button>
              <el-button
                v-if="scope.row.mjStatus===1 || scope.row.mjStatus===2"
                size="mini"
                type="text"
                @click="toRestart(scope.row)"
              >重启服务</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />

        <!-- 添加或修改岗位对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
          <el-form  ref="from"  label-width="120px">
            <el-form-item label="服务器id" prop="userId">
              <el-input v-model="addMjAccount.mjGuildId" placeholder="请输入服务器id" />
            </el-form-item>
            <el-form-item label="频道id" prop="code">
              <el-input v-model="addMjAccount.mjChannelId" placeholder="请输入频道id" />
            </el-form-item>
            <el-form-item label="用户token" prop="userId">
              <el-input v-model="addMjAccount.mjUserToken" placeholder="请输入用户token" />
            </el-form-item>
            <el-form-item label="用户sessionId" prop="userId">
              <el-input v-model="addMjAccount.mjSessionId" placeholder="请输入用户sessionId" />
            </el-form-item>
            <el-form-item label="用户Agent" prop="userId">
              <el-input v-model="addMjAccount.mjUserAgent" placeholder="请输入用户的Agent" />
            </el-form-item>
            <el-form-item label="用户cookie" prop="userId">
              <el-input  v-model="addMjAccount.cookie" placeholder="请输入用户cookie"   type="textarea"
                         :rows="3" />
            </el-form-item>
            <el-form-item label="并发数" prop="userId">
              <el-input-number v-model="addMjAccount.mjCoreSize" placeholder="请输入用户id" />
            </el-form-item>
            <el-form-item label="等待队列" prop="userId">
              <el-input-number v-model="addMjAccount.mjQueueSize" placeholder="请输入用户id" />
            </el-form-item>
            <el-form-item label="任务超时(分钟)" prop="userId">
              <el-input-number  v-model="addMjAccount.mjTimeoutMinutes" placeholder="请输入任务超时" />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>

        <!-- 添加服务器配置 -->
        <el-dialog :title="title" :visible.sync="AddServerDiglog" width="600px" append-to-body>
          <el-form  ref="from"  label-width="120px">
            <el-form-item label="请输入端口号" prop="userId">
              <el-input-number v-model="AddServer.port" placeholder="请输入服务器端口号" />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="toCreateContainer">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>
      </div></el-tab-pane>
      <el-tab-pane label="配置管理" name="second">
        <el-button type="primary" @click="toSave">保存</el-button>
        <el-form  label-width="80px" label-position="top">

          <el-form-item label="Midjourney 文生图:单次扣积分">
            <el-input-number style="max-width: 300px" min="0" v-model="mjDrawConfig.IMAGE.integral"></el-input-number>
          </el-form-item>
          <el-form-item label="Midjourney 混图:单次扣积分">
            <el-input-number style="max-width: 300px" min="0" v-model="mjDrawConfig.BLEND.integral"></el-input-number>
          </el-form-item>
          <el-form-item label="Midjourney 咒语解析:单次扣积分">
            <el-input-number style="max-width: 300px" min="0" v-model="mjDrawConfig.DESCRIBE.integral"></el-input-number>
          </el-form-item>
          <el-form-item label="Midjourney 放大:单次扣积分">
            <el-input-number style="max-width: 300px" min="0" v-model="mjDrawConfig.UPSCALE.integral"></el-input-number>
          </el-form-item>
          <el-form-item label="Midjourney 微调:单次扣积分">
            <el-input-number style="max-width: 300px" min="0"  v-model="mjDrawConfig.VARIATE.integral"></el-input-number>
          </el-form-item>
          <el-form-item label="Midjourney 重新生成:单次扣积分">
            <el-input-number style="max-width: 300px" min="0" v-model="mjDrawConfig.RESET.integral"></el-input-number>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

import {
  addMjAccount,
  createContainer,
  deleteAccount,
  starterContainer,
  synchronizeAccount,
  listPageMjAccount, startMjService,restartMjService
} from "@/api/gomagic/mjAccount";
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
      listPageMjAccount(this.queryParams).then(response => {
        this.postList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
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

      this.$modal.confirm('是否确认启动id为"' + row.id + '"的mj服务？').then(function() {
        return startMjService(row.id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("启动成功");
      }).catch(() => {});
    },
    toRestart(row){
      this.$modal.confirm('是否确认重启id为"' + row.id + '"的mj服务？').then(function() {
        return restartMjService(row.id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("重启成功");
      }).catch(() => {});
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
