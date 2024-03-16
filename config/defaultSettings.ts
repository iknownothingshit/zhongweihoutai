import { Settings as LayoutSettings } from '@ant-design/pro-components';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  // colorPrimary: '#FEDD12',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: '管理后台',
  pwa: false,
  logo: 'https://zwhr-1322923821.cos-website.ap-guangzhou.myqcloud.com/logo.jpg',
  iconfontUrl: '',
};

export default Settings;