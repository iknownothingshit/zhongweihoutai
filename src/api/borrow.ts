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

// 借资配置更改
export function doConfig(data: {
  entryDayLimit: number;
  loanAmountMonthLimit: number;
  loanIntervalDayLimit: number;
}) {
  return request<IResponseData>('/admin/loanRule', {
    method: 'PUT',
    data
  });
}

// 获取借资配置
export function getConfig() {
  return request<LoanAPI.LoanConfigResult>('/admin/loanRule', {
    method: 'GET',
  });
}
