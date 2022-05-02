$(function() {
    let layer = layui.layer
    let form = layui.form

    initArtCateList()
        // 更新页面数据
    function initArtCateList() {
        // 已进入页面就获取ajax请求 然后铺满页面表格
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取图书列表失败')
                }
                // console.log(res);
                // layer.msg('获取图书类别列表成功')
                // template获取的是一个字符串
                let htmlStr = template('tpl-table', res)
                    // console.log(htmlStr)
                $('tbody').html(htmlStr)
            }
        })
    }
    let indexAdd = null
        // 点击 添加类别 的点击事件
    $('#btnAddCate').click(function() {
        // 使用layui的弹出层
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    })

    // 给form-add 表单绑定submit事件 因为这个表单是点击添加按钮后 动态创建的，所以利用事件委托
    $('body').on('submit', '#form-add', function(e) {
        // 阻止默认提交行为
        e.preventDefault()
            // 点击后发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('添加图书类别失败')
                }
                //    添加成功 重新获取列表
                initArtCateList()
                layer.msg('添加图书类别成功')
                    // 关闭弹出层  需要获取layer.open()的返回值index
                    // 利用layer.close(index) 来进行关闭
                layer.close(indexAdd)
            }
        })
    })

    // 新建一个修改的 点击事件  因为表单获取是动态添加的 使用事件委托
    let indexEdit = null
    $('tbody').on('click', '.btn-edit', function() {
        // 使用layui的弹出层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });
        let id = $(this).attr('data-id')
            // console.log(id)

        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                // console.log(res)
                form.val('form-edit', res.data)
            }
        })


    })

    // 监表单的submit事件 事件委托
    // 发起ajax请求  把编辑后的数据同步到页面 并关闭弹出层
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新文章类别失败！')
                }
                layer.msg('更新文章类别成功！')
                    // 关闭弹出层
                layer.close(indexEdit)
                    // 重新渲染数据到页面
                initArtCateList()
            }
        })
    })

    // 给删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        let id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/:id' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除图书类别失败！')
                    }
                    layer.msg('删除图书类别成功！')
                    layer.close(index)
                    initArtCateList()
                }
            })
        })
    })

})