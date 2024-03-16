import { LoginPath } from '@/constant/index';
import db from './db';
import { history, dropByCacheKey } from '@umijs/max';
import { cloneDeep, isArray } from 'lodash';
import { isObject } from './type';

export const isDev = process.env.NODE_ENV === 'development';

export const goLogin = () => {
  const redirect = location.href;
  db.clear();
  history.replace(`${LoginPath}?redirect=${redirect}`);
};

export const arrayToEnum = (array: { value: number | string | boolean; label: string }[]) => {
  const newObj: Record<number | string, string> = {};
  array.forEach((item) => (newObj[item.value + ''] = item.label));
  return newObj;
};

export const objToArray = (obj: Record<string, string | number | boolean> = {}) => {
  const arr = [];
  for (const key in obj) {
    arr.push({
      value: key,
      label: obj[key],
    });
  }
  return arr;
};

export const Obj2string = (obj: Record<string, number | string>) => {
  let str = '';
  Object.entries(obj).forEach((item) => {
    const [key, value] = item;
    str = `${str}&${key}=${value}`;
  });
  return str.slice(1);
};

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(preTime: Date | string | number, cFormat: string) {
  let time = preTime;
  if (arguments.length === 0) {
    return null;
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
  let date;
  if (typeof time === 'object') {
    date = time;
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time);
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value];
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value;
    }
    return value || 0;
  });
  return time_str;
}

export function downloadFile(blob: Blob, fileName: string) {
  try {
    const data = new Blob([blob]);
    if ('download' in document.createElement('a')) {
      const elink = document.createElement('a');
      elink.download = fileName;
      elink.style.display = 'none';
      elink.href = URL.createObjectURL(data);
      document.body.appendChild(elink);
      elink.click();
      URL.revokeObjectURL(elink.href);
      document.body.removeChild(elink);
    } else {
      navigator.msSaveBlob(data, fileName);
    }
  } catch (err) {
    window.alert('下载失败');
  }
}

// 转成form-data格式再放进接口透传，需要进行这个转换的接口比较老旧，所以我也不知道为啥要这样做
export function parseToFormData(par: Object) {
  let result = '';
  Object.keys(par).forEach((key) => {
    if (!Object.is(par[key], undefined) && !Object.is(par[key], null)) {
      result += encodeURIComponent(key) + '=' + encodeURIComponent(par[key]) + '&';
    }
  });
  return result;
}

export const loadScript = (src: string) => {
  return new Promise((resolve, reject) => {
    const head = document.head || document.getElementsByTagName('head')[0];
    const script = document.createElement('script');
    script.onload = () => {
      resolve({
        code: 200,
        msg: '脚本加载成功',
      });
    };
    script.onerror = (oError) => {
      reject(oError);
    };
    head.appendChild(script);
    script.src = src;
  });
};

// 区分环境
export const getEnv = () => {
  const n = location.hostname;
  if (n.startsWith('admin.glowe.cn')) return 'prod';
  if (n.indexOf('172.16.103.58') !== -1) return 'dev';
  return 'test';
};

/**
 * 所有通过条件查询列表的请求，都应该经过该函数处理
 * 列表请求时，过滤空数据
 * 获取对象中为非空的属性
 */
export const copyObjNotEmptyProp = (obj: Record<string, any>) => {
  if (!isObject(obj)) return obj;

  const copyObj = cloneDeep(obj);
  const emptyValArr = ['', undefined, null];
  for (const prop in copyObj) {
    const val = copyObj[prop];
    if (emptyValArr.includes(val) || (isArray(val) && val.length === 0)) {
      delete copyObj[prop];
    }
  }
  return copyObj;
};

/**
 * 转换静态资源返回的数据，将其转换成json对象
 */
export const mapStaticData = (obj: any) => {
  if (!obj || !obj.array || !Array.isArray(obj.array)) return {};

  const result = {};
  try {
    obj.array.forEach((item: any) => {
      if (item.componentType < 4) {
        // 基础类型
        result[item.key] = item.content;
      } else if (item.componentType === 4) {
        // json类型
        result[item.key] = mapStaticData(item.content);
      } else if (item.componentType === 5) {
        // 数组类型
        const arr = item.content.array.map((o: any) => {
          return mapStaticData(o.data);
        });
        result[item.key] = arr;
      } else {
        // 默认是文本类型
        result[item.key] = item.content;
      }
    });
  } catch (err) {
    console.log('格式转换出错', err);
  }

  return result;
};

// 获取url中的query参数
export const getURLQueryToMap = (url: string) => {
  const queryParams: Record<string, string | undefined> = {};
  const queryString = url.split('?')[1];
  if (queryString) {
    queryString.split('&').forEach((param) => {
      const keyValue = param.split('=');
      const key = decodeURIComponent(keyValue[0]);
      const value = decodeURIComponent(keyValue[1] || '');
      queryParams[key] = value;
    });
  }
  return queryParams;
};

/** 跳转到指定tab页面，且刷新 */
export const goDetailPageRefresh = (url: string) => {
  dropByCacheKey(url.match(/^[^?]+/)?.[0] || '');
  history.push(url);
};

export const apiHost = process.env.BASE_API;
export const h5Host = process.env.REACT_APP_HOST;

export function convertMillisecondsToMinutesSeconds(milliseconds: number) {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  let minutesStr = `${minutes}`;
  let secondsStr = remainingSeconds.toString();

  // 在分钟或秒小于10时添加一个前导零
  if (minutes < 10) {
    minutesStr = '0' + minutes;
  }
  if (remainingSeconds < 10) {
    secondsStr = '0' + remainingSeconds;
  }
  return `${minutesStr}分${secondsStr}秒`;
}

export const getRoleAccess = () => {
  const user = db.get('USER') as LoginAPI.User;

  return {
    canEdit: user.role === 'RESIDENT' || user.role === 'SYSTEM_ADMIN',
    canDelete: user.role === 'SYSTEM_ADMIN'
  }
}
