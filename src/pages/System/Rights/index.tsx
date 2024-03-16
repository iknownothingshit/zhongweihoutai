import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { useAccess, useModel } from '@umijs/max';
import { Button, App, Modal, Tooltip, Space } from 'antd';
import { useEffect, useRef, useState, useMemo } from 'react';
import Detail from './detail';
import { deleteRights, addRights, editRights } from '@/api/system';
import { parseToFormData } from '@/utils';

const iterateRights = (items: any[], prefix: string) => {
  const res: any[] = [];
  try {
    items.forEach((o: any) => {
      const text = prefix ? `${prefix} > ${o.label}` : o.label;
      res.push({
        text,
        value: text,
      });
      if (o.hasChildren) res.push(...iterateRights(o.children, text));
    });
  } catch (err) {
    console.log(items, '不对，递归出错了');
  }
  return res;
};

// 权限管理
const Rights: React.FC = () => {
  const access = useAccess();
  const actionRef = useRef<ActionType>();
  const { rights, initRights, getRights } = useModel('rights');

  const { message } = App.useApp();

  useEffect(() => {
    initRights();
  }, []);

  // 递归遍历权限树
  const formatRights = useMemo(() => {
    if (!rights || !rights.length) return [];
    return iterateRights(rights, '');
  }, [rights]);

  const [detailVisible, setDetailVisible] = useState(false);
  const [right, setRight] = useState<Partial<SystemAPI.MenuItem> | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  const showDetail = (data: Partial<SystemAPI.MenuItem> | null, type: string) => {
    setRight(data);
    setIsAdding(type === 'adding');
    setDetailVisible(true);
  };

  const hideDetail = () => {
    setRight(null);
    setDetailVisible(false);
  };

  // 提交修改 ｜ 新增
  const submitRight = async (data: any) => {
    const req = isAdding ? addRights : editRights;

    if (loading) return;
    setLoading(true);
    await req(parseToFormData(data));
    setLoading(false);

    message.success('执行成功');
    hideDetail();
    getRights();
  };

  // 删除权限
  const deleteConfirm = (ids: string, label: any) => {
    Modal.confirm({
      content: `权限【${label}】将被永久删除，确认执行吗？`,
      onOk: async () => {
        if (loading) return;
        setLoading(true);
        await deleteRights(ids);
        setLoading(false);

        message.success('删除成功');
        getRights();
      },
    });
  };

  const columns: ProColumns<SystemAPI.MenuItem>[] = [
    {
      title: '名称',
      dataIndex: 'label',
      filters: formatRights,
      filterSearch: true,
      align: 'center',
      onFilter: (value: string | number | boolean, record: SystemAPI.MenuItem) => {
        if (typeof value !== 'string') return false;
        return value.indexOf(record.label) !== -1;
      },
    },
    {
      title: '权限code',
      dataIndex: 'perms',
      copyable: true,
      align: 'center',
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      align: 'center',
      width: 200,
      render: (text, record: SystemAPI.MenuItem) => (
        <Space>
          {access.canEditRight ? (
            <a key="edit" onClick={() => showDetail(record, 'editing')}>
              <Tooltip title="编辑">
                <EditOutlined />
              </Tooltip>
            </a>
          ) : null}

          {access.canAddRight ? (
            <a
              key="add"
              onClick={() =>
                showDetail(
                  {
                    parentId: record.id,
                  },
                  'adding',
                )
              }
            >
              <Tooltip title="添加">
                <PlusOutlined />
              </Tooltip>
            </a>
          ) : null}

          {access.canDeleteRight ? (
            <a key="delete" onClick={() => deleteConfirm(record.id, record.label)}>
              <Tooltip title="删除">
                <DeleteOutlined />
              </Tooltip>
            </a>
          ) : null}
        </Space>
      ),
    },
  ];

  return (
    <>
      <ProTable<SystemAPI.MenuItem>
        actionRef={actionRef}
        columns={columns}
        dataSource={rights}
        rowKey="id"
        search={false}
        toolBarRender={() => {
          return [
            access.canAddRight ? (
              <Button type="primary" onClick={() => showDetail({}, 'adding')}>
                新增
              </Button>
            ) : null,
          ];
        }}
      />
      <Detail
        visible={detailVisible}
        data={right}
        onCancel={hideDetail}
        onSubmit={submitRight}
        isAdding={isAdding}
      />
    </>
  );
};

export default Rights;
