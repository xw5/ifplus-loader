# webpack条件编译loader
条件编译是用特殊的注释作为标记，在编译时根据这些特殊的注释，将注释里面的代码编译到不同平台。

## 安装：

``` shell
npm install ifplus-loader --save-dev
```

## webpack配置：

``` js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|vue|css|json)$/,
        exclude: [path.resolve(__dirname, 'node_modules')],
        use:[
          {
            loader: 'ifplus-loader'
          }
        ]
      },
    ],
  },
};
```

## package.json配置：
&emsp;&emsp;以vue项目为例，假设我们的项目WEB和DESKTOP共用一套代码，希望不同的代码编译到不同的平台，则只要VUE编译命令加上相关参数即可，例：

``` json
{
  "scripts": {
    "serve": "vue-cli-service serve --ifplus=WEB",
    "serve:desktop": "vue-cli-service serve --ifplus=DESKTOP",
    "build": "vue-cli-service build --ifplus=WEB",
    "build": "vue-cli-service build --ifplus=DESKTOP",
    "lint": "vue-cli-service lint"
  },
}
```

## 条件编译在代码中到底怎么用？

``` md
// 在WEB编译环境下保留
#ifdef WEB
需条件编译的代码
#endif

// 在DESKTOP编译环境下删除
#ifndef DESKTOP
需条件编译的代码
#endif

// 在WEB和DESKTOP编译环境下都保留
#ifdef WEB || DESKTOP
需条件编译的代码
#endif

```

### &emsp;&emsp;JS中的条件编译：
``` js
// #ifdef  %PLATFORM%
平台特有的代码实现
// #endif
```
#### &emsp;&emsp;示例：
&emsp;&emsp;下面js代码在WEB端会控制台打印出"我是WEB端日志, 我是非桌面端",而在桌面端会在控制台打印”我是非桌面端“
``` js
// #ifdef WEB 
console.log("我是WEB端");
// #endif

// #ifdef DESKTOP 
console.log("我是桌面端");
// #endif

// #ifndef DESKTOP 
console.log("我是非桌面端");
// #endif
```

### &emsp;&emsp;HTML中的条件编译：
``` html
<!-- #ifdef %PLATFORM% -->
平台特有的html
<!-- #endif -->
```
#### &emsp;&emsp;示例：
&emsp;&emsp;下面html在WEB端会显示"我是WEB端 我是非桌面端",在桌面端会显示我是桌面端
``` html
<!-- #ifdef WEB -->
<div>我是WEB端</div>
<!-- #endif -->

<!-- #ifdef DESKTOP -->
<div>我是桌面端</div>
<!-- #endif -->

<!-- #ifndef DESKTOP -->
<div>我是非桌面端</div>
<!-- #endif -->
```
### &emsp;&emsp;样式中条件编译：
``` css
/* #ifdef %PLATFORM% */
平台特有样式
/* #endif */
```
#### &emsp;&emsp;示例：
&emsp;&emsp;下面样式名为test的dom在WEB平台下显示绿色和0.5的透明度，桌面端显示红色不透明
``` css
.test{
  /* #ifdef WEB */
  background-color: green;
  /* #endif */

  /* #ifdef  DESKTOP */
  background-color: red;
  /*  #endif  */

  /* #ifndef DESKTOP */
  opacity: 0.5;
  /* #endif */
}
```