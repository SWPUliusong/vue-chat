import faces from './face'

export default {
    user: '',   // 当前用户
    list: '',   // 聊天菜单列表
    activeList: 'friends',  // 当前聊天菜单类型
    currentOne: '',     // 当前聊天对象
    result: '',     // 搜索结果
    isChange: true,    // 决定消息的更新方式是增加还是重新赋值
    messages: [],    // 消息记录
    count: '',  // 消息个数
    faces,   // 表情
    facesShow: false    // 是否显示泡泡表情
}