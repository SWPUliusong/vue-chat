<template>
    <div class="sider-right" v-if="currentOne">
        <div class="message-show">
            <div class="avatar-area clearfix">
                <span @mouseleave="showMember=false">
                    {{currentOne.name}}
                    <i class="link" @mouseenter="getGroupMember" v-if="activeList == 'groups'" :class="showMember?'el-icon-caret-top':'el-icon-caret-bottom'"></i>
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
                <div class="content clearfix padding-10" v-for="(msg, index) in messages" :key="index">
                    <div class="text-center padding-5" v-if="msg.type==='system'">
                        <span class="chat-tip">{{msg.name}}: {{msg.content}}</span>
                    </div>
                    <template v-else>
                        <div :class="msg.from._id==user._id?'pull-right':'pull-left'">
                            <img :src="msg.from._id==user._id?user.avatar:msg.from.avatar" class="avatar">
                        </div>
                        <div class="triangle" :class="msg.from._id==user._id?'pull-right item-right':'pull-left item-left'">
                            <p :class="msg.from._id==user._id?'text-right':'text-left'">{{msg.from.name}}</p>
                            <pre class="content-item" v-html="msg.content"></pre>
                        </div>
                    </template>
                </div>
            </div>
        </div>
        <div class="message-input">
            <div class="message-options clearfix">
                <div class="pull-left options options-face">
                    <img @click.stop="toggleFaces" class="link" src="/img/paopao/face.png">
                    <div class="faces-list" v-show="facesShow">
                        <img @click="chooseFace(face)" v-for="face in faces" :src="face">
                    </div>
                </div>
                <div class="pull-left options options-img">
                    <i class="el-icon-picture"></i>
                    <form id="options-img-file">
                        <input @change="sendFile($event.target.files[0])" class="options-img-file" type="file" accept="image/jpeg, image/gif, image/png">
                    </form>
                </div>
            </div>
            <textarea id="message-content" class="scrollbar" v-model="content" @keydown.enter.stop.prevent="submitMsg()" @keydown.ctrl.stop.prevent="breakLine($event)"></textarea>
            <div class="post-btn clearfix">
                <p>
                    <span class="post-tip">enter键发送,ctrl键换行</span>
                    <el-button :disabled="!content" type="success" @click="submitMsg()">发送</el-button>
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
            page: 1,    // 按照时间降序获取的消息页码
            getMore: true,  // 是否显示下拉消息按钮
            isBeingGetMore: false,  // 是否正在获取之前的消息
            notMore: false,     // 没有更多消息
            showMember: false,  // 是否显示成员
            members: '',    // 成员
        }
    },
    computed: {
        length() {
            return this.$store.state.messages.length
        },
        ...mapState(['user', 'currentOne', 'messages', 'activeList', 'faces', 'facesShow'])
    },
    methods: {
        toggleFaces() {
            this.$store.commit('toggleFaces')
        },
        breakLine($e) {
            this.content = this.content + '\n'
            let txt = $e.target
            txt.scrollTop = txt.scrollHeight
        },
        submitMsg(content) {
            let ctt = content || this.content
            if (!ctt) return
            this.isBeingGetMore = false
            this.$store.dispatch('pushMsg', ctt.replace(/</g, '&lt;').replace(/&lt;img/g, '<img'))
            if (ctt == this.content) {
                this.content = ''
            }
        },
        getMoreMsg() {
            this.isBeingGetMore = true
            this.$store.commit('notChange')
            this.$store
                .dispatch('pullMsg', ++this.page)
                .then(flag => {
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
        },
        chooseFace(face) {
            let inputElem = document.getElementById('message-content')
            let img = `<img src="${face}">`
            this.submitMsg(img)
            inputElem.focus()
        },
        sendFile(file) {

            if (!file) return

            // 用作清空文件input
            let fileElem = document.getElementById('options-img-file')
            // 用作聚焦输入框
            let inputElem = document.getElementById('message-content')

            let valid = this.fileValid(file, 1024)
            if (!valid.flag) {
                alert(valid.msg)
                return
            }

            this.$store
                .dispatch('uploadImg', {
                    file,
                    type: this.fileValid.types[file.type]
                })
                .then(url => {
                    fileElem.reset();
                    let img = `<img src="${url.img}">`
                    this.submitMsg(img)
                    inputElem.focus()
                })
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
            let elem = document.getElementById('show-area')
            if (!newVal) return
            if (!elem) return
            if (!this.isBeingGetMore) {
                this.$nextTick(() => {
                    elem.scrollTop = elem.scrollHeight
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
    max-width: 480px;
}

.content-item img {
    max-width: 100%;
    height: auto;
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
}

.message-options {
    padding: 5px 12px;
}

.options {
    position: relative;
}

.options-face img.link {
    width: 20px;
    height: 20px;
}

.faces-list {
    width: 504px;
    background: white;
    position: absolute;
    bottom: 32px;
    border-radius: 8px;
    overflow: hidden;
}

.faces-list img {
    padding: 10px;
    cursor: pointer;
}

.faces-list img:hover {
    background: #d8d8d8;
}

.options-img {
    margin-left: 24px;
}

.options-img>i {
    color: #717171;
    font-size: 22px;
}

.options-img-file {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
}

.message-input textarea {
    box-sizing: border-box;
    display: block;
    width: 100%;
    height: 96px;
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