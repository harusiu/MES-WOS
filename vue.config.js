module.exports = {
  lintOnSave: false,
  runtimeCompiler: true,
  configureWebpack: {
    //Necessary to run npm link https://webpack.js.org/configuration/resolve/#resolve-symlinks
    resolve: {
       symlinks: false
    }
  },

  devServer: {  //Mingzoo, Jan 8, 2020
    https: true,

    /*proxy: {
      '/api': {
        target: 'https://localhost:3000',
        //target: 'http://hello-world.amp.iii-ei-stack.com',
        changeOrigin: true,
      }
    },*/
    
    //disableHostCheck: true
  }
}
