<template v-else>
<div class="upInOut">
    <el-tabs v-model="activeCard" type="border-card">
        <el-tab-pane label="用户登录" name="signin">
        <el-form ref="form" :model="params" label-width="80px">
            <el-form-item label="邮箱">
            <el-input type="email" v-model="params.email"></el-input>
            </el-form-item>
            <el-form-item label="密码">
            <el-input type="password" v-model="params.password"></el-input>
            </el-form-item>
            <el-form-item label-width="40px">
            <el-button class="fullBtn" :disabled="!btnActive" type="primary" @click="signIn()">登录</el-button>
            </el-form-item>
        </el-form>
        </el-tab-pane>
        <el-tab-pane label="用户注册" name="signup">
        <el-form ref="form" :model="params" label-width="80px">
            <el-form-item label="昵称">
            <el-input type="email" :maxlength="10" v-model="params.name"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
            <el-input type="email" v-model="params.email"></el-input>
            </el-form-item>
            <el-form-item label="密码">
            <el-input type="password" :maxlength="14" v-model="params.password"></el-input>
            </el-form-item>
            <el-form-item label-width="40px">
            <el-button class="fullBtn" :disabled="!btnActive || !params.name" type="success" @click="signUp()">注册</el-button>
            </el-form-item>
        </el-form>
        </el-tab-pane>
    </el-tabs>
    
    <!--错误提示-->
    <el-dialog class="text-center" title="错误提示" v-model="errorTip" size="tiny">
        <span>{{error.msg}}</span>
        <span slot="footer" class="clearfix">
            <el-button type="primary" @click="errorTip = false">确 定</el-button>
        </span>
    </el-dialog>
</div>

</template>

<script>
  import { mapState } from 'vuex'

  export default {
    data() {
      return {
        params: {
          name: '',
          email: '',
          password: ''
        },
        activeCard: 'signin',
        errorTip: false,
        error: ''
      }
    },
    computed: {
      btnActive() {
        return this.params.email && this.params.password
      }
    },
    methods: {
      signIn() {
        let params = this.params
        let email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        if (!email.test(params.email)) {
          params.email = ''
          this.errorTip = true
          this.error = {msg: '邮箱格式错误'}
          return
        }

        this.$store
          .dispatch('signIn', { data: params })
          .catch(err => {
            this.errorTip = true
            this.error = err
          })
      },
      signUp() {
        let params = this.params
        let email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        if (!email.test(params.email)) {
          params.email = ''
          return
        }

        this.$store
          .dispatch('signUp', { data: params })
          .catch(err => {
            this.errorTip = true
            this.error = err
          })
      }
    }
  }
</script>

<style>
.upInOut {
  height: 100%;
  width: 380px;
  margin: 0 auto;
  display: flex;
  align-items: center;
}
.upInOut .el-form {
  padding: 30px 30px 30px 0;
  background: #fff;
  border-radius: 5px;
}
.upInOut .el-button:last-child {
  float: right;
}
.fullBtn {
  width: 100%;
}

</style>