declare namespace Authorization {
  export interface Message {
    status: string;
    isFinish: boolean;
    messages: any[];
  }

  interface Record {
    id: number;
    consultantId: string;
    consultantName: string;
    visitorId: string;
    visitorName: string;
    productName: string;
    consultingTime: string;
    firstAdvisoryStartTime?: any;
    secondAdvisoryStartTime?: any;
    authorizationTime: string;
    messages: Message[];
  }

  interface AuthorizationData {
    records: Record[];
    total: number;
    size: number;
    current: number;
    orders: any[];
    optimizeCountSql: boolean;
    searchCount: boolean;
    countId?: any;
    maxLimit?: any;
    pages: number;
  }
}
