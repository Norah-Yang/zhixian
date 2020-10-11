
module.exports = {
  productionSourceMap: false,
  chainWebpack: config => {
    // 修复HMR
    config.resolve.symlinks(true)
  },
  devServer: {
    open:true,
    hot:true,
    proxy: {
      '/mapi': {
        target: 'https://manage.zhixianyun.cn/mapi/', // 你要访问的地址
        secure: false,
        // ws: true, // 是否启用websockets
        changeOrigin: true, // 开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        pathRewrite: {
          '^/mapi': '' // 路径重写
        }
      }
    }
  },
  publicPath: './',
  outputDir: 'dist',
  lintOnSave: false,//关闭eslint检查
}
