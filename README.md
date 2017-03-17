# scroll-select

仿ios日期选择做的一个小插件（主分支依赖jquery，会抽时间制作纯原生代码分支）。

线上预览：[https://jingjingke.github.io/scroll-select/](https://jingjingke.github.io/scroll-select/)


##目录结构

```pre

├── css
│   ├── _media.scss          // 媒体查询(rem匹配)
│   ├── _scrollSelect.scss   // 滚动效果主体样式
│   ├── style.css            // 生成css
│   └── style.scss           // 样式入口
├── data
│   └── city.json            // 省市区联动数据
├── js
<<<<<<< HEAD
│   ├── jquery.min.js        // jquery依赖
=======
>>>>>>> f22ee13ffad0972bb5c1a72458e386f54017e343
│   └── scroll-select.js     // 滚动效果js
├── index.html               // 效果预览
├── README.md                // readme

```

##说明

目前只能调用的方法：
```js
scrollSelect.go()
```
方法中传入对象组，具体参数如下：
```js
data	//[json]只省市区才需要传入data
level   //[number](必需)联动等级（目前有1、2、3级）
elArr   //[str](必需)传入表单的选择器名如#div或.div，用于获取默认值以及确定后将值添入
type    //[str](必需)当前只支持省市区地址（address）和日期（calendar）
el      //[str]这个按需来传非表单选择器，用于将默认值以某种格式添入
```


##示例
（1）调用三级联动省市区选择，如果只需要省市则level改为2即可
```js
$('.form_list1').on('click',function(){
    $.getJSON("./data/city.json",function(result){
        scrollSelect.go({
            data:result,
            level:3,
            elArr:'.select1',
            type:'address'
        })
    });
})
```
（2）调用日期格式
```js
$('.form_list3').on('click',function(){
    scrollSelect.go({
        level:3,
        elArr:'.input3',
        type:'calendar'
    })
})
```