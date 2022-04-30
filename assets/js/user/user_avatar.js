$(function() {
    let layer = layui.layer
        // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 为上传按钮 设置点击事件
    $('#btnChooseImg').on('click', function() {
        // 点击后调用上传文件的input点击事件
        $('#file').click()
    })

    $('#file').on('change', function(e) {
        // console.log(e)
        let fileList = e.target.files
        if (fileList.length === 0) {
            return layer.msg('请选择一个头像')
        }
        // 1.获取更换的图片的名称
        let file = e.target.files[0]
            // 2.通过URL的creatObjectURL（）方法获取file的路径
        let ImgURL = URL.createObjectURL(file)
            // 3.把之前的图片销毁并把选择的图片安排进去
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', ImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 为确定按钮绑定点击事件
    $('#btnUpload').click(function() {
        // 获取用户上传的头像
        let dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
            // 然后发起ajsx请求
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新头像失败')
                }
                layer.msg('更新头像成功')
                window.parent.getUserInfo()
            }
        })
    })
})