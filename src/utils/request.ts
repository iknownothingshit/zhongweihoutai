import type { AxiosRequestConfig, AxiosResponse, RequestConfig } from '@umijs/max';
import { message as Message, Modal } from 'antd';
import { isEmpty } from 'lodash-es';
import { history } from '@umijs/max';
import db from './db';
import { goLogin, isDev } from './index';
import { message as msg } from '@/components/Empty';

interface IResponseData<T = any> {
  code: number;
  message: string;
  data: T;
}

let token: string = '';

const admin_version_num = '001000000000';

const getToken = (): string => {
  // if (!isEmpty(token)) return token;
  token = db.get('ACCESS_TOKEN') as string;
  return token;
};

// 请求超时时间，10s
const requestTimeOut = 10 * 60 * 1000;

const headerInterceptor = (options: AxiosRequestConfig) => {
  const access_token = getToken();
  const headers = !isEmpty(access_token)
    ? {
      ...options.headers,
      'platform': 'admin',
      Authorization: `Bearer ${access_token}`,
      // 'admin-version-num': admin_version_num,
    }
    : options.headers;
  return { ...options, interceptors: true, headers } as AxiosRequestConfig;
};

// const [messageApi] = Message.useMessage();
let m: any = null; // 重登提示Modal

const resInterceptor = (response: AxiosResponse) => {
  if (typeof response.data != 'object') {
    return response;
  }

  if (Object.prototype.toString.call(response.data) === '[object Blob]') {
    return response;
  }

  const { code, message } = response.data;
  if (code && code !== 200) {
    Message.error(message);
  }
  if (code === 401 && m === null) {
    m = Modal.error({
      title: '温馨提示',
      content: '登录已过期，请重新登录',
      okText: '确定',
      onOk: () => goLogin(),
      afterClose: () => (m = null),
    });
  }
  return response;
};

const errorHandler = (error: any) => {
  if (error.status !== 200 && error.config?.url?.includes('admin/menu/')) {
    history.push('/user/login');
  }
  const codeMaps = {
    401: '很抱歉，认证已失效，请重新登录',
    403: '很抱歉，您暂无该操作权限',
    404: '很抱歉，资源未找到',
  };
  const errorMessage = !error.data ? '系统内部异常，请联系网站管理员' : error.data.message;
  if (errorMessage === 'refresh token无效') {
    Modal.error({
      title: '温馨提示',
      content: '登录已过期，请重新登录',
      okText: '确定',
      onOk: () => history.push('/user/login'),
    });
    return;
  }

  msg.error(codeMaps[error.status] || errorMessage);
};

// 114.132.160.209:18081
// http://114.132.160.209
//https://593a-61-141-65-45.ngrok-free.app/
// 'https://enzezhonghr.com/api/'

export const requestConfig: RequestConfig = {
  baseURL: 'http://114.132.160.209:18081',
  timeout: requestTimeOut,
  errorConfig: {
    errorHandler: errorHandler,
  },
  requestInterceptors: [headerInterceptor],
  responseInterceptors: [resInterceptor],
};
