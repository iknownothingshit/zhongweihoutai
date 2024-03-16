export const USERSTATUS = [
  { value: 0, label: '待审核' },
  { value: 1, label: '审核中' },
  { value: 2, label: '已通过' },
  { value: 3, label: '已拒绝' },
  { value: 4, label: '试用中' },
  { value: 5, label: '已转正' },
  { value: 6, label: '已离职' },
];
export const USER_STATUS_COLOR = [
  { value: 0, label: 'warning' },
  { value: 1, label: 'processing' },
  { value: 2, label: 'success' },
  { value: 3, label: 'error' },
  { value: 4, label: '#f6d068' },
  { value: 5, label: '#87d068' },
  { value: 6, label: 'default' },
];

export const assistantRoleOptions = [
  { value: 'ADMIN', label: '管理员' },
  { value: 'NORMAL', label: '普通客服' },
];
/** 服务类型 */
export const assistantServeTypeOptions = [
  { value: 'PRE_SALE', label: '售前' },
  { value: 'IN_SALE', label: '售中' },
  { value: 'AFTER_SALE', label: '售后' },
];
export const assistantServeTypeColor = {
  PRE_SALE: '#87d068',
  IN_SALE: '#2db7f5',
  AFTER_SALE: '#108ee9',
};

export const assistantServingOptions = [
  { value: 'ONLINE', label: '开启' },
  { value: 'OFFLINE', label: '暂停接待' },
];

/** 助理录用状态 */
export enum AssistantStatus {
  NOT_AUDIT,
  IN_AUDIT,
  AUDITED,
  REJECT,
  IN_TRIAL,
  CORRECTED,
  RESIGN,
}

/** 用户的更多操作项 */
export enum MoreOperate {
  Add_Test_Account, // 添加测试账号
  Add_Prod_Account, // 添加测试账号
}

export const Visitor_More_Operate_Items = [
  {
    label: '添加测试账号',
    key: MoreOperate.Add_Test_Account,
  },
  {
    label: '添加正式账号',
    key: MoreOperate.Add_Prod_Account,
  },
];
