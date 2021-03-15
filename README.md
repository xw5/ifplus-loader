# webpack条件编译loader
>条件编译是用特殊的注释作为标记，在编译时根据这些特殊的注释，将特殊标记里面的代码编译到不同平台来做到一套代码多端发行。

## 安装：

``` shell
npm install ifplus-loader --save-dev
```

## 项目配置说明（此处以vue项目为例）：
### 配置方式1
>通过loader后加query传参来决定当前是走哪个平台，通过在loader后加“?platform=平台名称”来告诉ifplus-loader当前走哪种条件编译，如果不想频烦更loader里的配置，可以把参数配置到package.json，再引入拼接进来，具体怎么方便你可以自行决定，只要能正确传入参数即可。

``` js
// vue.config.js
...
configureWebpack: (config) => {
  config.module.rules.push({
    test: /\.(js|vue|css|json)$/,
    exclude: [path.resolve(__dirname, 'node_modules')],
    enforce: 'pre',
    use: [
      {
        loader: 'ifplus-loader?platform=WEB'
      }
    ]
  });
},
...
```

### 配置方式2
>通过命令行传参的形式来判断当前是走哪个平台，在命令行后通过给--ifplus指定不同平台来告诉ifplus-loader当前应该走哪种条件编译。
``` json
// package.json
...
{
  "scripts": {
    "serve": "vue-cli-service serve --ifplus=WEB",
    "serve:desktop": "vue-cli-service serve --ifplus=DESKTOP",
    "build": "vue-cli-service build --ifplus=WEB",
    "build:desktop": "vue-cli-service build --ifplus=DESKTOP",
    "lint": "vue-cli-service lint"
  },
}
...
```

``` js
// vue.config.js
...
configureWebpack: (config) => {
  config.module.rules.push({
    test: /\.(js|vue|css|json)$/,
    exclude: [path.resolve(__dirname, 'node_modules')],
    enforce: 'pre',
    use: [
      {
        loader: `ifplus-loader?_t=${Date.now()}`
      }
    ]
  });
},
...
```
### 配置方式差异
>配置方式1：在平台有变化的时候重新启动的时候会清空webpack的缓存，而在不切换平台的时候缓存还是可以使用的,webpack构建速度略高于方式2;
>
>配置方式2：会每次启动项目都会清空webpack的缓存，webpack构建速度略低，如果不在乎那一点速度，我觉得你用哪种都可以的。
>
>二种配置方式都需要通过loader后+query参数，这样做主要是为了强制webpack更新缓存，如果不更新缓存的话，那已经缓存的文件不会再走ifplus-loader，导致平台切换的时候条件编译会失败。

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
>如果你是使用Visual Studio Code做开发，那你可以安装Common-Code-Snippet插件，当你想要使用条件编译的时候输入ifplus即可快速输入条件判断语句,当然Common-Code-Snippet还有很多一样好用的代码段，应该也能帮你提高你的开发体验。