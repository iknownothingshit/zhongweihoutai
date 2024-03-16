declare namespace FactoryAPI {
  type Factory = {
    city: string;
    createTime: string;
    id?: number;
    isDelete: number;
    name: string;
    province: string;
    region: string;
    updateTime: string;
  }

  type FactoryListResult = IResponseData<{
    records: Factory[];
    total: number;
  }>;

  type Params = {

  }

  type JobParmas = {
    pageSize?: number;
    pageNum?: number;
    postName?: string;
    status?: string;
    factoryName?: string;
  }

  type Job = {
    accommodation: string;
    city: string;
    coverPic: string[];
    createTime: string;
    entryNumber: number;
    entryProcessPic: string;
    factoryName: string;
    factoryId: number;
    id?: number;
    postIntroduction: string;
    postName: string;
    postNumber: number;
    province: string;
    region: string;
    salary: number;
    salaryIntroduction: string;
    status: string;
    tag: string[];
    timeUnit: string;
  }

  type JobListResult = IResponseData<{
    records: Job[];
    total: number;
  }>;

  type IntroductionParmas = {
    pageSize?: number;
    pageNum?: number;
  }

  type Introduction = {
    canteen: string;
    city: string;
    content: string;
    createTime: string;
    dormitory: string;
    factoryEnvironment: string;
    factoryId: number;
    factoryName: string;
    id: number;
    pic: string[];
    postIntroduction: string;
    province: string;
    recruitmentNotice: string;
    region: string;
    status: string;
    tag: string[];
    title: string;
    updateTime: string;
    welfareBenefits: string;
  }

  type IntroductionListResult = IResponseData<{
    records: Introduction[];
    total: number;
  }>;
}
