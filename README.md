# scroll-select

仿ios日期选择做的一个小插件（当前为原生JS实现）。

注意：index.html中引入了JQ文件，只是作为发送ajax时取得城市json所用，与效果没有影响，可根据实际情况删除也可。

效果预览：[https://jingjingke.github.io/scroll-select/](https://jingjingke.github.io/scroll-select/)


##目录结构

```pre

├── css
│   ├── _media.scss          // 媒体查询(rem匹配)
│   ├── _common.scss         // 随便写的通用样式
│   ├── _scrollSelect.scss   // 滚动效果主体样式
│   ├── style.css            // 生成css
│   └── style.scss           // 样式入口
├── data
│   └── city.json            // 省市区联动数据
├── js
│   ├── jquery.min.js        // 发送ajax用
│   └── scroll-select.js     // 滚动效果js(原生)
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
日期
```js
document.getElementById('input3').addEventListener('click',function(e){
    scrollSelect.go({
        level:3,
        el:'input3',
        type:'calendar'
    })
})
```
城市
```js
document.getElementById('input1').addEventListener('click',function(){
    $.getJSON("./data/city.json",function(result){
        scrollSelect.go({
            data:result,
            level:3,
            el:'input1',
            type:'address'
        })
    })
})
```