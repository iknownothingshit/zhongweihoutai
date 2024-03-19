type Authorities = {
  authority: string;
};

declare namespace LoginAPI {
  type User = {
    id: number;
    nickname: string;
    role: 'OFFICER' | 'RESIDENT' | 'SYSTEM_ADMIN' | 'FINANCE';
  };

  type LoginParams = {
    bindUsername: string;
    bindPassword: string;
  };

  type LoginResult = IResponseData<Record<string, any>>;

  type UserDetailInfoParams = {
    username: string;
  };

  type UserDetailInfoResult = {
    userId: number;
    username: string;
    password: string;
    deptId: any;
    email: string;
    mobile: string;
    status: boolean;
    createTime: string;
    updateTime: any;
    lastLoginTime: string;
    sex: string;
    avatar: string;
    description: any;
    deptName: any;
    createTimeFrom: any;
    createTimeTo: any;
    roleId: string;
    roleName: string;
    deptIds: string;
    permissions: any;
  };

  type OauthLoginParams = {
    grant_type: string;
    username: string;
    password: string;
  };

  type OauthLoginResult = IResponseData<{
    authorities: Authorities[];
    user: User;
    token: string;
  }>;

  type UserMenuResult = IResponseData<{
    permissions: string[];
    routes: any[];
  }>;
}
