<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属域名" prop="serverName">
        <el-input
          v-model="queryParams.serverName"
          placeholder="所属域名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
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
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="名称" align="center" prop="title" />
      <el-table-column label="积分" align="center" prop="points" />
      <el-table-column label="规格" align="center" prop="spec" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="价格（元）" align="center" prop="price">
        <template slot-scope="scope">
          {{scope.row.price / 100}}
        </template>
      </el-table-column>
      <el-table-column label="所属域名" align="center" prop="serverName" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createDateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createDateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center"  width="180">
        <template slot-scope="scope">
          <el-button type="primary" @click="handleUpdate(scope.row)" size="small">修改</el-button>
          <el-button type="danger" @click="toDeleteById(scope.row)" size="small">删除</el-button>
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
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="积分" prop="points">
          <el-input-number :disabled="form.id!=null" v-model="form.points" placeholder="请输入积分" min="0" />
        </el-form-item>
        <el-form-item label="规格">
          <el-input v-model="form.spec" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="form.price" :precision="2" placeholder="请输入价格，单位（元）" min="0" style="width: 80%"  :disabled="form.id!=null"/>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择" :disabled="form.id!=null">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="域名" >
          <el-select v-model="form.serverName" placeholder="请选择" :disabled="form.id!=null">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getPagePackage,deleteById,getById,addOrUpdate} from "@/api/gomagic/userPackage";

export default {
  name: "Post",
  dicts: ['sys_normal_disable'],
  data() {
    return {
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
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        realName: undefined,
        nickname: undefined,
        phone: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title:[
          { required: true, message: "名称不能未空", trigger: "blur" }
        ],
        points: [
          { required: true, message: "积分不能为空", trigger: "blur" }
        ],
        price: [
          { required: true, message: "价格不能为空", trigger: "blur" }
        ],

        type: [
          { required: true, message: "类型不能为空", trigger: "blur" }
        ]
      },
      options: [
        {
          value: "localhost",
          label: "localhost"
        },
        {
          value: "www.jiuzhauyu.net",
          label: "www.jiuzhauyu.net"
        },
        {
          value: "www.myai666.net",
          label: "www.myai666.net"
        },
        {
          value: "demo.qlcdt.net",
          label: "demo.qlcdt.net"
        }
      ],
      typeOptions: [
        {
          value: 1,
          label: "个人"
        },
        {
          value: 2,
          label: "企业"
        }
      ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    toDeleteById(row){
      //更新用户的状态
      const id=row.id
      this.$modal.confirm('是否确认编号为"' + id + '"的数据项？').then(function() {
        return  deleteById(id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },

    updateBanStatus(id){
      console.log(id)
    },
    /** 查询岗位列表 */
    getList() {
      this.loading = true;
      getPagePackage(this.queryParams).then(response => {
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
      this.title = "新增套餐";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const postId = row.id
      console.log(postId)
      getById(postId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改套餐";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          addOrUpdate(this.form).then(res=>{
            this.$modal.msgSuccess("成功");
            this.getList();
            this.open=false
          })
        }
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/post/export', {
        ...this.queryParams
      }, `post_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
