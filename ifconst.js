// 正则集合
exports.regexList = [{
  type: "ifndef",
  test: /<!-- #ifndef (\w+?) -->([\w\W]+?)<!-- #endif -->/
},
{
  type: "ifdef",
  test: /<!-- #ifdef (\w+?) -->([\w\W]+?)<!-- #endif -->/
},
{
  type: "ifndef",
  test: /\/\* #ifndef (\w+?) \*\/([\w\W]+?)\/\* #endif \*\//
},
{
  type: "ifdef",
  test: /\/\* #ifdef (\w+?) \*\/([\w\W]+?)\/\* #endif \*\//
},
{
  type: "ifndef",
  test: /\/\/ #ifndef ([\w\B]+)([\w\W]+?)\/\/ #endif/
},
{
  type: "ifdef",
  test: /\/\/ #ifdef ([\w\B]+)([\w\W]+?)\/\/ #endif/
}];

// 条件类型
exports.types = {
  "ifndef": 'ifndef',
  "ifdef": "ifdef"
}

// 条件key
exports.ifKey = "--ifplus=";

// /<!--  #ifndef (\w+) -->([\w\W]+)<!--  #endif -->/, 
// /<!--  #ifdef (\w+) -->([\w\W]+)<!--  #endif -->/,
// /\/\*  #ifndef  (\w+)  \*\/([\w\W]+)\/\*  #endif  \*\//,
// /\/\*  #ifdef  (\w+)  \*\/([\w\W]+)\/\*  #endif  \*\//,
// /\/\/ #ifndef  (\w+)([\w\W]+)\/\/ #endif/,
// /\/\/ #ifdef  (\w+)([\w\W]+)\/\/ #endif/

// html条件判断
// <!-- #ifdef %PLATFORM% -->
// 平台特有的组件
// <!-- #endif -->

// css条件判断
// /* #ifdef %PLATFORM%  */
// 平台特有样式
// /* #endif  */

// js条件判断
// // #ifdef %PLATFORM%
// 平台特有的API实现
// // #endif