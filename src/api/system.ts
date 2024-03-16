import { copyObjNotEmptyProp } from '@/utils';
import { request } from '@umijs/max';

/** 查询角色 GET /admin/role */
export function getRole(params: SystemAPI.RoleParams, options?: Record<string, any>) {
  return request<SystemAPI.RoleResult>('/admin/role', {
    method: 'GET',
    params: copyObjNotEmptyProp(params),
    ...(options || {}),
  });
}

/** 查询菜单 GET /admin/role/options */
export function getRoleOptions() {
  return request<SystemAPI.RoleOptionsResult>('/admin/role/list', {
    method: 'GET',
  });
}

/** 查询菜单 GET /admin/menu */
export function getMenu() {
  return request<SystemAPI.MenuResult>('/admin/menu', {
    method: 'GET',
  });
}

/** 查询部门 GET /admin/dept */
export function getDept() {
  return request<SystemAPI.DeptResult>('/admin/dept', {
    method: 'GET',
  });
}

/** 查询管理员列表 GET /admin/user */
export function getUsers(params: SystemAPI.UsersParams) {
  return request<SystemAPI.UsersResult>('/admin/page', {
    method: 'GET',
    params: copyObjNotEmptyProp(params),
  });
}

/** 删除管理员 DELETE /admin/user */
export function deleteUsers(userId: number) {
  return request<IResponseData>(`/admin/${userId}`, {
    method: 'DELETE',
  });
}

/** 查找数据权限 GET /admin/user */
export function getDeptIds(userId: number) {
  return request<IResponseData>(`/admin/user/${userId}`, {
    method: 'GET',
  });
}

/** 编辑管理员 PUT /admin/user */
export function editUser(data: any) {
  return request<any>(`/admin/${data.id}`, {
    method: 'PUT',
    data,
  });
}

/** 新增管理员 PUT /admin/user */
export function addUser(data: any) {
  return request<IResponseData>('/admin/addUser', {
    method: 'POST',
    data,
  });
}

/** 删除角色 DELETE  */
export function deleteRole(roleIds: string) {
  return request<any>(`/admin/role/${roleIds}`, {
    method: 'DELETE',
  });
}

/** 编辑角色 PUT */
export function editRole(data: any) {
  return request<any>('/admin/role', {
    method: 'PUT',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

/** 新增角色 POST */
export function addRole(data: any) {
  return request<any>('/admin/role', {
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

/** 删除权限 DELETE  */
export function deleteRights(ids: string) {
  return request<IResponseData>(`/admin/menu/${ids}`, {
    method: 'DELETE',
  });
}

/** 新增权限 POST  */
export function addRights(data: any) {
  return request<IResponseData>('/admin/menu', {
    method: 'POST',
    data,
  });
}

/** 修改权限 PUT  */
export function editRights(data: any) {
  return request<IResponseData>('/admin/menu', {
    method: 'PUT',
    data,
  });
}
