import axios from "axios";
import { message } from "antd";
// import cookies from "js-cookie";

// const access_token = cookies.get("access_token");
// const sp_access_token = cookies.get("sp_access_token");
// const cm_access_token = cookies.get("cm_access_token");
// 获取Cookie
// const getCookie = (name: string) => {
//   var r = new RegExp("(?:^|;+|\\s+)" + name + "=([^;]*)"),
//     m = document.cookie.match(r);
//   return !m ? "" : m[1];
// };

// 指定接口忽略统一异常处理
export const isIgnoreUrl = (url: string) => {
  let ignoreRequest: string[] = ["/cos/menuConfig.json"];
  let result = false;
  try {
    ignoreRequest.forEach((requrl: string) => {
      const tempReg = new RegExp(`${requrl}$`.replace(/\//g, "\\/"));
      result = tempReg.test(url);
      console.log({ tempReg, result });
      if (result) {
        throw new Error("忽略");
      }
    });
  } catch (error) {
    return result;
  }
  return result;
};

// 成功标识
export const isSuccess = (code: number) => {
  const successCodes = [0, 200];
  const result = successCodes.includes(code);
  return result;
};

const AxiosRequest = axios.create({
  baseURL: "",
  timeout: 10000,
  headers: {
    "content-type": "application/json",
    // "x-csrf-token": getCookie("csrfToken"),
    timeout: 10000,
    // Cookie: `access_token=${access_token};sp_access_token=${sp_access_token};cm_access_token=${cm_access_token}`,
  },
});

const BASE_URL = "http://kfreestyle.top:7003";

AxiosRequest.interceptors.response.use(async (response: any) => {
  const url = response.config.url;
  const data = response.data;
  const result = ["success", "Code", "status"].some((item) =>
    (data || {}).hasOwnProperty(item),
  )
    ? { ...data }
    : { data };
  const resp = {
    ...result,
    Message: result.errMessage || result.data?.errorMessage || result.msg,
    success: isSuccess(result?.Code),
  };
  if (!resp?.success && !isIgnoreUrl(url)) {
    const errMsg =
      resp?.errMessage ||
      (typeof resp?.error === "string" && resp?.error) ||
      "服务器异常，请稍后再试";
    message.error({ content: errMsg });
  } else {
    return resp;
  }
});

const httpRequest = async (
  api: string,
  params?: Object,
  query?: Object,
  headers?: Record<string, string>,
) => {
  const [method, url, baseUrl = BASE_URL] = api.split(" ");
  console.log({ api });
  let newUrl = url;
  let urlQuery = "";
  // 拼接post params
  if (query && Object.keys(query).length > 0) {
    Object.keys(query).forEach((key: string) => {
      //@ts-ignore
      const item = `&${key}=${query[key]}`;
      urlQuery += item;
    });
    newUrl = `${newUrl}?${urlQuery.substr(1)}`;
  }

  if (query && Object.keys(query).length > 0) {
    for (let key of Object.keys(query)) {
      newUrl = newUrl.replace(":" + key, (match) => {
        if (match) {
          //@ts-ignore
          let value = query[key];
          return value;
        }
      });
    }
  }
  try {
    const res = await AxiosRequest.request({
      url: baseUrl + newUrl,
      data: params || {},
      // @ts-ignore
      method: method.toUpperCase(),
      headers: {
        ...(headers || {}),
      },
    });
    return res;
  } catch (error) {
    return {
      Code: -1,
    };
  }
};

export default httpRequest;
