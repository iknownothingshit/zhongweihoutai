declare namespace SystemAPI {
  type RoleItem = SYSTEM_ADMIN | OFFICER | RESIDENT;

  type RoleParams = {
    pageNum?: number;
    pageSize?: number;
    roleName?: string;
  };

  type RoleResult = IResponseData<{
    records: RoleItem[];
    total: number;
  }>;

  type RoleOptionsResult = IResponseData<RoleItem[]>;

  type MenuItem = {
    id: string;
    label: string;
    parentId: string;
    hasParent: boolean;
    hasChildren: boolean;
    path: string;
    component: string;
    perms: string;
    icon: string;
    type: string;
    orderNum: number;
    children?: MenuItem[];
  };

  type MenuResult = IResponseData<{
    records: MenuItem[];
    total: number;
  }>;

  type UserItem = {
    id: number;
    isDelete: boolean;
    name: string;
    phone: string;
    role: string;
    createTime: string;
    updateTime: string;
    inviteCode: string;
  };

  type UpdateUserParams = {};

  type UsersParams = {
    pageNum?: number;
    pageSize?: number;
    createTimeFrom?: number;
    createTimeTo?: number;
    username?: string;
    deptName?: string;
  };

  type UsersResult = IResponseData<{
    records: UserItem[];
    total: number;
  }>;

  type DeptItem = {
    id: string;
    label: string;
    parentId: string;
    hasParent: boolean;
    hasChildren: boolean;
    orderNum: number;
  };

  type DeptResult = IResponseData<{
    records: DeptItem[];
    total: number;
  }>;
}
