const packageName = require("./package.json").name;
const path = require("path");
const webpackProxy = require("./src/config/webpackProxy");
//**todo ExtractTextPlugin和HappyPack配合使用多进程打包，不知道有没有生效 */
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HappyPack = require("happypack");

const proxyhost = "kfreestyle.top:7003";
const {
  override,
  addLessLoader,
  addWebpackAlias,
  fixBabelImports,
  addWebpackPlugin,
  adjustStyleLoaders,
  addBundleVisualizer,
  addWebpackModuleRule,
} = require("customize-cra");
module.exports = {
  webpack: override(
    fixBabelImports("import", {
      libraryName: "antd",
      libraryDirectory: "es",
      style: true, //这里一定要写true，css和less都不行
    }),
    addLessLoader({
      lessOptions: {
        javascriptEnabled: true,
        sourceMap: false,
      },
    }),
    /** 使用less必须加上这个，可能是由于postcss-loader版本问题运行时总会提示没有plugins这个未知属性，需用adjustStyle改造参考https://juejin.cn/post/7071926901584953380 */
    adjustStyleLoaders(({ use: [, css, postcss, resolve, processor] }) => {
      css = ["happypack/loader?id=css"];
      const postcssOptions = postcss.options;
      postcss.options = { postcssOptions };
    }),
    addWebpackAlias({
      "@": path.resolve(__dirname, "./src"),
      "@pages": path.resolve(__dirname, "./src/pages"),
    }),
    addBundleVisualizer({
      analyzerMode: "disabled", // 不启动展示打包报告的http服务器
      generateStatsFile: true,
    }),
    addWebpackModuleRule({
      test: /\.js$/,
      use: ["happypack/loader?id=babel"],
      exclude: path.resolve(__dirname, "node_modules"),
    }),
    addWebpackPlugin(
      new HappyPack({
        // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
        id: "babel",
        // 如何处理 .js 文件，用法和 Loader 配置中一样
        loaders: ["babel-loader?cacheDirectory"],
        // ... 其它配置项
      }),
      new HappyPack({
        id: "css",
        // 如何处理 .css 文件，用法和 Loader 配置中一样
        loaders: ["css-loader"],
      }),
      new ExtractTextPlugin({
        filename: `[name].css`,
      }),
    ),
    (config, env) => {
      // 参数中的 config 就是默认的 webpack config
      // 对 config 进行任意修改
      // config.entry = config.entry.filter(
      //   (e) => !e.includes('webpackHotDevClient')
      // );

      // console.log(config.module.rules[1].oneOf[5]);
      config.output.library = `${packageName}-[name]`;
      config.output.libraryTarget = "umd";
      config.output.globalObject = "window";
      config.resolve.fallback = { crypto: false };
      return config;
    },
  ),
  devServer: (configFunction) => {
    return function (proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost);
      config.open = false;
      config.hot = false;
      config.headers = {
        "Access-Control-Allow-Origin": "*",
      };
      config.proxy = webpackProxy;
      return config;
    };
  },
};
