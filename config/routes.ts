export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './User/Login',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
    hideInMenu: true,
  },
  // 用户信息
  {
    name: 'userMsg',
    icon: 'https://admin.glowe.cn/glowe/img/admin/user.svg',
    path: '/userMsg',
    routes: [
      {
        // 人员管理
        path: '/userMsg/users',
        name: 'users',
        component: './UserMsg/Users/index',
      },
      {
        // 驻场管理
        path: '/userMsg/resident',
        name: 'resident',
        component: './UserMsg/Resident/index',
      },
      // {
      //   // 证书管理
      //   path: '/userMsg/certificate',
      //   name: 'certificate',
      //   component: './UserMsg/Certificate/index',
      // },
    ],
  },
  // 报名信息
  {
    name: 'signUpMsg',
    icon: 'https://admin.glowe.cn/glowe/img/admin/system.svg',
    path: '/signUpMsg',
    routes: [
      {
        // 报名管理
        path: '/signUpMsg/detail',
        name: 'detail',
        component: './SignUpMsg/Detail/index',
      },
    ],
  },
  // 招聘信息
  {
    name: 'factoryMsg',
    icon: 'https://admin.glowe.cn/glowe/img/admin/user.svg',
    path: '/factoryMsg',
    routes: [
      {
        // 工厂管理
        path: '/factoryMsg/factory',
        name: 'factory',
        component: './FactoryMsg/Factory/index',
      },
      {
        // 工厂介绍
        path: '/factoryMsg/detail',
        name: 'detail',
        component: './FactoryMsg/Detail/index',
      },

      {
        // 岗位管理
        path: '/factoryMsg/job',
        name: 'job',
        component: './FactoryMsg/Job/index',
      },
    ],
  },
  // 资金管理
  {
    name: 'loanMsg',
    icon: 'https://admin.glowe.cn/glowe/img/admin/user.svg',
    path: '/loanMsg',
    routes: [
      {
        // 借资管理
        path: '/loanMsg/loan',
        name: 'loan',
        component: './Borrow/audit/index',
      },
      {
        // 借资配置
        path: '/loanMsg/config',
        name: 'config',
        component: './Borrow/config/index',
      },
      {
        // 薪资结算
        path: '/loanMsg/salary',
        name: 'salary',
        component: './Borrow/salary/index',
      },
      // {
      //   // 钱包流水
      //   path: '/loanMsg/wallet',
      //   name: 'wallet',
      //   component: './Borrow/wallet/index',
      // },
    ],
  },
  {
    // 系统管理
    name: 'system',
    icon: 'https://admin.glowe.cn/glowe/img/admin/system.svg',
    path: '/system',
    routes: [
      {
        // 系统人员信息
        path: '/system/user',
        name: 'user',
        component: './System/Users/index',
      },
      // {
      //   // 权限管理
      //   path: '/system/rights',
      //   name: 'rights',
      //   component: './System/Rights/index',
      // },
    ],
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
