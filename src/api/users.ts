import { copyObjNotEmptyProp } from '@/utils';
import { request } from '@umijs/max';

// 查询用户列表
export function getUserList(
  params: UsersAPI.ListParams,
) {
  return request<UsersAPI.UserListResult>('/admin/miniapp/page', {
    method: 'GET',
    params: copyObjNotEmptyProp(params),
  });
}

// 离职用户
export function resignUser(
  userId: number
) {
  return request<UsersAPI.UserListResult>('/admin/userPostApplication/separated', {
    method: 'POST',
    data: {
      userId
    }
  });
}

// 添加用户
export function addUser(
  params: {
    phone: string;
  },
) {
  return request<IResponseData>('/admin/addUser', {
    method: 'POST',
    params: copyObjNotEmptyProp(params),
  });
}

// 更新用户
export function updateUser(
  id: string,
  params: UsersAPI.User,
) {
  return request<IResponseData>(`/admin/${id}`, {
    method: 'PUT',
    params: copyObjNotEmptyProp(params),
  });
}

// 删除用户
export function deleteUser(
  id: string
) {
  return request<IResponseData>(`/admin/${id}`, {
    method: 'DELETE',
  });
}

// 删除用户
export function passOrRejectCertificate(
  id: string,
  type: string
) {
  return request<IResponseData>(`/certificate/${type}?certificateId=${id}`, {
    method: 'GET',
  });
}

