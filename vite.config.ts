import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from "vite-tsconfig-paths";
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, 'env');

  const htmlPlugin = () => {
    return {
      name: 'html-transform',
      transformIndexHtml(html: string) {
        return html.replace(/%(.*?)%/g, (match, p1) => env[p1]);
      }
    };
  };

  const cssPlugin = () => {
    return {
      name: 'css-transform',
      transform(src: string, id: any) {
        if (/\.(css)$/.test(id)) {
          return src.replace(/%(.*?)%/g, (match, p1) => env[p1]);
        }
      }
    };
  };

  return {
    plugins: [
      vue(),
      cssPlugin(),
      htmlPlugin(),
      tsconfigPaths()
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname),
        'vue': 'vue/dist/vue.esm-bundler.js'
      }
    }
  }
});
