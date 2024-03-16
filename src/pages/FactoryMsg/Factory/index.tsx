import type { ActionType, ParamsType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, App, Space } from 'antd';
import { useRef, useState } from 'react';
import { getFactoryList, deleteFactory } from '@/api/factory';
import { useAccess } from '@umijs/max';
import Edit from './components/Edit';
import { getRoleAccess } from '@/utils';
import dayjs from 'dayjs';

// 工厂管理
const Factory: React.FC = () => {
  const access = useAccess();
  const actionRef = useRef<ActionType>();

  const { modal: { confirm } } = App.useApp();
  const { canEdit, canDelete } = getRoleAccess();

  const [loading, setLoading] = useState(false)
  const [factory, setFactory] = useState<FactoryAPI.Factory | null>(null);
  const [editVisible, setEditVisible] = useState(false);
  const [type, setType] = useState('')

  const showEdit = (data: FactoryAPI.Factory | null, t: string) => {
    setFactory(data);
    setType(t)
    setEditVisible(true);
  };

  const hideEdit = () => {
    setFactory(null);
    setType('')
    setEditVisible(false);
  };

  // 删除
  const handleDelete = async (id?: number) => {
    if (loading || !id) return;
    confirm({
      title: '确认删除该工厂吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        setLoading(true);
        const { code } = await deleteFactory(id);
        setLoading(false)

        if (code !== 200) return;

        actionRef.current?.reload();
      }
    })
  };

  const columns: ProColumns<FactoryAPI.Factory>[] = [
    {
      title: '工厂ID',
      dataIndex: 'id',
      align: 'center',
      copyable: true,
      width: 150,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '工厂名',
      dataIndex: 'name',
      align: 'center',
      copyable: true,
      hideInSearch: true,
    },
    {
      title: '地区',
      dataIndex: 'area',
      align: 'center',
      hideInSearch: true,
      render: (text, record: FactoryAPI.Factory) => (
        <span>{record.province + record.city + record.region}</span>)
    },
    // {
    //   title: '创建时间',
    //   dataIndex: 'createTime',
    //   align: 'center',
    //   hideInSearch: true
    // },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      hideInSearch: true,
      render: (text, record: FactoryAPI.Factory) => record.createTime ? dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      align: 'center',
      hideInSearch: true,
      render: (text, record: FactoryAPI.Factory) => record.updateTime ? dayjs(record.updateTime).format('YYYY-MM-DD HH:mm:ss') : '-'
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      align: 'center',
      width: 80,
      render: (text, record: FactoryAPI.Factory) => {
        return <Space>
          {
            canEdit && <a key="edit" onClick={() => showEdit(record, 'edit')} style={{ margin: 'auto' }}>
              编辑
            </a>
          }

          {
            canDelete && <a key="quit" onClick={() => handleDelete(record.id)} style={{ margin: 'auto' }}>
              删除
            </a>
          }
        </Space>
      }
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
    } = {},
  ) => {
    const { code, data } = await getFactoryList(
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
      <ProTable<FactoryAPI.Factory>
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
            添加
          </Button> : null,
        ]}
      />

      {/* 编辑 */}
      <Edit visible={editVisible} type={type} data={factory} onCancel={hideEdit} onOk={handleEdit} />
    </div>
  );
};

export default Factory;
