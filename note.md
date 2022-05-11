**Note:微应用改造**

#### 1.创建项目

```bash
npx create-react-app 文件夹名称 --template typescript
```

#### 2.cd 文件夹

#### 3.重写 webpack 配置文件：在根目录新建 config-overrides.js 写 webpack 配置，具体参考https://github.com/arackaf/customize-cra/blob/master/api.md#addwebpackmodulerulerule

```bash
npm i --save-dev react-app-rewired customize-cra

```

#### 4.创建 main.d.ts 全局声明文件内容，并声明 window 变量 POWERED_BY_QIANKUN，内容如下：

```js
declare interface Window {
  __POWERED_BY_QIANKUN__: any;
}
```

#### 5.在 tsconfig.json 文件配置 includes 属性，在数组中增加"main.d.ts"

```js
"include": ["src", "main.d.ts"]
```

#### 6.创建 public-path.js 文件，内容如下:

```js
if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__
}
```

#### 7.eslint 忽略全局变量 webpack_public_path：在 package.json 配置 eslintConfig,如下

```js
"eslintConfig": {
  ...,
  "globals": {
  "__webpack_public_path__": true
  }
},
```

#### 8.在 config-overrides.js 配置 output 属性，增加

```js
const packageName = require('./package.json').name
config.output.library = `${packageName}-[name]`
config.output.libraryTarget = 'umd'
config.output.globalObject = 'window'
```

#### 9.在入口文件 index.tsx 暴露生命周期钩子，具体参照https://qiankun.umijs.org/zh/guide/getting-started`

#### 10.配置 less

```bash
安装 npm i --save-dev less less-loader

修改 config-overrides.js 修改override，添加以下两个api
```

```js
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
```

#### 11. 配置打包分析

```bash
  安装 npm i --save-dev webpack-bundle-analyzer
  修改 config-overrides.js 修改override，添加如下api 配置，并在 package.json 配置 script: {..., "analyz": "cross-env NODE_ENV=production npm_config_report=true npm run build && webpack-bundle-analyzer --port 8887 ./dist/stats.json"}
```

```js
 addBundleVisualizer({
    analyzerMode: "disabled", // 不启动展示打包报告的http服务器
    generateStatsFile: true,
  }),
```

#### 12.antd 配置按需加载

```bash
安装 npm i --save-dev babel-plugin-import
修改 config-overrides.js 修改override，添加如下api 配置
```

```js
 fixBabelImports("import", {
      libraryName: "antd",
      libraryDirectory: "es",
      style: true, //这里一定要写true，css和less都不行
    }),
```

```
备注：配置按需加载酒不能引用 antd.variable.min.css

```
