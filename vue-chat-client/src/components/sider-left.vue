<template>
    <div class="sider-left">
      <ul class="list">
        <li class="item">
          <img :src="user.avatar" @click="modifyDialog=true" class="avatar link">
          <span class="name text-white">
            {{user.name}} 
            <i @click="signOut" class="el-icon-circle-cross text-red" title="退出"></i>
          </span>
        </li>
        <li class="item">
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="text-center link" @click="changeActiveList('friends')">
                <i :class="activeList=='friends'?'text-green icon-icon-yxj-user':'text-white icon-weibiaoti114'" class="iconfont"></i>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="text-center link" @click="changeActiveList('groups')">
                <i :class="activeList=='groups'?'text-green icon-kehuqunzu':'text-white icon-qunzu'" class="iconfont"></i>
              </div>
            </el-col>
          </el-row>
        </li>
        <li class="item text-center">
          <el-button class="addBtn" type="success" size="small"  @click="addDialog">
            添加{{activeList=='friends'?'好友':'群组'}}
          </el-button>
        </li>
        <li class="item link hover-black" :class="{active: currentOne._id == item._id}" 
        v-for="item in list" @click="changeActiveOne(item)">
          <img v-if="!count[item._id]" :src="item.avatar" class="avatar">
          <el-badge :value="count[item._id]" :max="99" v-else>
            <img :src="item.avatar" class="avatar">
          </el-badge>
          <span :title="item.name" class="name text-white">{{item.name}}</span>
        </li>
      </ul>

      <!--修改个人资料-->
      <el-dialog size="tiny" class="text-center" v-model="modifyDialog">
        <div @click.self="finishedModify">
          <avatar-reset></avatar-reset>
          <div class="padding-15">
            <h3>个人资料 <span class="link el-icon-edit" @click.stop="allowedModify"></span></h3>
          </div>
          <el-form :model="userParams">
            <el-form-item label="用户名称" label-width="80px">
              <el-input v-model="userParams.name" :disabled="!isModify"></el-input>
            </el-form-item>
            <el-form-item label="用户密码" label-width="80px">
              <el-input v-model="userParams.password" :disabled="!isModify"></el-input>
            </el-form-item>
            <el-form-item v-if="isModify">
              <el-button class="addBtn" type="primary" @click="updateUser"
              :disabled="disabledBtn">修改资料</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>


      <!--添加群组-->
      <el-dialog size="tiny" class="text-center" v-model="groupDialog"
      title="添加群组" >
        <el-input placeholder="群组名称" icon="search" v-model="keyword" @change="searchGroups"></el-input>
        <div class="padding-10">
          <p class="padding-5">没有找到想要的?</p>
          <el-button :disabled="!keyword" class="addBtn" 
          type="success" size="small"  @click="createGroup">
            创建该群组
          </el-button>
        </div>
        <ul class="search-result" v-if="isArray(result) && result.length > 0">
          <li class="padding-top-bottom-8 text-left clearfix" v-for="item in result">
            <img :src="item.avatar" class="avatar">
            <span :title="item.name" class="name">{{item.name}}</span>
            
            <el-button v-if="isExist.indexOf(item._id) < 0" type="info" 
            class="pull-right text-init link" @click="addGroup(item)">加入</el-button>
            <el-button :disabled="true" class="pull-right text-init link" v-else>存在</el-button>
          </li>
        </ul>
        <p v-if="isArray(result) && result.length < 1" class="padding-10">没有相关群组</p>
      </el-dialog>


      <!--添加好友-->
      <el-dialog size="tiny" class="text-center" v-model="friendDialog"
      title="添加好友" >
        <el-input placeholder="用户名称" icon="search" v-model="keyword" @change="searchUsers"></el-input>
        <ul class="search-result" v-if="isArray(result) && result.length > 0">
          <li class="padding-top-bottom-8 text-left clearfix" v-for="item in result">
            <img :src="item.avatar" class="avatar">
            <span :title="item.name" class="name">{{item.name}}</span>
            <el-button v-if="isExist.indexOf(item._id) < 0" type="info" 
            class="pull-right text-init link" @click="addFriend(item)">添加</el-button>
            <el-button :disabled="true" class="pull-right text-init link" v-else>存在</el-button>
          </li>
        </ul>
        <p v-if="isArray(result) && result.length < 1" class="padding-10">没有相关用户</p>
      </el-dialog>
    </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import Vue from 'vue'
  import avatarReset from './avatar-reset'

  export default {
    created() {
      this.$store.dispatch('getList')
      this.userParams = _.pick(this.$store.state.user, ['avatar', 'name', 'password'])
    },
    components: { avatarReset },
    data() {
      return {
        groupDialog: false,
        friendDialog: false,
        modifyDialog: false,
        keyword: '',
        isModify: false,
        userParams: ""
      }
    },
    computed: {
      disabledBtn() {
        return (this.userParams.password==this.user.password
               && this.userParams.name==this.user.name) || 
               !this.userParams.password || 
               !this.userParams.name
      },
      ...mapState(['list', 'user', 'result', 'activeList', 'currentOne', 'count'])
    },
    methods: {
      isArray: _.isArray,
      allowedModify() {
        return this.isModify = true
      },
      finishedModify() {
        this.userParams = _.pick(this.$store.state.user, ['avatar', 'name', 'password'])
        return this.isModify = false
      },
      addDialog(){
        if ('friends' === this.activeList) {
          this.friendDialog = true
        } else {
          this.groupDialog = true
        }
      },
      changeActiveOne(item) {
        let cur = this.currentOne
        if (cur && cur._id === item._id) return
        this.$store.dispatch('changeCurrentOne', item)
      },
      changeActiveList(type) {
        if (type === this.activeList) return

        this.$store.dispatch('setActiveList', type)
        this.$store.dispatch('getList')
      },
      createGroup() {
        if (!this.keyword) return
        this.$store.dispatch('createGroup', this.keyword).then(() => this.groupDialog = false)
      },
      searchGroups() {
        if (!this.keyword) return
        this.$store.dispatch('searchGroups', this.keyword)
      },
      searchUsers() {
        if (!this.keyword) return
        this.$store.dispatch('searchUsers', this.keyword)
      },
      addGroup(item) {
        this.$store.dispatch('addGroup', item._id).then(() => this.groupDialog = false)
      },
      addFriend(item) {
        this.$store.dispatch('addFriend', item._id).then(() => this.friendDialog = false)
      },
      updateUser() {
        this.$store.dispatch('updateUser', this.userParams).then(() => {
          this.finishedModify()
        })
      },
      ...mapActions(['signOut']),
    },
    watch: {
      keyword(newVal) {
        if (!newVal) {
          this.$store.dispatch('removeResult')
        }
        return
      },
      groupDialog(newVal){
        if(newVal === false) this.keyword = ''
        return
      },
      friendDialog(newVal){
        if(newVal === false) this.keyword = ''
        return
      },
      list(newVal) {
          this.isExist = _.map(newVal, '_id')
      },
      modifyDialog() {
        this.finishedModify()
      }
    }
  }
</script>

<style>
  .sider-left {
    font-family: KaiTi, "KaiTi";
    width: 280px;
    flex: none;
    background-color: #2e3238;
  }
  .item {
    padding: 12px;
    border-bottom: 1px solid #292c33;
  }
  .item .el-col:first-child {
    border-right: 1px solid #292c33;
  }
  /*.icon-qunzu, .icon-kehuqunzu {
    font-size: 29px;
  }*/

  .search-result .el-icon-plus {
    line-height: 40px;
    font-size: 20px;
  }

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 2px;
  }
  .name {
    margin-left: 12px;
    vertical-align: top;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 180px;
    display: inline-block;
  }
  .addBtn {
    padding-left: 60px;
    padding-right: 60px;
  }
  .sider-left .active {
    background-color: #3a3f45;
  }
</style>