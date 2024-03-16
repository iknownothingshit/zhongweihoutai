import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import db from '@/utils/db';
import { requestConfig } from '@/utils/request';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { SettingDrawer, PageContainer } from '@ant-design/pro-components';
import { App } from 'antd';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { history } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import Empty from './components/Empty';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-CN';

dayjs.locale('zh-CN');

// const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

// 看这个：https://umijs.org/docs/max/layout-menu

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: LoginAPI.UserDetailInfoResult;
  permissions?: string[];
  loading?: boolean;
  getMenu?: (username: string) => Promise<string[]>;
}> {
  const user = db.get('USER') as LoginAPI.UserDetailInfoResult;
  const getMenu = async (username: string) => {
    try {
      // const { code, data } = await getAdminMenu(username);
      // if (code === 200) {
      //   return data.permissions;
      // }
      return [];
    } catch (error) {
      console.error(error);
    }
    return [];
  };
  // 如果不是登录页面，执行
  if (history.location.pathname !== loginPath) {
    const token = db.get('ACCESS_TOKEN') as string;
    if (!token || !user.username) {
      history.push(loginPath + history.location.search);
      return {
        settings: defaultSettings,
        getMenu,
      };
    }
    const permissions = await getMenu(user.username);
    return {
      currentUser: user,
      settings: defaultSettings,
      permissions,
      getMenu,
    };
  }
  return {
    settings: defaultSettings,
    getMenu,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: '管理后台',
      fontColor: 'rgba(0,0,0,0.1)',
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      // console.log(!initialState?.currentUser, initialState?.currentUser, initialState)
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    menuContentRender: (props: any, dom) => {
      return <div style={{ paddingTop: '8px' }}>{dom}</div>;
    },
    // links: isDev // 如果需要在左侧导航栏下面额外展示链接可以写在这里
    //   ? [
    //       <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
    //         <LinkOutlined />
    //         <span>OpenAPI 文档</span>
    //       </Link>,
    //     ]
    //   : [],
    // menuContentRender: (props, defaultDom) => {
    //   console.log('cc:', props)
    //   return <div style={{ backgroundColor: 'red' }}>{defaultDom}</div>
    // },
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      return (
        <>
          <PageContainer
            header={{
              title: '',
              breadcrumb: {},
            }}
          >
            {children}
          </PageContainer>
          {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
    token: {
      sider: {
        // colorMenuBackground: '#000', // 侧边栏背景色
      },
      header: {
        colorBgHeader: '#031524', // 顶部栏背景色
        colorHeaderTitle: 'white', // 左侧title字体颜色
      },
    },
  };
};

export const request = requestConfig;

export const rootContainer = (container: any) => {
  return (
    <App>
      <Empty />
      {container}
    </App>
  );
};
