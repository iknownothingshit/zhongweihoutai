import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Card, Avatar } from 'antd';
import React, { useState, useEffect } from 'react';
import './Welcome.less';


const defaultUser = {
  deptName: '暂无部门',
  roleName: '暂无角色',
  lastLoginTime: '首次登陆',
  avatar: 'default.jpg',
  username: '花泽香菜',
};

const welcomeArr = [
  '喝杯咖啡休息下吧☕',
  '要不要和朋友打局LOL',
  '今天又写了几个Bug🐞呢',
  '今天在群里吹水了吗',
  '今天吃了什么好吃的呢',
  '今天您微笑了吗😊',
  '今天帮别人解决问题了吗',
  '准备吃些什么呢',
  '周末要不要去看电影？',
];

// 随机生成欢迎语
const getRandomWelcome = (username: string) => {
  const date = new Date();
  const hour = date.getHours();
  let time = '';
  switch (hour) {
    case 0:
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
    case 10:
    case 11:
      time = '早上好'
      break;
    case 12:
    case 13:
      time = '中午好'
      break;
    case 14:
    case 15:
    case 16:
    case 17:
    case 18:
      time = '下午好'
      break;
    case 18:
    case 19:
    case 20:
    case 21:
    case 22:
    case 23:
    case 24:
    case 11:
      time = '晚上好'
      break;
    default:
      time = '早上好'
      break;
  }

  const index = Math.floor(Math.random() * welcomeArr.length);
  return `${time}, ${username}, ${welcomeArr[index]}`
};


// 首页
const Welcome: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const [welcome, setWelcome] = useState(''); // 欢迎语

  const currentUser = initialState?.currentUser || defaultUser;

  // 随机生成欢迎语
  const randomWelcome = () => {
    setWelcome(getRandomWelcome(currentUser.username));
  };


  useEffect(() => {
    randomWelcome();
  }, []);

  const { Meta } = Card;
  const description = (
    <div className="desc">
      <div>{`${currentUser.deptName ? currentUser.deptName : '暂无部门'} | ${currentUser.roleName ? currentUser.roleName : '暂无角色'
        }`}</div>
      <div>上次登陆时间：{currentUser.lastLoginTime ? currentUser.lastLoginTime : '首次登陆'}</div>
    </div>
  );

  return (
    <PageContainer className="welcomePage">
      {/* 用户卡片 */}
      <Card className="round-card" bordered={false}>
        <Meta
          avatar={
            <Avatar size="small" className="welcome-avatar" src={currentUser.avatar} alt="avatar" />
          }
          title={welcome}
          description={description}
        />
      </Card>
    </PageContainer>
  );
};

export default Welcome;
