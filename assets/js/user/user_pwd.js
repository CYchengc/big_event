$(function() {
    let form = layui.form

    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],

        samePwd: function(value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能一致'
            }
        },

        rePwd: function(value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次新密码不一致'
            }
        }
    })

    // 表单重置 发起请求
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
            // 发起请求
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新密码失败！')
                }
                layui.layer.msg('更新密码成功！')
                    // 把获取的jQuery元素 转化成原生dom 然后使用表单的重置方法reset（）
                $('.layui-form')[0].reset()
            }
        })
    })

})