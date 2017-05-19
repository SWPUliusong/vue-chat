<template>
    <div class="avatar-wrap shadow-wrap">
        <img :src="user.avatar" :alt="user.name">
        <div class="avatar-shadow">更换头像</div>
        <input type="file" 
        accept="image/jpeg,image/gif,image/png"
        class="avatar-file" @change="modifyAvatar($event)">
    </div>
</template>

<style>
    .avatar-wrap {
        display: inline-block;
        width: 120px;
        height: 120px;
        overflow: hidden;
        border-radius: 50%;
        position: relative;
    }
    .avatar-wrap img {
        width: 120px;
        height: 120px;
    }
    .shadow-wrap {
        box-shadow: 2px 2px 4px #0087ca, -2px -2px 4px #0087ca, 2px -2px 4px #0087ca, -2px 2px 4px #0087ca;
    }
    .avatar-shadow {
        display: none;
        text-align: center;
        line-height: 120px;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        background: rgba(20, 20, 20, .6);
        color: #fff;
        z-index: 10;
    }
    .avatar-file {
        opacity: 0;
        width: 120px;
        height: 120px;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 11;
        cursor: pointer;
    }
    .avatar-wrap:hover .avatar-shadow {
        display: block;
    }
</style>

<script>
    import { mapState } from 'vuex'
    export default {
        computed: mapState(['user']),
        methods: {
            modifyAvatar($e) {
                let file = $e.target.files[0]

                if (!file) return

                let valid = this.fileValid(file)
                
                if (!valid.flag) {
                    alert(valid.msg)
                    return
                }

                let types = {
                    'image/jpeg': 'jpg', 
                    'image/gif': 'gif', 
                    'image/png': 'png'
                }
                
                this.$store.dispatch('modifyAvatar', { 
                    file,
                    type: types[file.type]
                })
            },
            fileValid(file) {
                let types = ['image/jpeg', 'image/gif', 'image/png']
                let res = {
                    flag: true
                }
                if (types.indexOf(file.type) < 0) {
                    res.flag = false
                    res.msg = '文件类型只能是gif，png，jpg'
                } else if (file.size > 100 * 1024) {
                    res.flag = false
                    res.msg = '文件大小不得超过100K'
                }

                return res
            }
        }
    }
</script>