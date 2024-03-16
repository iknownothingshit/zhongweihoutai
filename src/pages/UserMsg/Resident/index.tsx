import type { ActionType, ParamsType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Space, App } from 'antd';
import { useRef, useState, } from 'react';
import { getList, deleteResident } from '@/api/resident';
import { useAccess } from '@umijs/max';
import Edit from './components/Edit';
import { getRoleAccess } from '@/utils';
import dayjs from 'dayjs';

// 驻场管理
const Resident: React.FC = () => {
  const access = useAccess();
  const actionRef = useRef<ActionType>();

  const { modal: { confirm }, message } = App.useApp();
  const { canEdit, canDelete } = getRoleAccess();

  const [loading, setLoading] = useState(false)
  const [resident, setResident] = useState<ResidentAPI.Resident | null>(null);
  const [editVisible, setEditVisible] = useState(false);
  const [type, setType] = useState('')

  const showEdit = (data: ResidentAPI.Resident | null, t: string) => {
    setResident(data);
    setType(t);
    setEditVisible(true);
  };

  const hideEdit = () => {
    setResident(null);
    setType('');
    setEditVisible(false);
  };

  // 删除
  const handleDelete = async (id?: number) => {
    if (loading || !id) return;
    confirm({
      title: '确认删除该驻场吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        setLoading(true);
        const { code } = await deleteResident(id);
        setLoading(false)

        if (code !== 200) return;

        actionRef.current?.reload();
      }
    })
  };

  const columns: ProColumns<ResidentAPI.Resident>[] = [
    {
      title: '驻场ID',
      dataIndex: 'id',
      align: 'center',
      copyable: true,
      width: 150,
      ellipsis: true,
      hideInSearch: true
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      align: 'center',
      copyable: true,
      hideInSearch: true
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      align: 'center',
      copyable: true,
      hideInSearch: true
    },
    {
      title: '工厂',
      dataIndex: 'factoryName',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '地区',
      dataIndex: 'area',
      align: 'center',
      hideInSearch: true,
      render: (text, record: ResidentAPI.Resident) => (
        <span>{record.province + record.city + record.region}</span>)
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      hideInSearch: true,
      render: (text, record: ResidentAPI.Resident) => record.createTime ? dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      align: 'center',
      render: (text, record: ResidentAPI.Resident) => {
        return <Space>
          {/* <a key="edit" onClick={() => showEdit(record, 'edit')} style={{ margin: 'auto' }}>
            编辑
          </a> */}

          {
            canDelete && <a key="quit" onClick={() => handleDelete(record.id)} style={{ margin: 'auto' }}>
              删除
            </a>
          }
        </Space>
      },
    },
  ];

  // 完成编辑
  const handleEdit = () => {
    setEditVisible(false);
    actionRef.current?.reload();
  };

  // 查询列表
  const getTableData = async (
    params: ParamsType & {
      pageSize?: number | undefined;
      current?: number | undefined;
      keyword?: string | undefined;
      roleName?: string;
    } = {},
  ) => {
    const { code, data } = await getList(
      {
        ...params,
        pageNum: params.current,
        pageSize: params.pageSize,
      },);
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
      <ProTable<ResidentAPI.Resident>
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
        toolBarRender={() => [
          canEdit ? <Button key="add" type="primary" onClick={() => showEdit(null, 'adding')}>
            新增驻场
          </Button> : null,
        ]}
      />

      {/* 编辑 */}
      <Edit visible={editVisible} data={resident} onCancel={hideEdit} onOk={handleEdit} />
    </div>
  );
};

export default Resident;
