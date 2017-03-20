# scroll-select

仿ios日期选择做的一个小插件（当前为原生JS实现）。

效果预览（主页为依赖JQ）：[https://jingjingke.github.io/scroll-select/](https://jingjingke.github.io/scroll-select/)


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
type    //[str](必需)当前只支持省市区地址（address调整中还不能用）和日期（calendar）
el      //[str][有区别]传递为Id选择器名
```


##示例
暂时只调整了日历的的代码，示例
```js
document.getElementById('input3').addEventListener('click',function(e){
    scrollSelect.go({
        level:3,
        el:'input3',
        type:'calendar'
    })
})
```