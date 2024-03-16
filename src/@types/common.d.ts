declare interface IResponseData<T = unknown> {
  code: number;
  message: string;
  timestamp: string;
  data: T;
}

declare interface IPaginationParams {
  pageNum?: number;
  pageSize?: number;
}
