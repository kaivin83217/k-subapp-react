const proxyhost = "kfreestyle.top:7003";
const coshost = "kfreestyle.top";
const proxy = [
  {
    context: ["/kfreestyle"],
    target: `http://${proxyhost}/`,
    changeOrigin: true,
  },
  {
    context: ["/cos"],
    target: `http://${coshost}/`,
    changeOrigin: true,
  },
];
module.exports = proxy;
