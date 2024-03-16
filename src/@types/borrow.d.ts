declare namespace LoanAPI {
  type LoanItem = {
    city: string;
    createTime: string;
    factoryName: string;
    firstAuditTime: string;
    loanAmount: number;
    modifyLoanAmount: number;
    nickname: string;
    phone: string;
    postName: string;
    province: string;
    region: string;
    remark: string;
    secondAuditTime: string;
    status: string;
    userLoanRecordId: number;
  }

  type LoanListResult = IResponseData<{
    records: LoanItem[];
    total: number;
  }>;

  type LoanConfigResult = IResponseData<{
    entryDayLimit: number;
    loanAmountMonthLimit: number;
    loanIntervalDayLimit: number;
  }>;
}
