const db = {
  save(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  get(key: string, defaultValue = {}) {
    let res = defaultValue || '';
    try {
      const result = localStorage.getItem(key);
      if (result) {
        res = JSON.parse(result);
      }
    } catch (err) {
      console.log(err);
    }
    return (res || defaultValue) as string | Record<string, any>;
  },
  remove(key: string) {
    localStorage.removeItem(key);
  },
  clear() {
    // localStorage.clear();
    localStorage.removeItem('EXPIRE_TIME');
    localStorage.removeItem('USER');
    localStorage.removeItem('REFRESH_TOKEN');
    localStorage.removeItem('USER_ROUTER');
    localStorage.removeItem('ACCESS_TOKEN');
    localStorage.removeItem('PERMISSIONS');
  },
  // 弃用localStorage中的路由页面权限和数据权限缓存，每次都去服务器拿去最新的
  clearRouterPermission() {
    localStorage.removeItem('USER_ROUTER');
    localStorage.removeItem('PERMISSIONS');
  },
};

export default db;
