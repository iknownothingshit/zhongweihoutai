import type { ActionType, ParamsType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { App, Space, Switch } from 'antd';
import { useRef, useState } from 'react';
import { getUserList, resignUser } from '@/api/users';
import { useAccess } from '@umijs/max';
import dayjs from 'dayjs';
import { getRoleAccess } from '@/utils';
import Audit from './components/Audit';

// 人员管理
const Users: React.FC = () => {
  const access = useAccess();
  const actionRef = useRef<ActionType>();

  const { modal: { confirm }, message } = App.useApp();
  const { canEdit } = getRoleAccess();

  const [certificates, setCertificates] = useState<UsersAPI.Certificates[]>([]);
  const [auditVisible, setAuditVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [queryToBeAudit, setQueryToBeAudit] = useState(false);

  const showAudit = (data: UsersAPI.Certificates[]) => {
    setCertificates(data);
    setAuditVisible(true);
  };

  const hideAudit = (needReload?: boolean) => {
    setAuditVisible(false);
    if (needReload) actionRef.current?.reload();
  };

  // 离职
  const handleQuit = async (record: UsersAPI.User) => {
    if (loading) return;
    confirm({
      title: '确认手动离职该人员吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        setLoading(true);
        message.loading({ content: '执行中', duration: 0, key: 'resign' });

        const { code, message: msg } = await resignUser(record.id);
        setLoading(false)
        message.destroy('resign');

        if (code !== 200) {
          message.error(msg || '无法离职该人员');
          return;
        }

        message.success('执行成功');
        actionRef.current?.reload();
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
      hideInSearch: true
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      align: 'center',
      copyable: true,
    },
    {
      title: '工厂',
      dataIndex: 'factoryName',
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
      title: '真实姓名',
      dataIndex: 'realname',
      align: 'center',
      hideInTable: true
    },
    {
      title: '证书',
      dataIndex: 'certificates',
      align: 'center',
      hideInSearch: true,
      render: (text, record: UsersAPI.User) => {
        if (!record.certificates) return '-'
        return <a onClick={() => showAudit(record.certificates)}
        >查看</a>
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

          {
            canEdit && <a key="quit" onClick={() => handleQuit(record)} style={{ margin: 'auto' }}>
              手动离职
            </a>
          }
        </Space>
      }
    },
  ];

  const handleSwitch = (val: boolean) => {
    setQueryToBeAudit(val);
    actionRef.current?.reload();
  }

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
        certificateNeedAuditor: queryToBeAudit,
        pageNum: params.current,
        pageSize: params.pageSize,
      },
    );
    if (code === 200) {
      const { total, records } = data;
      console.log(records)
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
        toolBarRender={() => [
          <Switch value={queryToBeAudit} onChange={handleSwitch} checkedChildren='查询证书待审核用户' unCheckedChildren='查询证书待审核用户' />
        ]}
        revalidateOnFocus={false}
      />

      <Audit
        visible={auditVisible}
        data={certificates}
        canEdit={canEdit}
        onCancel={hideAudit}
      />

    </div>
  );
};

export default Users;
