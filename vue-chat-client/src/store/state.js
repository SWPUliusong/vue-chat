export default {
    user: '',   // 当前用户
    list: '',   // 聊天菜单列表
    activeList: 'friends',  // 当前聊天菜单类型
    currentOne: '',     // 当前聊天对象
    result: '',     // 搜索结果
    isChange: true,    // 聊天对象是否改变(决定消息的更新方式是增加还是重新赋值)
    messages: []    // 消息记录
}