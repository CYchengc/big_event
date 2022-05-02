$(function() {
    let layer = layui.layer
    let form = layui.form
    let laypage = layui.laypage;
    // 用于发起请求时的数据对象
    let q = {
        pagenum: 1, //默认的页码值
        pagesize: 2, //每页显示多少条数据
        cate_id: '', //文章分类的 Id
        state: '', //文章的状态，可选值有：已发布、草稿
    }
    initTable()
    initCate()

    // 封装获取分类列表数据的函数 等下调用 已进入页面就渲染到页面上
    function initTable() {
        // 发起ajax请求
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取图书列表失败！')
                }
                // console.log(res)
                // 成功
                // 某模板引擎渲染
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)

                // 获取分列列表数据并渲染到页面后 把分页信息展示出来
                renderPage(res.total)
            }
        })
    }

    //美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)

        let y = dt.getFullYear()
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())

        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + '' + hh + ':' + mm + ':' + ss
    }

    // 补零函数
    function padZero(n) {
        n > 9 ? n : '0' + n
    }
    // 初始化文章分类
    function initCate() { //封装函数一定要调用才生效
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化分类失败！')
                }
                // 成功获取
                // 利用模板引擎动态渲染选择框
                let htmlStr = template('tpl-cate', res)
                    // 渲染到页面
                $('[name=cate_id]').html(htmlStr)

                // 动态创建的选择框内内容需要重新渲染render
                form.render()
            }
        })
    }

    // 获取筛选按钮部分的表单的submit事件
    $('#form-serach').submit(function(e) {
        // 阻止默认提交行为
        e.preventDefault()
            // 获取分类项，状态项的值
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()
            // 重新给p独享对象赋值
        q.cate_id = cate_id
        q.state = state
            // 然后再调用分类列表的初始化函数 根据p对象的新值 进行初始化
        initTable()
    })

    // 渲染分页的函数
    function renderPage(total) {
        // 使用layui自带的分页方法
        laypage.render({
            elem: 'pageBox', //容器盒子的 Id
            count: total, //总数据条数
            limit: q.pagesize, //每页显示的条数
            curr: q.pagenum, //起始的页码值
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],

            // 分页选项发生变化时产生的回调函数
            jump: function(obj, first) { //obj就是回调之前的所有数据
                // 可以把当前页码值重新赋值给q对象的默认页码
                q.pagenum = obj.curr
                    // 是每次分页显示条目数选择框发生变化时，也会触发jump回调可以拿到最新的 数量
                q.pagesize = obj.limit

                // 如果直接调用初始化分类列表的方法就会形成死循环
                // initTable()
                // 1.点击页码值会触发一次
                // 2.页面一打开initTable()出触发，然后initTable()末尾渲染野页码区域，调用renderPage（）方法，renderPage（）方法已一调用，就触发 jump回调，jump回调出发后就会再次调用末尾的initTable()函数，最后形成死循环

                // first参数可以判断触发下面的initTable() 是通过那种方式
                // 如果first = true 就是初始化触发
                // 如果first = undified 就是点击触发 所以
                if (!first) {
                    initTable()
                }



            }
        })

    }

    // 因为数据是动动态创建，所以使用事件委托来监听删除按钮的点击事件
    $('tbody').on('click', '.btn-delete', function() {
        let len = $('.btn-delete').length
            // 通过data-id自定义属性来获取 Id
        let id = $(this).attr('data-id')
            // 弹出层 询问是否删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //点击删除后大气发起ajax请求
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('文章删除失败！')
                    }
                    layer.msg('文章删除成功！')
                        // 成功后 重新渲染数据
                        // 如果删除成功直接调用 初始化列表的函数 会出现一个情况
                        // 就是删除的时候页码值还停留在当前页码的位置
                        // 所以初始化还停留在当前页面，但是数据已经被清空了

                    // 所以我们可以根据点击后获得的删除按钮的数量 来判断
                    // 当前的删除按钮是不是最后一个
                    // 如果整体的按钮长度大于1 name就可以直接调用 初始化列表的函数
                    // 如果删除按钮的长度正好等于1 就说明我们正在操作删除当前页面的最后一条信息
                    // 所以是需要把页码值 -1 后 在执行初始化函数
                    if (len === 1) {
                        //因为页码值最小为1 所以在这里有一种特殊情况 如果页码值本身就等于1 是不需要减1的
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index)
        })
    })
})