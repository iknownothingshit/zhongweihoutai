import type { ActionType, ParamsType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, App } from 'antd';
import { useRef, useState } from 'react';
import { getSalaryList } from '@/api/borrow';
import { useAccess } from '@umijs/max';
import dayjs from 'dayjs';
import UploadCom from './components/Upload';
import { getRoleAccess } from '@/utils/index';

// 薪资结算
const Salary: React.FC = () => {

  const access = useAccess();
  const actionRef = useRef<ActionType>();

  const { message } = App.useApp();

  const [loading, setLoading] = useState(false);
  const [uploadVis, setUploadVis] = useState(false);

  const { canEditAllMoneyModule } = getRoleAccess();

  // 一键发布
  const publishAll = async () => {

  }

  const columns: ProColumns<LoanAPI.SalaryItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      align: 'center',
    },
    {
      title: '账号',
      dataIndex: 'bankNumber',
      align: 'center',
      copyable: true
    },
    {
      title: '户名',
      dataIndex: 'realName',
      align: 'center',
      copyable: true,
    },
    {
      title: '金额',
      dataIndex: 'amount',
      align: 'center',
      copyable: true,
      hideInSearch: true
    },
    {
      title: '用途',
      dataIndex: 'moneyUsage',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '附言',
      dataIndex: 'postscript',
      align: 'center',
      copyable: true,
      hideInSearch: true
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      valueType: 'dateTimeRange',
      hideInTable: true
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      hideInSearch: true,
      render: (text, record: LoanAPI.SalaryItem) => record.createTime ? dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'
    },
    {
      title: '是否发布',
      dataIndex: 'isRecharge',
      align: 'center',
      valueType: 'select',
      fieldProps: {
        options: [
          { label: '未发布', value: false },
          { label: '已发布', value: true },
        ]
      },
      render: (text, record: LoanAPI.SalaryItem) => {
        return record.isRecharge ? '已发布' : '未发布';
      }
    },
  ];

  // 查询列表
  const getTableData = async (
    params: ParamsType & {
      pageSize?: number | undefined;
      current?: number | undefined;
    } = {},
  ) => {

    const { createTime } = params;
    const par: any = {};
    if (createTime) {
      par.startTime = dayjs(createTime[0]).unix();
      par.endTime = dayjs(createTime[1]).unix();
    }

    const { code, data } = await getSalaryList(
      {
        ...params,
        ...par,
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
      <ProTable<LoanAPI.SalaryItem>
        actionRef={actionRef}
        columns={columns}
        rowKey="idNumber"
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
          // canEditAllMoneyModule && <Button type='primary' onClick={publishAll} key="publish" style={{ marginRight: '20px' }}>一键发布</Button>,
          canEditAllMoneyModule && <Button type='primary' onClick={() => setUploadVis(true)} key="upload">导入数据</Button>,
        ]}
      />

      <UploadCom visible={uploadVis} onCancel={() => setUploadVis(false)} />
    </div>
  );
};

export default Salary;
