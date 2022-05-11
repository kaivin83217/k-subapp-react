//非空校验
export const requiredValidator = (name: string) => {
  return {
    required: true,
    message: `${name}不能为空`,
  };
};

/**非中文校验 */
export const noChineseValidator = (value: any) => {
  const reg = /^[^\u4e00-\u9fa5]*$/;
  if (value && !reg.test(value)) {
    return Promise.reject(new Error("请输入数字或字母"));
  }
  return;
};

//判断是否为undefined、null、''
export const isEmpty = (value: any) => {
  if (typeof value === "undefined" || value === null || value === "") {
    return true;
  } else {
    return false;
  }
};

// 判断对象是否有值 false有值，true全为空
export const IsAllEmpty = (obj: Record<string, any>) => {
  if (JSON.stringify(obj) === "{}") {
    return true;
  }
  let IsEmpty = true;
  Object.keys(obj).some((key) => {
    const type = Object.prototype.toString.call(obj[key]).slice(8, -1);
    if (type === "Number" && obj[key] != NaN) {
      IsEmpty = false;
      return true;
    }
    if (type === "String" && obj[key] !== "") {
      IsEmpty = false;
      return true;
    }
    if (type === "Array" && obj[key]?.length > 0 && obj[key][0]) {
      IsEmpty = false;
      return true;
    }
    if (type === "Object" && JSON.stringify(obj[key]) !== "{}") {
      IsEmpty = false;
      return true;
    }
    IsEmpty = true;
    return false;
  });
  return IsEmpty;
};
