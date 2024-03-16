declare namespace SignUpAPI {
  type Item = {
    city: string;
    createTime: string;
    entryTime: string;
    factoryName: string;
    nickname: string;
    phone: string;
    postApplicationId: number;
    postName: string;
    province: string;
    region: string;
    salary: number;
    separateTime: string;
    status: string;
    timeUnit: string;
    inviteCode: string;
  }

  type SignUpListResult = IResponseData<{
    records: Item[];
    total: number;
  }>;
}
