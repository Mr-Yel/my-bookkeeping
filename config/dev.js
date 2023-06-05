const path = require("path");

module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
  },
  alias: {
    "@/utils" : path.resolve(__dirname, '..', 'src/utils'),
    "@/assets" : path.resolve(__dirname, '..', 'src/assets'),
    "@/config" : path.resolve(__dirname, '..', 'src/config'),
    "@/components" : path.resolve(__dirname, '..', 'src/components'),
    "@/store" : path.resolve(__dirname, '..', 'src/store'),
    "@/style" : path.resolve(__dirname, '..', 'src/style'),
    "@/service" : path.resolve(__dirname, '..', 'src/service'),
    "@" : path.resolve(__dirname, '..', 'src')
  },
  mini: {},
  h5: {
    esnextModules: ['taro-ui']
  }
}
