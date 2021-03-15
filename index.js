const process = require("process");
const loaderUtils = require("loader-utils");
const { regexList, types, ifKey} = require("./ifconst.js");
let conditionalKey = "";

/**
* 获取条件判断关键字
*/
function getConditionalKey() {
  let conditionalKey = "";
  // 获取通过loader的query方式传过来条件判断关键字
  let options = loaderUtils.getOptions(this);
  conditionalKey = options.platform ? options.platform : "";
  if (conditionalKey) {
    return conditionalKey;
  }

  // 获取命令行上传过来的条件判断关键字
  const { argv } = process;
  const conditionalItem = argv.find((item) => {
    return item.indexOf(ifKey) != -1;
  });
  if (!conditionalItem) {
    return conditionalKey;
  }
  conditionalKey = conditionalItem.split("=")[1];

  return conditionalKey ? conditionalKey : "";
}

module.exports = function (source) {
  // 获取条件判断关键字
  if (!conditionalKey) {
    conditionalKey = getConditionalKey.call(this);
  }
  
  // 如果获取编译平台关键字出错则直接返回源数据
  if (!conditionalKey) {
    return source;
  }

  // 递归的正则匹配
  function matchRegex(item) {
    let matchs = source.match(item.test);
    // console.log("matchRegex", conditionalKey, matchs);
    if (!matchs) {
      return;
    }
    // 处理仅在某平台存在的情况
    const matchsFirst = matchs[0];
    // 处理首尾空格
    const matchsSecond = matchs[2].replace(/^\n|\n$/g, '');
    if (item.type == types.ifndef) {
      if (matchs[1].indexOf(conditionalKey) !== -1) {
        source = source.replace(matchsFirst, '');
      } else {
        source = source.replace(matchsFirst, matchsSecond);
      }
    }

    // 处理除了某平台均存在的情况
    if (item.type == types.ifdef) {
      if (matchs[1].indexOf(conditionalKey) === -1) {
        source = source.replace(matchsFirst, '');
      } else {
        source = source.replace(matchsFirst, matchsSecond);
      }
    }
    item.test.lastIndex = 0;
    matchRegex(item);
  }

  regexList.forEach((item) => {
    matchRegex(item);
  });
  return source;
}