// 入口函数
$(function() {
    // 调用获取用户信息的封装函数
    getUserInfo()
})

// 退出按钮 点击事件
$('#btn_logout').on('click', function() {
    // 点击退出弹出询问框
    layer.confirm('是否确认退出?', { icon: 3, title: '提示' }, function(index) {
        // 退出后的回调函数
        // 1.清空登录产生的token
        localStorage.removeItem('token')
            // 2.自动跳转到登录页面
        location.href = '/login.html'
        layer.close(index)
    })
})

function getUserInfo() {
    // 发起ajax请求获取用户信息
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token')
        // },
        success: function(res) {
            // 获取失败
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            // 获取成功
            // 调用获取头像的封装函数
            getAvatar(res.data)
        },
        // 无论登录成功或者失败 都会执行这个complete回调函数
        // complete: function(res) {
        //     // console.log(res)
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 如果成功登录到index页面 但是complete函数中不符合正确登录的条件
        //         // 1.强制清空token
        //         localStorage.removeItem('token')
        //             // 2.强制返回login页面
        //         location.href = '/login.html'
        //     }
        // }
    })
}

// 获取头像的封装函数
function getAvatar(user) {
    // 获取用户姓名填充到头像处
    let name = user.nickname || user.username
    $('#welcome').html('欢迎&nbsp;&nbsp' + name)
        // 如果图片不为空 就一图片显示
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else { // 如果图片为空 就以文字显示 并把用户首字母大写后放入头像
        $('.layui-nav-img').hide()
        let first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}