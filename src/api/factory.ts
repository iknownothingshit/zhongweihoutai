import { request } from '@umijs/max';

// 获取工厂列表
export function getFactoryList(data: FactoryAPI.Params) {
  return request<FactoryAPI.FactoryListResult>('/admin/factory/list', {
    method: 'POST',
    data
  });
}

// 编辑工厂
export function editFactory(data: FactoryAPI.Factory) {
  return request<IResponseData>('/admin/factory', {
    method: 'POST',
    data
  });
}

// 删除工厂
export function deleteFactory(id: number) {
  return request<IResponseData>('/admin/factory', {
    method: 'DELETE',
    data: {
      id
    }
  });
}

// 获取岗位列表
export function getJobList(data: FactoryAPI.JobParmas) {
  return request<FactoryAPI.JobListResult>('/admin/post/list', {
    method: 'POST',
    data
  });
}

// 编辑岗位
export function editJob(data: FactoryAPI.Job) {
  return request<IResponseData>('/admin/post/insertOrUpdate', {
    method: 'POST',
    data
  });
}

// 删除岗位
export function deleteJob(id: number) {
  return request<IResponseData>('/admin/post', {
    method: 'DELETE',
    data: {
      id
    }
  });
}

// 获取介绍列表
export function getIntroductionList(data: FactoryAPI.IntroductionParmas) {
  return request<FactoryAPI.IntroductionListResult>('/admin/factory/introduction/list', {
    method: 'POST',
    data
  });
}

// 编辑介绍
export function editIntroduction(data: FactoryAPI.Introduction) {
  return request<IResponseData>('/admin/factory/introduction', {
    method: 'POST',
    data
  });
}

// 删除介绍
export function deleteIntroduction(id: number) {
  return request<IResponseData>('/admin/factory/introduction', {
    method: 'DELETE',
    data: {
      id
    }
  });
}
