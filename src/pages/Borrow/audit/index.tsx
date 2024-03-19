import type { ActionType, ParamsType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Select, App, Popconfirm, Tooltip } from 'antd';
import { useRef, useState, useMemo } from 'react';
import { getLoanList, doAudit } from '@/api/borrow';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useAccess } from '@umijs/max';
import dayjs from 'dayjs';
import { getRoleAccess } from '@/utils/index';

const statusMap = [
  { label: '已初审', value: 'FIRST_PASSED' },
  { label: '已拒绝', value: 'REJECTED' },
  { label: '已复审', value: 'SECOND_PASSED' },
  { label: '待审核', value: 'TO_BE_AUDIT' },
  // { label: '已打款', value: 'PAID' }
]

// 借资审核
const Audit: React.FC = () => {
  const access = useAccess();
  const actionRef = useRef<ActionType>();

  const { modal: { confirm }, message } = App.useApp();

  const [loading, setLoading] = useState(false);

  const { canEditAllMoneyModule } = getRoleAccess();

  // 审核
  const handleAudit = async (userLoanRecordId: number, userLoanRecordStatusEnum: string) => {
    if (loading) return;

    confirm({
      title: '确认执行吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        setLoading(true);
        const { code } = await doAudit({
          userLoanRecordId,
          userLoanRecordStatusEnum
        });
        setLoading(false);
        if (code !== 200) return;

        message.success('审核成功');
        actionRef.current?.reload();
      }
    })

  };

  const columns: ProColumns<LoanAPI.LoanItem>[] = [
    {
      title: '用户id',
      dataIndex: 'userId',
      align: 'center',
      copyable: true
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      align: 'center',
      copyable: true,
    },
    {
      title: '银行卡号',
      dataIndex: 'bankNumber',
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
      title: '工厂名',
      dataIndex: 'factoryName',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '地区',
      dataIndex: 'area',
      align: 'center',
      hideInSearch: true,
      render: (text, record: LoanAPI.LoanItem) => (
        <span>{record.province + record.city + record.region}</span>)
    },
    {
      title: '岗位',
      dataIndex: 'postName',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '借资金额',
      dataIndex: 'loanAmount',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '初审借资金额',
      dataIndex: 'modifyLoanAmount',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '初审时间',
      dataIndex: 'firstAuditTime',
      align: 'center',
      hideInSearch: true,
      render: (text, record: LoanAPI.LoanItem) => record.firstAuditTime ? dayjs(record.firstAuditTime).format('YYYY-MM-DD HH:mm:ss') : '-'
    },
    {
      title: '复审时间',
      dataIndex: 'secondAuditTime',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '审核状态',
      dataIndex: 'status',
      align: 'center',
      valueType: 'select',
      fieldProps: {
        options: statusMap
      },
      render: (text, record: LoanAPI.LoanItem) => {
        return statusMap[statusMap.findIndex(item => item.value === record.status)].label
      }
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      align: 'center',
      render: (text, record: LoanAPI.LoanItem) => {

        if (!canEditAllMoneyModule) return;

        if (record.status === 'REJECTED') return;
        let ops: any = [];

        switch (record.status) {
          case 'TO_BE_AUDIT': ops = [
            { label: '已初审', value: 'FIRST_PASSED' },
            { label: '已拒绝', value: 'REJECTED' },
          ]; break;
          case 'FIRST_PASSED': ops = [
            { label: '已复审', value: 'SECOND_PASSED' },
            { label: '已拒绝', value: 'REJECTED' },
          ]; break;
          case 'SECOND_PASSED': ops = [
            { label: '已打款', value: 'PAID' },
          ]; break;
        }

        return <Select
          placeholder="请选择状态"
          options={ops}
          onChange={(val: string) => handleAudit(record.userLoanRecordId, val)}
        />
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
        toolBarRender={false}
      />
    </div>
  );
};

export default Audit;
