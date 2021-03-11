# webpack条件编译loader
>条件编译是用特殊的注释作为标记，在编译时根据这些特殊的注释，将特殊标记里面的代码编译到不同平台来做到一套代码多端发行。

## 安装：

``` shell
npm install ifplus-loader --save-dev
```

## webpack配置，此处以vue项目为例：
>亲测在vue项目中如果js文件处理不放最后在切换平台运行的时候会出现问题，推荐使用如下配置，其它项目可以按正常webpack的loader配置即可，如果发现有问题可以试着清除打包中的缓存和尝试添加enforce来控制loader执行顺序解决。

``` js
// vue.config.js
...
chainWebpack: (config) => {
  // 在切换--ifplus=WEB | DESKTOP时，yarn serve之后页面存在缓存，使用下面禁用vue---cache-loader&vue-loader的cache方式解决，正常的情况下，不要做这个处理，影响打包时间
  const svueRule = config.module.rule('vue');
  svueRule.uses.delete('cache-loader');

  config.module.rule('vue').use('vue-loader').tap(options => {
    options.cacheIdentifier = null;
    return options
  })
},
configureWebpack: {
  module: {
    rules:[
      {
        test: /\.(vue|css|json)$/,
        exclude: [path.resolve(__dirname, 'node_modules')],
        enforce: 'pre',
        use: [
          {
            loader: 'ifplus-loader'
          }
        ]
      },{
        test: /\.js$/,
        exclude: [path.resolve(__dirname, 'node_modules')],
        enforce: 'post',
        use: [
          {
            loader: 'ifplus-loader'
          }
        ]
      },
    ]
  }
}
...
```

## package.json配置：
>以vue项目为例，假设我们的项目WEB平台和DESKTOP平台共用一套代码，希望不同的代码编译到不同的平台，则只要VUE编译命令加上相关参数即可，例：

``` json
{
  "scripts": {
    "serve": "vue-cli-service serve --ifplus=WEB",
    "serve:desktop": "vue-cli-service serve --ifplus=DESKTOP",
    "build": "vue-cli-service build --ifplus=WEB",
    "build:desktop": "vue-cli-service build --ifplus=DESKTOP",
    "lint": "vue-cli-service lint"
  },
}
```

## 条件编译在代码中到底怎么用？
>以下所有示例都以WEB和DESKTOP二个平台来做示例演示，真正项目开发中你可以定义你自己想要发布的平台类型，跟你代码里的保持一致即可。

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

### JS中的条件编译：
``` js
// #ifdef  %PLATFORM%
平台特有的代码实现
// #endif
```
#### 示例：
>下面js代码在WEB端会控制台打印出"我是WEB端, 我是非桌面端",而在桌面端会在控制台打印”我是非桌面端“
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

### HTML中的条件编译：
``` html
<!-- #ifdef %PLATFORM% -->
平台特有的html
<!-- #endif -->
```
#### 示例：
>下面html在WEB端会显示"我是WEB端 我是非桌面端",在桌面端会显示我是桌面端
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
### 样式中条件编译：
``` css
/* #ifdef %PLATFORM% */
平台特有样式
/* #endif */
```
#### 示例：
>下面样式名为test的dom在WEB平台下显示绿色和0.5的透明度，桌面端显示红色不透明
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

## Visual Studio Code下更好的使用体验
>如果你是使用Visual Studio Code做开发，那恭喜你，你可以安装Common-Code-Snippet插件，当你想要使用条件编译的时候输入ifplus即可快速输入,当然Common-Code-Snippet还有很多一样好用的代码段，应该也能帮你提高你的开发体验。