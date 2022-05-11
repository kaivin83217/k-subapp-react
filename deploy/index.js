//  deploy/index.js里面
const scpClient = require("scp2");
const ora = require("ora");
const chalk = require("chalk");
const server = require("./products");
const spinner = ora(
  "正在发布到" +
    (process.env.NODE_ENV === "production" ? "生产" : "测试") +
    "服务器...",
);
var Client = require("ssh2").Client;
const packageName = require("../package.json").name;
var conn = new Client();
conn
  .on("ready", function () {
    // rm 删除服务器已存在文件夹
    conn.exec(
      `rm -rf /kfreestyle/k_subapp/${packageName}`,
      function (err, stream) {
        if (err) throw err;
        stream
          .on("close", function (code, signal) {
            // 在执行shell命令后，把开始上传部署项目代码放到这里面
            spinner.start();
            //dist 本地编译后文件夹
            scpClient.scp(
              "dist/",
              {
                host: server.host,
                port: server.port,
                username: server.username,
                path: server.path,
                // 使用本地的私钥或者password登录服务器
                password: server.password,
                // privateKey: require('fs').readFileSync('/Users/kaivin/.ssh/ecs_rsa.pub')
              },
              function (err) {
                spinner.stop();
                if (err) {
                  console.log(chalk.red("发布失败.\n"));
                  throw err;
                } else {
                  console.log(
                    chalk.green(
                      "Success! 成功发布到" +
                        (process.env.NODE_ENV === "production"
                          ? "生产"
                          : "测试") +
                        "服务器! \n",
                    ),
                  );
                }
              },
            );

            conn.end();
          })
          .on("data", function (data) {
            console.log("STDOUT: " + data);
          })
          .stderr.on("data", function (data) {
            console.log("STDERR: " + data);
          });
      },
    );
  })
  .connect({
    host: server.host,
    port: server.port,
    username: server.username,
    // 使用本地的私钥或者password登录服务器
    password: server.password,
    // privateKey: require('fs').readFileSync('/Users/kaivin/.ssh/ecs_rsa.pub')
  });
