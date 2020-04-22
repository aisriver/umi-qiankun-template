/*
 * @文件描述:
 * @公司: thundersdata
 * @作者: 廖军
 * @Date: 2020-04-21 16:39:43
 * @LastEditors: 廖军
 * @LastEditTime: 2020-04-22 09:54:46
 */
import routeConfig from './route.config';
import themeTemplate from './theme-template';
import SentryPlugin from 'webpack-sentry-plugin';
import sentryConfig from '../sentry.config.js';

export default {
  routes: routeConfig,
  targets: {
    ie: 11,
  },
  devtool: 'source-map',
  history: { type: 'browser' },
  outputPath: './build',
  antd: {},
  dva: false,
  dynamicImport: {
    loading: '@/Loading.tsx',
  },
  title: 'synergy',
  autoprefixer: {
    browsers: ['> 1%', 'last 2 versions', 'not ie <= 10'],
  },
  exportStatic: false, // 如果有动态路由，这个地方改成false
  // 配置模版主题样式 最终应用的是theme-config.js的配置
  theme: themeTemplate,
  ignoreMomentLocale: true,
  define: {
    'process.env.PROD': JSON.stringify(true),
  },
  chainWebpack(config) {
    config.output
      .filename('[name].[chunkhash].bundle.js')
      .chunkFilename('[name].[chunkhash].bundle.js')
      .hashFunction('sha256')
      .hashDigest('hex')
      .hashDigestLength(20);
    config.optimization.splitChunks({
      chunks: 'all',
      minSize: 20000,
      minChunks: 4,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: true,
      cacheGroups: {
        icons: {
          name: 'icons',
          chunks: 'all',
          test: /[\\/]node_modules[\\/](@ant-design)[\\/]/,
        },
        commons: {
          name: 'commons',
          chunks: 'async',
          minChunks: 2,
          minSize: 0,
        },
        vendors: {
          name: 'vendors',
          chunks: 'all',
          test: /[\\/]node_modules[\\/](react|react-dom|umi|(\@babel)|core-js|moment)[\\/]/,
          priority: -10,
        },
      },
    });
    config
      .plugin('webpack-sentry-plugin')
      .use(
        new SentryPlugin({
          ...sentryConfig.config,
          deleteAfterCompile: true,
          suppressConflictError: true,
          include: /(\.js\.map|\.js)$/,
        }),
      )
      .end();
  },
};
