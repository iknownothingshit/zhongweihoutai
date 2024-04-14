import type { ActionType, ParamsType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, App } from 'antd';
import { useRef, useState } from 'react';
import { getLoanList } from '@/api/borrow';
import { useAccess } from '@umijs/max';
import dayjs from 'dayjs';
import { getRoleAccess } from '@/utils/index';

// 钱包流水
const Wallet: React.FC = () => {
  const access = useAccess();
  const actionRef = useRef<ActionType>();

  const { message } = App.useApp();

  const [loading, setLoading] = useState(false);
  const [uploadVis, setUploadVis] = useState(false);

  const { canEditAllMoneyModule } = getRoleAccess();

  // 一键发布
  const publishAll = async () => {

  }

  const columns: ProColumns<LoanAPI.LoanItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      align: 'center',
    },
    {
      title: '用户id',
      dataIndex: 'userId',
      align: 'center',
      copyable: true
    },
    {
      title: '明细类型',
      dataIndex: 'nickname',
      align: 'center',
      copyable: true,
    },
    {
      title: '收支',
      dataIndex: 'bankNumber',
      align: 'center',
      copyable: true,
      hideInSearch: true
    },
    {
      title: '时间',
      dataIndex: 'bankNumber',
      align: 'center',
      hideInSearch: true
    },
  ];

  // 查询列表
  const getTableData = async (
    params: ParamsType & {
      pageSize?: number | undefined;
      current?: number | undefined;
    } = {},
  ) => {
    const { code, data } = await getLoanList(
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
      <ProTable<LoanAPI.LoanItem>
        actionRef={actionRef}
        columns={columns}
        rowKey="userLoanRecordId"
        request={getTableData}
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
        }}
        search={{
          defaultCollapsed: false,
        }}
        revalidateOnFocus={false}
      // toolBarRender={() => [
      //   canEditAllMoneyModule && <Button type='primary' onClick={publishAll} key="publish" style={{ marginRight: '20px' }}>一键发布</Button>,
      //   canEditAllMoneyModule && <Button type='primary' onClick={() => setUploadVis(true)} key="upload">导入数据</Button>,
      // ]}
      />

    </div>
  );
};

export default Wallet;
