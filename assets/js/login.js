// 放一个入口函数
$(function() {
    // 点击 去注册账号 显示登录界面
    $('#link_reg').on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    $('#link_login').on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 当引入了layui的js文件后就可以访问到layui这个对象
    let form = layui.form
    let layer = layui.layer
        // 然后就可以同form.verify 去使用layui里面的方法
    form.verify({
        // 定义了一个pwd的规则
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 给再次确认密码定义一个 repwd的规则
        repwd: function(value) {
            let pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    })

    // 事件监听 注册表单提交事件
    $('#form_reg').on('submit', function(e) {
        // 阻止默认提交行为
        e.preventDefault()
            // 注册界面发起post请求
        let data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }
        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) { //status是热水这个返回值对象里面的其中一个属性 res.status
                return layer.msg(res.message)
            }
            layer.msg('注册成功，请登录！')
                // 登录成功后，手动模拟点击事件，跳转登录页面
            $('#link_login').click()
        })
    })

    // 事件监听 登录表单提交事件
    $('#form_login').submit(function(e) {
        // 阻止默认提交行为
        e.preventDefault()
            // 发起post请求
        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败')
                }
                layer.msg('登录成功')
                    // 把加密过后的token字符串存储在本地的localStorage里面
                localStorage.setItem('token', res.token)
                    // 登录后跳转主页
                location.href = '/index.html'
            }
        })
    })
})