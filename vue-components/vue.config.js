module.exports = {
  configureWebpack: config => {
    if(process.env.NODE_ENV === 'production') {
      console.log('Setting MEDIATOR for production.');
      // mutate config for production...
      config.entry = {
        app: [
          './src/main-production.js'
        ]
      };
    } else {
      console.log('Setting MEDIATOR for development.');
      config.entry = {
        app: [
          './src/main.js'
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
