const process = require("process");
const { regexList, types, ifKey} = require("./ifconst.js");

module.exports = function (source) {
  // 获取命令行参数
  const { argv } = process;
  const conditionalItem = argv.find((item) => {
    return item.indexOf(ifKey) != -1;
  });

  // 如果没有传任务关于条件判断相关的参数则不做任务处理返回源数据
  if (!conditionalItem) {
    return source;
  }

  // 获取条件判断关键字
  let conditionalKey = conditionalItem.split("=")[1];
  
  // 递归的正则匹配
  function matchRegex(item) {
    let matchs = source.match(item.test);
    // console.log("matchRegex", conditionalKey, matchs);
    if (!matchs) {
      return;
    }

    // 处理仅在某平台存在的情况
    if (item.type == types.ifndef) {
      if (matchs[1].indexOf(conditionalKey) !== -1) {
        source = source.replace(matchs[0], '');
      } else {
        source = source.replace(matchs[0], matchs[2]);
      }
    }

    // 处理除了某平台均存在的情况
    if (item.type == types.ifdef) {
      if (matchs[1].indexOf(conditionalKey) === -1) {
        source = source.replace(matchs[0], '');
      } else {
        source = source.replace(matchs[0], matchs[2]);
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