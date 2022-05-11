//    deploy/products.js

/*
 *读取env变量判断发布环境
 */
const SERVER_ID = process.env.NODE_ENV === "production" ? 1 : 0; // 1：正式、0：测试
const packageName = require("../package.json").name;
/*
 *定义多个服务器账号 及 根据 SERVER_ID 导出当前环境服务器账号
 */
const SERVER_LIST = [
  {
    id: 0,
    name: "kfreestyle", //项目名称
    domain: "http://kfreestyle.top", // 域名
    host: "47.107.34.69", // ip
    port: "22", // 端口
    username: "root", // 登录服务器的账号
    password: "Xiaoxiaomin83217", // 登录服务器的密码
    path: `/kfreestyle/k_subapp/${packageName}`, // 发布至静态服务器的项目路径
  },
  {
    id: 1,
    name: "kfreestyle", //项目名称
    domain: "http://kfreestyle.top", // 域名
    host: "47.107.34.69", // ip
    port: "22", // 端口
    username: "root", // 登录服务器的账号
    password: "Xiaoxiaomin83217", // 登录服务器的密码
    path: `/kfreestyle/k_subapp/${packageName}`, // 发布至静态服务器的项目路径
  },
];

module.exports = SERVER_LIST[SERVER_ID];
