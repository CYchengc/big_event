// $.ajaxprefilter()在每次ajax执行时都会拿到 该次请求的url数据
// 每次手动拼接路径 比较麻烦 当根路径更换时会出现问题
// 可以利用jQuery 提供的 $.ajaxprefilter()进行自动拼接
$.ajaxPrefilter(function(option) {
    // 每次会自动把获取的url地址拼接上根路径
    option.url = 'http://www.liulongbin.top:3007' + option.url
    console.log(option.url);
})