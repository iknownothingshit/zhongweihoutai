import { request } from '@umijs/max';

// 获取报名列表
export function getSignUpList(data: any) {
  return request<SignUpAPI.SignUpListResult>('/admin/userPostApplication/list', {
    method: 'POST',
    data
  });
}

// 报名审核
export function doAudit(data: {
  postApplicationId: number;
  status: string;
}) {
  return request<IResponseData>('/admin/userPostApplication/audit', {
    method: 'PUT',
    data
  });
}

// 报名编辑
export function editCode(data: SignUpAPI.Item) {
  return request<IResponseData>('/admin/userPostApplication', {
    method: 'POST',
    data
  });
}