// 这个js文件是封装手机号身份证号的文件
// 验证手机号
export let validtel=(rule, value, callback) => {
    if (!/^1[3456789]\d{9}$/.test(value)) {
      return callback(new Error("手机号有误"));
    }
    callback();
  };
//   验证身份证号
  export let IdNumber= (rule, value, callback) => {
    if (
      !/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(
        value
      )
    ) {
      return callback(new Error("身份证有误"));
    }
    callback();
  };
  
  //   验证身份证号
  export let isnumber= (rule, value, callback) => {
    if (
      !(/(^[0-9]\d*$)/).test(
        value
      )
    ) {
      return callback(new Error("请输入正整数"));
    }
    callback();
  };
  // 验证大于1整数
  export let isonenumber= (rule, value, callback) => {
    if (
      !(/(^[1-9]\d*$)/).test(
        value
      )
    ) {
      return callback(new Error("请输入正整数"));
    }
    callback();
  };