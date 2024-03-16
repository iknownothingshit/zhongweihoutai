import type { ActionType, ParamsType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, App, Space } from 'antd';
import { useRef, useState, useMemo } from 'react';
import { getUserList } from '@/api/users';
import { useAccess } from '@umijs/max';
import dayjs from 'dayjs';

// 证书管理
const Certificate: React.FC = () => {
  const access = useAccess();
  const actionRef = useRef<ActionType>();

  const { modal: { confirm }, message } = App.useApp();

  const [assistant, setAssistant] = useState<UsersAPI.User | null>(null);
  const [editVisible, setEditVisible] = useState(false);

  const showEdit = (data: UsersAPI.User | null, type: string) => {
    setAssistant(data);
    setEditVisible(true);
  };

  const hideEdit = () => {
    setAssistant(null);
    setEditVisible(false);
  };

  // 离职
  const handleQuit = async (record: any) => {
    confirm({
      title: '确认手动离职该人员吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {

      }
    })
  }

  const columns: ProColumns<UsersAPI.User>[] = [
    {
      title: '用户ID',
      dataIndex: 'id',
      align: 'center',
      copyable: true,
      ellipsis: true,
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      align: 'center',
      copyable: true,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      align: 'center',
      copyable: true,
    },
    {
      title: 'openId',
      dataIndex: 'openId',
      align: 'center',

    },
    {
      title: '工厂',
      dataIndex: 'factoryName',
      align: 'center',
    },
    {
      title: '是否是驻场人员',
      dataIndex: 'isAuth',
      align: 'center',
      render: (text, record: UsersAPI.User) => record.isAuth ? '是' : '否'
    },
    {
      title: '注册时间',
      dataIndex: 'createTime',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '注册时间',
      dataIndex: 'createTime',
      align: 'center',
      hideInSearch: true,
      render: (text, record: UsersAPI.User) => record.createTime ? dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'
    },
    {
      title: '身份证号',
      dataIndex: ['idCard', 'idNumber'],
      align: 'center',
      hideInSearch: true
    },
    {
      title: '真实姓名',
      dataIndex: ['idCard', 'realName'],
      align: 'center',
      hideInSearch: true
    },
    {
      title: '证书',
      dataIndex: 'certificates',
      align: 'center',
      hideInSearch: true,
      render: (text, record: UsersAPI.User) => {
        if (!record.certificates) return '-'
        return record.certificates.map(c => {
          <div>【{c.name}】</div>
        })
      }
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      align: 'center',
      render: (text, record: UsersAPI.User) => {
        return <Space>
          {/* <a key="edit" onClick={() => showEdit(record, 'edit')} style={{ margin: 'auto' }}>
            编辑
          </a> */}

          <a key="quit" onClick={() => handleQuit(record)} style={{ margin: 'auto' }}>
            手动离职
          </a>
        </Space>
      }
    },
  ];

  // 查询列表
  const getTableData = async (
    params: ParamsType & {
      pageSize?: number | undefined;
      current?: number | undefined;
      keyword?: string | undefined;
      roleName?: string;
    } = {},
  ) => {
    const { code, data } = await getUserList(
      {
        ...params,
        pageNum: params.current,
        pageSize: params.pageSize,
      },
    );
    if (code === 200) {
      const { total, records } = data;
      return {
        data: records,
        total,
        success: true,
      };
    }
    return {
      data: [],
      success: false,
      total: 0,
    };
  };

  return (
    <div>
      <ProTable<UsersAPI.User>
        actionRef={actionRef}
        columns={columns}
        rowKey="id"
        request={getTableData}
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
        }}
        search={{
          defaultCollapsed: false,
        }}
        revalidateOnFocus={false}
      />

    </div>
  );
};

export default Certificate;
