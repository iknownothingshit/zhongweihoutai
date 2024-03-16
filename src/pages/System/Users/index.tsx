import { getUsers, deleteUsers, editUser, addUser } from '@/api/system';
import {
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import type { ActionType, ParamsType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { useModel, useAccess } from '@umijs/max';
import { App, Tooltip, Modal, Button } from 'antd';
import { useRef, useState } from 'react';
import Edit from './edit';
import './index.less';
import dayjs from 'dayjs';
import { getRoleAccess } from '@/utils';

export const roleMap = [
  {
    label: '专员',
    value: 'OFFICER'
  },
  {
    label: '驻场',
    value: 'RESIDENT'
  },
  {
    label: '管理员',
    value: 'SYSTEM_ADMIN'
  }
]

// 管理员管理
const Users: React.FC = () => {
  const access = useAccess();
  const actionRef = useRef<ActionType>();

  const { message } = App.useApp();
  const { canEdit, canDelete } = getRoleAccess();

  const { initialState } = useModel('@@initialState');
  const currentUser: any = initialState?.currentUser || {};

  const [user, setUser] = useState<SystemAPI.UserItem | null>(null);
  const [editVisible, setEditVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const showEdit = (data: SystemAPI.UserItem | null, isA: boolean) => {
    setUser(data);
    setIsAdding(isA);
    setEditVisible(true);
  };

  const hideEdit = () => {
    setUser(null);
    setIsAdding(false);
    setEditVisible(false);
  };

  // 提交编辑或新增
  const onOk = async (data: SystemAPI.UserItem) => {
    if (loading) return;

    const par: any = { ...data };

    setLoading(true);
    isAdding ? await addUser(par) : await editUser(par);
    setLoading(false);

    message.success('提交成功');
    hideEdit();
    actionRef.current?.reload();
  };

  // 删除
  const deleteConfirm = (id: number) => {
    if (!id || loading) return;

    if (id === currentUser.id) {
      message.warning('无法删除当前登录用户，操作已取消');
      return;
    }

    Modal.confirm({
      content: '选中用户将被永久删除，是否继续？',
      onOk: async () => {
        setLoading(true);
        message.loading({ content: '删除中', duration: 0, key: 'deleting' });
        await deleteUsers(id);
        setLoading(false);
        message.destroy('deleting');

        message.success('删除成功');
        actionRef.current?.reload();
      },
    });
  };

  const columns: ProColumns<SystemAPI.UserItem>[] = [
    {
      title: '用户ID',
      dataIndex: 'id',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '用户名',
      dataIndex: 'name',
      align: 'center',
      copyable: true,
    },
    {
      title: '电话',
      dataIndex: 'phone',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '邀请码',
      dataIndex: 'inviteCode',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '角色',
      dataIndex: 'role',
      align: 'center',
      hideInSearch: true,
      render: (text, record: SystemAPI.UserItem) => {
        return roleMap.find(r => r.value === record.role)?.label
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      hideInSearch: true,
      render: (text, record: SystemAPI.UserItem) => record.createTime ? dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'
    },
    // {
    //   title: '更新时间',
    //   align: 'center',
    //   dataIndex: 'updateAt',
    //   render: (text, record: SystemAPI.UserItem) => record.updateAt ? dayjs(record.updateAt).format('YYYY-MM-DD HH:mm:ss') : '-'
    // },
    {
      title: '操作',
      align: 'center',
      valueType: 'option',
      key: 'option',
      render: (text, record: SystemAPI.UserItem) => {
        return (
          <div className="options">

            {
              canEdit && <a key="edit" onClick={() => showEdit(record, false)}>
                <Tooltip title="编辑">
                  <EditOutlined />
                </Tooltip>
              </a>
            }


            {
              canDelete && <a key="delete" onClick={() => deleteConfirm(record.id)}>
                <Tooltip title="删除">
                  <DeleteOutlined />
                </Tooltip>
              </a>
            }
          </div>
        );
      },
    },
  ];

  const getTableData = async (
    params: ParamsType & {
      pageSize?: number | undefined;
      current?: number | undefined;
    } = {},
  ) => {
    const { username, deptName } = params;

    const query: any = {
      username,
      deptName,
      pageNum: params.current,
      pageSize: params.pageSize,
    };

    const { code, data } = await getUsers(query);
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
    <>
      <ProTable<SystemAPI.UserItem>
        actionRef={actionRef}
        columns={columns}
        rowKey="id"
        request={getTableData}
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
        }}
        revalidateOnFocus={false}
        toolBarRender={() => [
          canEdit ? <Button key="add" type="primary" onClick={() => showEdit(null, true)}>
            新增人员
          </Button> : null,
        ]}
      />
      <Edit
        visible={editVisible}
        data={user}
        onCancel={hideEdit}
        loading={loading}
        onSubmit={onOk}
      />

    </>
  );
};
export default Users;
