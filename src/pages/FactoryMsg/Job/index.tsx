import type { ActionType, ParamsType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, App, Space, Image } from 'antd';
import { useRef, useState, useMemo } from 'react';
import { getJobList, deleteJob } from '@/api/factory';
import { useAccess } from '@umijs/max';
import Edit from './components/Edit';
import { getRoleAccess } from '@/utils';
import TextDetail from '@/components/TextDetail';

// 岗位管理
const Job: React.FC = () => {
  const access = useAccess();
  const actionRef = useRef<ActionType>();

  const { modal: { confirm }, message } = App.useApp();
  const { canEdit, canDelete } = getRoleAccess();

  const [loading, setLoading] = useState(false)
  const [job, setJob] = useState<FactoryAPI.Job | null>(null);
  const [editVisible, setEditVisible] = useState(false);

  const showEdit = (data: FactoryAPI.Job | null) => {
    setJob(data);
    setEditVisible(true);
  };

  const hideEdit = () => {
    setJob(null);
    setEditVisible(false);
  };


  // 删除
  const handleDelete = async (id?: number) => {
    if (loading || !id) return;
    confirm({
      title: '确认删除该岗位吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        setLoading(true);
        const { code } = await deleteJob(id);
        setLoading(false)

        if (code !== 200) return;

        actionRef.current?.reload();
      }
    })
  };

  const columns: ProColumns<FactoryAPI.Job>[] = [
    {
      title: '岗位ID',
      dataIndex: 'id',
      align: 'center',
      copyable: true,
      width: 150,
      ellipsis: true,
    },
    {
      title: '工厂名',
      dataIndex: 'factoryName',
      align: 'center',
      copyable: true,
    },
    {
      title: '地区',
      dataIndex: 'area',
      align: 'center',
      copyable: true,
      hideInSearch: true,
      render: (text, record: FactoryAPI.Job) => (
        <span>{record.province + record.city + record.region}</span>)
    },
    {
      title: '岗位',
      dataIndex: 'postName',
      align: 'center',
    },
    {
      title: '在职人数',
      dataIndex: 'entryNumber',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '上下架状态',
      dataIndex: 'status',
      align: 'center',
      valueEnum: {
        LISTED: '上架中',
        REMOVED: '已下架'
      }
    },
    {
      title: '报名人数',
      dataIndex: 'postNumber',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '薪酬',
      dataIndex: 'salary',
      align: 'center',
      hideInSearch: true,
      render: (text, record: FactoryAPI.Job) => (
        <span>{record.salary}/{record.timeUnit}</span>)
    },
    {
      title: '食宿介绍',
      dataIndex: 'accommodation',
      align: 'center',
      hideInSearch: true,
      render: (text, record: FactoryAPI.Job) => {
        return <TextDetail text={record.accommodation} />
      }
    },
    {
      title: '封面照片',
      dataIndex: 'accommodation',
      align: 'center',
      hideInSearch: true,
      render: (text, record: FactoryAPI.Job) => {
        if (!record.coverPic || !Array.isArray(record.coverPic)) return '-';
        return record.coverPic.map(p => {
          return <Image src={p} key={p} />
        })
      }
    },
    {
      title: '入职流程指南',
      dataIndex: 'entryProcessPic',
      align: 'center',
      hideInSearch: true,
      render: (text, record: FactoryAPI.Job) => {
        return <Image src={record.entryProcessPic} />
      }
    },
    {
      title: '岗位介绍',
      dataIndex: 'postIntroduction',
      align: 'center',
      hideInSearch: true,
      render: (text, record: FactoryAPI.Job) => {
        return <TextDetail text={record.postIntroduction} />
      }
    },
    {
      title: '薪资介绍',
      dataIndex: 'salaryIntroduction',
      align: 'center',
      hideInSearch: true,
      render: (text, record: FactoryAPI.Job) => {
        return <TextDetail text={record.salaryIntroduction} />
      }
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      align: 'center',
      render: (text, record: FactoryAPI.Job) => {
        return <Space>
          {
            canEdit && <a key="edit" onClick={() => showEdit(record)} style={{ margin: 'auto' }}>
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
      keyword?: string | undefined;
      roleName?: string;
    } = {},
  ) => {
    const { code, data } = await getJobList(
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
    <div className="assistantPage">
      <ProTable<FactoryAPI.Job>
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
          canEdit ? <Button key="add" type="primary" onClick={() => showEdit(null)}>
            新增岗位
          </Button> : null,
        ]}
      />

      {/* 编辑 */}
      <Edit visible={editVisible} data={job} onCancel={hideEdit} onOk={handleEdit} />
    </div>
  );
};

export default Job;
