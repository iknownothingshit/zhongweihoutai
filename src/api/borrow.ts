import { request } from '@umijs/max';

// 获取借资列表
export function getLoanList(data: any) {
  return request<LoanAPI.LoanListResult>('/admin/loanRecord', {
    method: 'POST',
    data
  });
}

// 借资审核
export function doAudit(data: {
  userLoanRecordId: number;
  userLoanRecordStatusEnum: string;
  remark?: string;
}) {
  return request<IResponseData>('/admin/loanRecord', {
    method: 'PUT',
    data
  });
}

// 导出当前借资列表
export function exportList(data: any) {
  return request<IResponseData>('/admin/loanRecord/export', {
    method: 'POST',
    data,
    responseType: 'blob'
  });
}

// 借资配置更改
export function createConfig(data: Omit<LoanAPI.ConfigItem, 'id' | 'createTime'>) {
  return request<IResponseData>('/admin/loanRule/insert', {
    method: 'POST',
    data
  });
}

// 借资配置更改
export function doConfig(data: LoanAPI.ConfigItem) {
  return request<IResponseData>('/admin/loanRule', {
    method: 'PUT',
    data
  });
}

// 获取借资配置
export function getConfig(data: {
  factoryName?: string;
  factoryId?: string;
}) {
  return request<LoanAPI.LoanConfigResult>(`/admin/loanRule?factoryName=${data.factoryName || ''}&factoryId=${data.factoryId || ''}`, {
    method: 'GET',
  });
}

// 删除借资配置
export function deleteConfig(id: number) {
  return request<IResponseData>('/admin/loanRule', {
    method: 'DELETE',
    data: {
      id
    }
  });
}

// 获取薪资结算列表
export function getSalaryList(data: any) {
  return request<LoanAPI.SalaryListResult>('/admin/salary/page', {
    method: 'POST',
    data
  });
}

// 获取薪资发行模板
export function getTemplate() {
  return request<LoanAPI.LoanConfigResult>('/admin/salary/template', {
    method: 'GET',
  });
}

// 上传模板的文件名到后端
export function sendTemplateName(name: string) {
  return request<IResponseData>(`/admin/salary/processSalaryRecord?fileKey=${name}`, {
    method: 'POST',
  });
}
