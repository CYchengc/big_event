$(function() {
    let form = layui.form

    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '用户昵称长度在1-6个字符之间'
            }
        }
    })

    initUserInfo()
        //进入用户个人资料页面获取用户信息(方便后面重置按钮重复使用)
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return console.log(res.message)
                }

                form.val('formUserInfo', res.data)
            }
        })
    }

    $('#btnReset').on('click', function(e) {
        // 阻止默认重置清空内容
        e.preventDefault()
            // 再次调用获取信息的请求，并填充到用户资料
        initUserInfo()

    })

    // 通过提交按钮进行表单的submit事件
    $('.layui-form').submit(function(e) {
        // 阻止默认的提交行为
        e.preventDefault()
            // 发起更新信息的ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新用户信息失败！')
                }
                layui.layer.msg('更新用户信息成功！')

                // 然后需要把更新的信息昵称同步到登录图标旁
                // 在index.html界面有个函数同步用户信息的
                // 可以使用window.parent前缀来调用 父级窗口的函数
                window.parent.getUserInfo()
            }
        })
    })
})