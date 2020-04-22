/*
 * @文件描述:
 * @公司: thundersdata
 * @作者: 廖军
 * @Date: 2020-04-21 16:39:43
 * @LastEditors: 廖军
 * @LastEditTime: 2020-04-22 09:50:18
 */
import routeConfig from './route.config';
import ThemeReplacerPlugin from '@td-design/webpack-theme-replacer';
import themeTemplate from './theme-template';
import theme from './theme-config';

export default {
  routes: routeConfig,
  targets: {
    chrome: 49,
    firefox: 45,
    safari: 10,
    edge: 13,
    ios: 10,
    ie: 10,
  },
  history: { type: 'browser' },
  outputPath: './build',
  qiankun: {
    master: {
      // 注册子应用信息
      apps: [
        {
          name: 'purehtml', // 唯一 id 参考 https://github.com/umijs/qiankun 这个仓库的example
          entry: '//localhost:7104', // html entry
          base: '/purehtml', // app1 的路由前缀，通过这个前缀判断是否要启动该应用，通常跟子应用的 base 保持一致
          history: 'browser', // 子应用的 history 配置，默认为当前主应用 history 配置
        },
      ],
      jsSandbox: true, // 是否启用 js 沙箱，默认为 false
      prefetch: true, // 是否启用 prefetch 特性，默认为 true
    },
  },
  antd: {},
  dva: false,
  dynamicImport: {
    loading: '@/Loading.tsx',
  },
  // 想要在开发环境使用主题替换方法 需要在这里配置或在index.html模版中引用
  headScripts: [{ charset: 'utf-8', src: '/theme-setting.js' }],
  title: 'synergy', // 项目自行补充
  exportStatic: {
    htmlSuffix: false,
  },
  autoprefixer: {
    browsers: ['> 1%', 'last 2 versions', 'not ie <= 10'],
  },
  theme: themeTemplate, // 配置模版主题样式 最终应用的是theme-config.js的配置
  ignoreMomentLocale: true,
  define: {
    'process.env.PROD': JSON.stringify(false),
  },
  chainWebpack(config) {
    config.merge({
      plugin: {
        install: {
          plugin: new ThemeReplacerPlugin({
            theme,
            template: themeTemplate,
            antd: true,
            // 想替换项目中的less变量 直接在theme对应的两个配置文件中添加即可
            // 如果项目中使用到了less的fade等方法 这里提供了额外的配置项（不建议使用一些方法转换主题变量，内置的less方法并不完善，并且fade对不同透明度处理结果可能是相同的）
            // 例：background-color: fade(@my-color, 10%); 我需要把这个背景样式集成到主题配置，可以通过如下方法，传入自定义方法func或者使用插件内置函数来处理
            computed: [
              {
                func: () => {},
                insidePluginKey: 'fade',
                include: [
                  {
                    sourceKey: '@my-color',
                    themeKey: '@my-background-color',
                    params: ['10%'],
                  },
                ],
              },
            ],
          }),
        },
      },
    });
  },
};
