import type { ActionType, ParamsType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { App, Popconfirm, Tooltip, Modal, Input, Space } from 'antd';
import { useRef, useState } from 'react';
import { getSignUpList, doAudit, editCode } from '@/api/signUp';
import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
import { useAccess } from '@umijs/max';
import { getRoleAccess } from '@/utils';
import dayjs from 'dayjs';

// 报名管理
const SignUp: React.FC = () => {
  const access = useAccess();
  const actionRef = useRef<ActionType>();

  const { modal: { confirm }, message } = App.useApp();
  const { canEdit, canDelete } = getRoleAccess();

  const [loading, setLoading] = useState(false);
  const [editVis, setEditVis] = useState(false);
  const [iCode, setICode] = useState('');
  const [curItem, setCurItem] = useState<SignUpAPI.Item | null>(null);

  const showEdit = (record: SignUpAPI.Item) => {
    setCurItem(record);
    setICode(record.inviteCode);
    setEditVis(true);
  }

  // 编辑邀请码
  const handleEditCode = async () => {
    if (loading || !iCode) return;
    setLoading(true);

    const val: any = { ...curItem };
    val.inviteCode = iCode;
    val.id = val.postApplicationId;

    const { code } = await editCode(val as any);
    setLoading(false);

    if (code !== 200) {
      message.error('编辑失败');
      return;
    }

    message.success('编辑成功');
    hideEdit();
    actionRef.current?.reload();
  }

  const hideEdit = () => {
    setCurItem(null); setICode(''); setEditVis(false);
  }

  // 审核
  const handleAudit = async (postApplicationId: number, status: string) => {
    if (loading) return;
    setLoading(true);
    const { code } = await doAudit({
      postApplicationId,
      status,
    });
    setLoading(false);
    if (code !== 200) return;

    message.success('审核成功');
    actionRef.current?.reload();
  };

  const columns: ProColumns<SignUpAPI.Item>[] = [
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
      title: '工厂名',
      dataIndex: 'factoryName',
      align: 'center',
    },
    {
      title: '用户邀请码',
      dataIndex: 'inviteCode',
      align: 'center',
      render: (text, record: SignUpAPI.Item) => {
        return <Space>
          {record.inviteCode}
          <a onClick={() => showEdit(record)}>
            <EditOutlined />
          </a>
        </Space>
      }
    },
    {
      title: '地区',
      dataIndex: 'area',
      align: 'center',
      hideInSearch: true,
      render: (text, record: SignUpAPI.Item) => (
        <span>{record.province + record.city + record.region}</span>)
    },
    {
      title: '岗位',
      dataIndex: 'postName',
      align: 'center',
    },
    {
      title: '薪资',
      dataIndex: 'salary',
      align: 'center',
      hideInSearch: true,
      render: (text, record: SignUpAPI.Item) => (
        <span>{record.salary}/{record.timeUnit}</span>)
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      hideInSearch: true,
      render: (text, record: SignUpAPI.Item) => record.createTime ? dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'
    },
    {
      title: '离职时间',
      dataIndex: 'separateTime',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '审核状态',
      dataIndex: 'status',
      align: 'center',
      valueType: 'select',
      fieldProps: {
        options: [
          { label: '已通过', value: 'PASSED' },
          { label: '已拒绝', value: 'REJECTED' },
          { label: '已离职', value: 'SEPARATED' },
          { label: '待审核', value: 'TO_BE_AUDIT' }
        ]
      }
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      align: 'center',
      render: (text, record: SignUpAPI.Item) => {
        if (!canEdit) return;

        return record.status === 'TO_BE_AUDIT'
          ? [
            <a key="pass">
              <Popconfirm title="确认通过吗？" onConfirm={() => handleAudit(record.postApplicationId, 'PASSED')}>
                <Tooltip title="通过">
                  <CheckOutlined />
                </Tooltip>
              </Popconfirm>
            </a>,
            <a key="refuse">
              <Popconfirm title="确认拒绝吗？" onConfirm={() => handleAudit(record.postApplicationId, 'REJECTED')}>
                <Tooltip title="拒绝">
                  <CloseOutlined />
                </Tooltip>
              </Popconfirm>
            </a>,
          ]
          : null;
      },
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
    const { code, data } = await getSignUpList(
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
    <div className="assistantPage">
      <ProTable<SignUpAPI.Item>
        actionRef={actionRef}
        columns={columns}
        rowKey="postApplicationId"
        request={getTableData}
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
        }}
        search={{
          defaultCollapsed: false,
        }}
        revalidateOnFocus={false}
        toolBarRender={false}
      />

      <Modal
        open={editVis}
        confirmLoading={loading}
        title="邀请码编辑"
        onOk={handleEditCode}
        onCancel={() => { setCurItem(null); setICode(''); setEditVis(false); }}
      >
        <Input value={iCode} onChange={(e: any) => {
          setICode(e.target.value || '')
        }} />
      </Modal>
    </div>
  );
};

export default SignUp;
