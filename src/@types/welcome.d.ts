declare namespace WelcomeAPI {
  type Dashboard = {
    activeUserCount: number;
    firstPayingUserCount: number;
    gmv: string;
    registerUserCount: number;
    repurchaseUserCount: number;
    returnCount: number;
    totalOrderCount: number;
    usingPlanUserCount: number;
    workAssistantCount: number;
    workConsultantCount: number;
  };

  type VisitData = {
    days: string;
    count: number;
  };

  type initData = {
    lastTenUserVisitCount: VisitData[];
    lastTenVisitCount: VisitData[];
    todayIp: number;
    todayVisitCount: number;
    totalVisitCount: number;
  };
}
