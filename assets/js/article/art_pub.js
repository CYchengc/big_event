$(function() {
    let layer = layui.layer
    let form = layui.form
        // 渲染类别选择框
    initCate()
        // 初始化富文本编辑器
    initEditor()
        // 发起ajax请求把拿到的分类数据动态填充到选择框 内
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                // 成功 则渲染模板引擎
                let htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                    //    像选择框这种 需要重新渲染
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    $('#btnChooseImage').click(function() {
        $('#coverFile').click()
    })

    // 监听 图片选择框的change事件
    $('#coverFile').on('change', function(e) {
        // 当选择框内图片发生变化时，拿到选择的图片的伪数组
        let file = e.target.files
        if (file.length === 0) {
            return
        }
        // 成功获取图片
        let newImgURL = URL.createObjectURL(file[0])

        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 设置一个变量把state先设为‘已发布’
    let art_state = '已发布'
        // 在创建一个点击事件，点击存为草稿后  把state设为草稿
    $('#btnSave2').click(function() {
        art_state = '草稿'
    })

    $('#form-pub').on('submit', function(e) {
        // 阻止默认提交行为
        e.preventDefault()
            // 1.获取form的实例对象  实例化针对dom对象 所有用$()[0]的方法
        let fd = new FormData($('#form-pub')[0])
            // 2.遍历获取fd的数据
            // 3.把state值追加到fd
        fd.append('state', art_state)
            // 4.获取封面照片的文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 把文件对象存入fd
                fd.append('cover_img', blob)
                    // 5.发起ajax请求
                publishArticle()
            })
    })

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败!')
                }
                layer.msg('发布文章成功!')
                    // 跳转到文章列表
                location.href = '/article/art_list.html'
            }

        })
    }
})