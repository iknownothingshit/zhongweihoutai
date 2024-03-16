import { request } from '@umijs/max';

// 获取驻场列表
export function getList(data: ResidentAPI.ListParams) {
  return request<ResidentAPI.ResidentListResult>('/admin/factoryResidentRel/list', {
    method: 'POST',
    data
  });
}

// 修改或新增驻场
export function edit(data: {
  factoryId: number,
  adminUserId: number,
}) {
  return request<IResponseData>('/admin/factoryResidentRel', {
    method: 'POST',
    data
  });
}

// 删除
export function deleteResident(id: number) {
  return request<IResponseData>('/admin/factoryResidentRel', {
    method: 'DELETE',
    data: {
      id
    }
  });
}