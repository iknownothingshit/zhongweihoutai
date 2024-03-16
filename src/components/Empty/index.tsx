import { App } from 'antd';

import { MessageInstance } from 'antd/es/message/interface';

let message: MessageInstance;

// 在组件之外调用静态方法会报警告 Warning: [antd: message] Static function can not consume context like dynamic theme. Please use 'App' component instead.
// https://ant-design.gitee.io/docs/blog/why-not-static-cn
export default () => {
  const staticFuc = App.useApp();
  message = staticFuc.message;

  return null;
};

export { message };
