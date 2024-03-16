declare namespace ResidentAPI {
  type Resident = {
    id: number;
    city: string;
    createTime: string;
    factoryName: string;
    factoryId: number;
    nickname: string;
    phone: string;
    province: string;
    region: string;
  }

  type ListParams = {
    order?: string;
    pageNum?: number;
    pageSize?: number;
  }

  type ResidentListResult = IResponseData<{
    records: Resident[];
    total: number;
  }>;
}
