const vite = require('vite');
const path = require('path');
const vue = require('@vitejs/plugin-vue');
const env = vite.loadEnv(undefined, 'env');

module.exports = {
  stories: [
    "../stories/**/*.@(js|jsx|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  framework: "@storybook/vue3",
  core: {
    builder: "storybook-builder-vite"
  },
  async viteFinal(config) {
    return {
      ...config,
      plugins: [
        ...config.plugins,
        vue({ include: [/\.vue$/], })
      ],
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          '@': path.resolve(__dirname, '../'),
          '/': path.resolve(__dirname, '../'),
          'vue': 'vue/dist/vue.esm-bundler.js'
        }
      },
    };
  },
}
