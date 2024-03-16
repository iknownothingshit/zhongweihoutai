import { copyObjNotEmptyProp } from '@/utils';
import { request } from '@umijs/max';

/** 获取大盘｜每日数据 */
export function getDashboardData(params: any, options?: Record<string, any>) {
  return request<IResponseData<WelcomeAPI.Dashboard>>(`/admin/dashboard`, {
    method: 'GET',
    params: copyObjNotEmptyProp(params),
    ...(options || {}),
  });
}

/** 获取大盘｜每日数据 */
export function getInitData(params: any, options?: Record<string, any>) {
  return request<IResponseData<WelcomeAPI.initData>>(`/admin/user/index`, {
    method: 'GET',
    params: copyObjNotEmptyProp(params),
    ...(options || {}),
  });
}
