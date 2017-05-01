<template>
    <div class="sider-right" v-if="currentOne">
        <div class="message-show">
            <div class="avatar-area clearfix">
                <span @mouseenter="getGroupMember" @mouseleave="showMember=false">
                    {{currentOne.name}} 
                    <i v-if="activeList == 'groups'" 
                    :class="showMember?'el-icon-caret-top':'el-icon-caret-bottom'"></i>
                </span>
                <p class="pull-right padding-right-15">
                    <el-button @click="quit" type="danger">{{activeList=='friends'?'删除好友':'退出群组'}}</el-button>
                </p>
                <div v-if="showMember" class="member-list scrollbar" @mouseenter="showMember=true" @mouseleave="showMember=false">
                    <div :title="item.name" class="member-item padding-10" v-for="item in members">
                        <img :src="item.avatar" class="avatar">
                        <p class="member-name">{{item.name}}</p>
                    </div>
                </div>
            </div>
            <div class="show-area scrollbar" id="show-area">
                <div class="text-center padding-5" v-if="notMore">
                    <span class="chat-tip">没有更早的消息</span>
                </div>
                <div class="text-center padding-5" v-if="getMore && messages.length>0">
                    <i class="padding-5 el-icon-arrow-down link" @click="getMoreMsg" title="获取更早的消息"></i>
                </div>
                <div class="content clearfix padding-10" v-for="msg in messages">
                    <div class="text-center padding-5" v-if="msg.type==='system'">
                        <span class="chat-tip">{{msg.name}}: {{msg.content}}</span>
                    </div>
                    <template v-else>
                        <div :class="msg.from._id==user._id?'pull-right':'pull-left'">
                            <img :src="msg.from._id==user._id?user.avatar:msg.from.avatar" class="avatar">
                        </div>
                        <div class="triangle" 
                        :class="msg.from._id==user._id?'pull-right item-right':'pull-left item-left'">
                            <p>{{msg.from.name}}</p>
                            <pre class="content-item">{{msg.content}}</pre>
                        </div>
                    </template>
                </div>
            </div>
        </div>
        <div class="message-input">
            <textarea class="scrollbar"
            id="msg-input" v-model="content"
            @keydown.enter.stop.prevent="submitMsg"
            @keydown.ctrl.enter="breakLine()"></textarea>
            <div class="post-btn clearfix">
                <p>
                    <span class="post-tip">enter键发送,ctrl+enter换行</span>
                    <el-button :disabled="!content" type="success" @click="submitMsg">发送</el-button>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    export default {
        data() {
            return {
                content: '',
                page: 1,
                getMore: true,
                notMore: false,
                showMember: false,
                members: ''
            }
        },
        computed: {
            length() {
                return this.$store.state.messages.length
            },
            ...mapState(['user', 'currentOne', 'messages', 'activeList', 'isChange'])
        },
        methods: {
            breakLine() {
                this.content = this.content + '\n'
                let txt = document.getElementById('msg-input')
                txt.scrollTop = txt.scrollHeight
            },
            submitMsg() {
                this.$store.dispatch('pushMsg', this.content)
                this.content = ''
            },
            getMoreMsg() {
                this.$store.commit('notChange')
                this.$store
                    .dispatch('pullMsg', ++this.page)
                    .then(flag => {
                        console.log(flag)
                        if (flag === false) {
                            this.getMore = false
                            this.notMore = true
                            setTimeout(() => { this.notMore = false }, 500)
                        }
                    })
            },
            quit() {
                if (this.activeList === 'friends') {
                    this.$store.dispatch('removeFriend')
                } else {
                    this.$store.dispatch('removeGroup')
                }
            },
            getGroupMember() {
                this.showMember = true
                this.$store.dispatch('getGroupMember').then(members => this.members = members)
            }
        },
        watch: {
            currentOne(newVal) {
                if (!newVal) return
                this.getMore = true
                this.notMore = false
                this.page = 1
                this.$store.dispatch('pullMsg', this.page)
            },
            length(newVal) {
                if (!newVal) return
                if (this.isChange) {
                    this.$nextTick(() => {
                        let show = document.getElementById('show-area')
                        show.scrollTop = show.scrollHeight
                    })
                }
            }
        }
    }
</script>

<style>
.sider-right {
  font-family: KaiTi, "KaiTi";
  flex: auto;
  display: flex;
  flex-direction: column;
  background-color: #eeeeee;
}
.message-show {
    height: 460px;
    flex: 1 0 auto;
    border-bottom: 1px solid #cfcfcf;
    display: flex;
    flex-direction: column;
}
.avatar-area {
    flex: none;
    height: 50px;
    text-align: center;
    line-height: 50px;
    border-bottom: 1px solid #cfcfcf;
    position: relative;
}
.member-list {
    position: absolute;
    height: 150px;
    width: 100%;
    background: rgba(35, 35, 35, 0.9);
    top: 100%;
    left: 0;
    z-index: 10;
    color: #fdfdfd;
    line-height: normal;
}
.member-item {
    float: left;
}
.member-name {
    font-size: 12px;
    max-width: 72px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.avatar-area span {
    display: inline-block;
    max-width: 280px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.show-area {
    flex: auto;
    overflow: auto;
}
.content-item {
    font-family: KaiTi, "KaiTi";
    background: #b2e281;
    padding: 12px;
    border-radius: 5px;
    max-width: 280px;
}
.item-right {
    margin-right: 12px;
}
.triangle.item-right:after {
    border-left-color: #b2e281;
    right: -12px;
}
.item-left {
    margin-left: 12px;
}
.triangle.item-left:after {
    border-right-color: #b2e281;
    left: -12px;
}
.triangle {
    position: relative;
}
.triangle:after {
    content: '';
    position: absolute;
    top: 24px;
    border: 6px solid transparent;
}

.chat-tip {
    background: #fff;
    padding: 2px 15px;
    border-radius: 11px;
    display: inline-block;
    max-width: 360px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.message-input {
    height: 180px;
    flex: none;
    padding-top: 24px;
}
.message-input textarea {
    box-sizing: border-box;
    display: block;
    width: 100%;
    height: 130px;
    border: none;
    outline: none;
    padding: 12px;
    padding-top: 0;
    overflow: auto;
    font-size: 16px;
    font-family: KaiTi, "KaiTi";
    background: #eeeeee;
}
.post-btn {
    height: 50px;
}
.post-btn p {
    float: right;
    padding-right: 20px;
}
span.post-tip {
    line-height: 50px;
}
</style>