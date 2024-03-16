import type { ActionType, ParamsType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, App, Space, Image } from 'antd';
import { useRef, useState } from 'react';
import { getIntroductionList, deleteIntroduction } from '@/api/factory';
import { useAccess } from '@umijs/max';
import Edit from './components/Edit';
import { getRoleAccess } from '@/utils';
import TextDetail from '@/components/TextDetail';

// 工厂介绍
const Detail: React.FC = () => {
  const access = useAccess();
  const actionRef = useRef<ActionType>();

  const { modal: { confirm }, message } = App.useApp();
  const { canEdit, canDelete } = getRoleAccess();

  const [loading, setLoading] = useState(false)
  const [introduce, setIntroduce] = useState<FactoryAPI.Introduction | null>(null);
  const [editVisible, setEditVisible] = useState(false);

  const showEdit = (data: FactoryAPI.Introduction | null, type: string) => {
    setIntroduce(data);
    setEditVisible(true);
  };

  const hideEdit = () => {
    setIntroduce(null);
    setEditVisible(false);
  };

  // 离职
  const handleQuit = async (id?: number) => {
    if (loading || !id) return;
    confirm({
      title: '确认删除该介绍吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        setLoading(true);
        const { code } = await deleteIntroduction(id);
        setLoading(false)

        if (code !== 200) return;

        actionRef.current?.reload();
      }
    })
  }

  const columns: ProColumns<FactoryAPI.Introduction>[] = [
    {
      title: '工厂',
      dataIndex: 'factoryName',
      align: 'center',
      copyable: true,
    },
    {
      title: '地区',
      dataIndex: 'phone',
      align: 'center',
      copyable: true,
      hideInSearch: true,
      render: (text, record: FactoryAPI.Introduction) => (
        <span>{record.province + record.city + record.region}</span>)
    },
    {
      title: '标题',
      dataIndex: 'title',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '标签',
      dataIndex: 'tag',
      align: 'center',
      hideInSearch: true,
      render: (text, record: FactoryAPI.Introduction) => {
        return record.tag?.map((tag, i) => {
          return <div key={i}>
            【{tag}】
          </div>
        })
      }
    },
    {
      title: '相关图片',
      dataIndex: 'pic',
      align: 'center',
      hideInSearch: true,
      render: (text, record: FactoryAPI.Introduction) => {
        if (!Array.isArray(record.pic)) return;
        return record.pic?.map((p, i) => {
          return <Image key={i} src={p} width={200} height={100} />
        })
      }
    },
    {
      title: '上下架状态',
      dataIndex: 'status',
      align: 'center',
      hideInSearch: true,
      valueEnum: {
        LISTED: '上架中',
        REMOVED: '已下架'
      }
    },
    {
      title: '食堂',
      dataIndex: 'canteen',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '介绍内容',
      dataIndex: 'content',
      align: 'center',
      hideInSearch: true,
      width: 80,
      render: (text, record: FactoryAPI.Introduction) => {
        return <TextDetail title='查看' text={record.content} />
      }
    },
    {
      title: '宿舍',
      dataIndex: 'dormitory',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '厂区环境',
      dataIndex: 'factoryEnvironment',
      align: 'center',
      hideInSearch: true,
      width: 80,
      render: (text, record: FactoryAPI.Introduction) => {
        return <TextDetail title='查看' text={record.factoryEnvironment} />
      }
    },
    {
      title: '岗位介绍',
      dataIndex: 'postIntroduction',
      align: 'center',
      hideInSearch: true,
      width: 80,
      render: (text, record: FactoryAPI.Introduction) => {
        return <TextDetail title='查看' text={record.postIntroduction} />
      }
    },
    {
      title: '招聘须知',
      dataIndex: 'recruitmentNotice',
      align: 'center',
      hideInSearch: true,
      width: 80,
      render: (text, record: FactoryAPI.Introduction) => {
        return <TextDetail title='查看' text={record.recruitmentNotice} />
      }
    },
    {
      title: '福利待遇',
      dataIndex: 'welfareBenefits',
      align: 'center',
      hideInSearch: true,
      width: 80,
      render: (text, record: FactoryAPI.Introduction) => {
        return <TextDetail title='查看' text={record.welfareBenefits} />
      }
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      align: 'center',
      render: (text, record: FactoryAPI.Introduction) => {
        return <Space>
          {
            canEdit && <a key="edit" onClick={() => showEdit(record, 'edit')} style={{ margin: 'auto' }}>
              编辑
            </a>
          }

          {
            canDelete && <a key="quit" onClick={() => handleQuit(record.id)} style={{ margin: 'auto' }}>
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
    const { code, data } = await getIntroductionList(
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
      <ProTable<FactoryAPI.Introduction>
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
            新增工厂介绍
          </Button> : null,
        ]}
      />

      {/* 编辑 */}
      <Edit visible={editVisible} data={introduce} onCancel={hideEdit} onOk={handleEdit} />
    </div>
  );
};

export default Detail;
