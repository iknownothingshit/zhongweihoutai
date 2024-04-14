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

  type ConfigItem = {
    entryDayLimit: number;
    loanAmountMonthLimit: number;
    loanIntervalDayLimit: number;
    createTime: string;
    factoryId: number;
    factoryName: string;
    id: number;
  }

  type LoanConfigResult = IResponseData<{
    records: ConfigItem[];
    total: number;
  }>;

  type SalaryItem = {
    idNumber: string;
    amount: number;
    bankNumber: string;
    createTime: string;
    postscript: string;
    realName: string;
    moneyUsage: string;
    isRecharge: boolean;
  }

  type SalaryListResult = IResponseData<{
    records: SalaryItem[];
    total: number;
  }>;
}
