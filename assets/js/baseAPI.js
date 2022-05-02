// $.ajaxprefilter()在每次ajax执行时都会拿到 该次请求的url数据
// 每次手动拼接路径 比较麻烦 当根路径更换时会出现问题
// 可以利用jQuery 提供的 $.ajaxprefilter()进行自动拼接
$.ajaxPrefilter(function(option) {
    // 每次会自动把获取的url地址拼接上根路径
    option.url = 'http://www.liulongbin.top:3007' + option.url
        // console.log(option.url);

    // 因为baseAPI文件被引入了 所以每次ajax请求的内容都会被option拿到
    // 所以可以在这里进行一个判断 路径内是否含有 有权限的访问路径
    // 如果有就直接加上一个请求头，把存在本地的token 写进去
    // indexOf()用于判断 在指定的元素内是否有（）内容的元素，如果没有就返回-1
    if (option.url.indexOf('/my/') !== -1) {
        option.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 同理避免每次ajax请求后都去调complete函数来限制访问权限
    // 在这个ajaxPrefilter函数中 加入 complete回调
    option.complete = function(res) {
        // console.log(res)
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 如果成功登录到index页面 但是complete函数中不符合正确登录的条件
            // 1.强制清空token
            localStorage.removeItem('token')
                // 2.强制返回login页面
            location.href = '/login.html'
        }
    }
})