// https://umijs.org/docs/max/layout-menu
import { defineConfig } from '@umijs/max';
import { join } from 'path';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';
const { theme } = require('antd/lib');
const { convertLegacyToken } = require('@ant-design/compatible/lib');

const { defaultAlgorithm, defaultSeed } = theme;

const mapToken = defaultAlgorithm(defaultSeed);
const v4Token = convertLegacyToken(mapToken);

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  hash: true,
  antd: {
    import: false,
  },
  request: {},
  links: [
    {
      rel: 'icon',
      href: 'https://zwhr-1322923821.cos-website.ap-guangzhou.myqcloud.com/logo.jpg'
    }
  ],
  initialState: {},
  model: {},
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: true,
    siderWidth: 208,
    ...defaultSettings,
  },
  lessLoader: {
    modifyVars: v4Token,
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },

  targets: {
    // ie: 11, //umi新版本不兼容ie11: https://github.com/ant-design/ant-design-pro/issues/10115
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  access: {},
  // headScripts: [`/audioAmr.js`],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // 如果不想要 configProvide 动态设置主题需要把这个设置为 default
    // 只有设置为 variable， 才能使用 configProvide 动态设置主色调
    // https://ant.design/docs/react/customize-theme-variable-cn
    'root-entry-name': 'variable',
  },
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  outputPath: '../../dist/adminV2',
  base: '/',
  publicPath: '/',
  // Fast Refresh 热更新
  fastRefresh: true,
  presets: ['umi-presets-pro'],
  openAPI: [
    {
      requestLibPath: "import { request } from '@umijs/max'",
      // 或者使用在线的版本
      // schemaPath: "https://gw.alipayobjects.com/os/antfincdn/M%24jrzTTYJN/oneapi.json"
      schemaPath: join(__dirname, 'oneapi.json'),
      mock: false,
    },
    {
      requestLibPath: "import { request } from '@umijs/max'",
      schemaPath: 'https://gw.alipayobjects.com/os/antfincdn/CA1dOm%2631B/openapi.json',
      projectName: 'swagger',
    },
  ],
  mfsu: {
    shared: {
      react: {
        singleton: true,
      },
    },
  },
  // scripts: [
  //   'https://unpkg.com/react@17/umd/react.production.min.js',
  //   'https://unpkg.com/react-dom@17/umd/react-dom.production.min.js',
  //   'https://unpkg.com/@ant-design/charts@1.0.5/dist/charts.min.js',
  //   //使用 组织架构图、流程图、资金流向图、缩进树图 才需要使用
  //   'https://unpkg.com/@ant-design/charts@1.0.5/dist/charts_g6.min.js',
  // ],
  externals: {
    // react: 'React',
    // 'react-dom': 'ReactDOM',
    // '@ant-design/charts': 'charts',
  },
  keepalive: [/./], // 开启tabs模式（标签页） https://juejin.cn/post/7109492504424087566
  tabsLayout: {},
});
