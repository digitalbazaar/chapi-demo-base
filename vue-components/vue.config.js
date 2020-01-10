module.exports = {
  configureWebpack: config => {
    if(process.env.NODE_ENV === 'production') {
      // mutate config for production...
      config.entry = {
        app: [
          './src/main-production.js'
        ]
      };
    }
  },
  pluginOptions: {
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false
    }
  },
  transpileDependencies: [
    'quasar'
  ],
  devServer: {
    port: 19443,
    https: true,
    proxy: 'https://localhost:18443'
  }
};
