declare namespace UsersAPI {
  type Certificates = {
    auditStatus: number; // 0-未审批；1-驳回；2-通过
    auditTime: string;
    auditor: string;
    createTime: string;
    id: number
    imgUrl: string;
    isDelete: boolean;
    name: string;
    phone: string;
    receiveTime: string;
    updateTime: string;
    userId: number;
  }

  type User = {
    certificates: Certificates[],
    createTime: string;
    factoryName: string;
    id: number;
    idCard: {
      bankNumber: string;
      createTime: string;
      id: string;
      idNumber: string;
      isDelete: boolean;
      openId: string;
      realName: string;
      updateTime: string;
      userId: number;
    },
    inviteCode: string;
    isAuth: boolean;
    isDelete: boolean;
    nickname: string;
    openId: string;
    phone: string;
    position: string;
    updateTime: string;
  }

  type ListParams = {
    phone?: string;
    name?: string;
    pageNum?: number;
    pageSize?: number;
    certificateNeedAuditor: boolean;
  }

  type UserListResult = IResponseData<{
    records: User[];
    total: number;
  }>;
}
