import path from 'path';
import allRoutes from '../../../config/routes';

let intl = null;

// 获取所有路由，生成搜索池
export default function formatRoutes(tool) {
  intl = tool;
  return generateRoutes(allRoutes);
}

// 递归遍历路由数组
const generateRoutes = (routes, basePath = '/', prefixName = '', prefixTitle = '') => {
  let res = [];

  for (const router of routes) {
    if (!router.name) {
      continue;
    }

    const id = prefixName ? `${prefixName}.${router.name}` : `menu.${router.name}`; // 例子menu.users.consultant
    const text = intl.formatMessage({ id }); // 查找路由name对应的文字
    const routePath = path.resolve(basePath, router.path);

    const data = {
      value: routePath,
      label: prefixTitle ? `${prefixTitle} > ${text}` : text,
    };
    if (router.component) res.push(data);

    if (router.routes) {
      const tempRoutes = generateRoutes(router.routes, data.value, id, data.label);
      if (tempRoutes.length >= 1) {
        res = [...res, ...tempRoutes];
      }
    }
  }
  return res;
};
