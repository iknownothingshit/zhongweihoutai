import { Button, Space, Input, App, Card } from 'antd';
import { useEffect, useState, } from 'react';
import { doConfig, getConfig } from '@/api/borrow';
import { useAccess } from '@umijs/max';

// 借资配置
const Config: React.FC = () => {

  const { message } = App.useApp();

  const [entryDayLimit, setEntryDayLimit] = useState(0);
  const [loanAmountMonthLimit, setLoanAmountMonthLimit] = useState(0);
  const [loanIntervalDayLimit, setLoanIntervalDayLimit] = useState(0);
  const [loading, setLoading] = useState(false)

  const handleChange = (key: string, val: number) => {
    switch (key) {
      case '1': setEntryDayLimit(val || 0); break;
      case '2': setLoanAmountMonthLimit(val || 0); break;
      case '3': setLoanIntervalDayLimit(val || 0); break;
    }
  }

  const save = async () => {
    if (loading) return;
    setLoading(true);
    const { code } = await doConfig({
      entryDayLimit,
      loanAmountMonthLimit,
      loanIntervalDayLimit
    })
    setLoading(false);

    if (code !== 200) {
      message.error('出错啦');
      return;
    }

    message.success('修改成功')
  }

  const init = async () => {
    const { code, data } = await getConfig();

    if (code !== 200 || !data) return;

    const { entryDayLimit: edl, loanAmountMonthLimit: laml, loanIntervalDayLimit: lidl } = data;
    setEntryDayLimit(edl);
    setLoanAmountMonthLimit(laml);
    setLoanIntervalDayLimit(lidl);

  }

  useEffect(() => {
    init();
  }, [])

  return (
    <Card title="借资配置">

      <Space wrap direction='vertical'>
        <Space>
          入职
          <Input placeholder='输入天数' type='number' suffix='天' value={entryDayLimit} onChange={e => handleChange('1', +e.target.value)} />
          可发起借资
        </Space>

        <Space>
          每隔
          <Input placeholder='输入天数' type='number' suffix='天' value={loanAmountMonthLimit} onChange={e => handleChange('2', +e.target.value)} />
          可发起审批
        </Space>

        <Space>
          每月可借金额上限
          <Input placeholder='输入金额' type='number' value={loanIntervalDayLimit} onChange={e => handleChange('3', +e.target.value)} />
        </Space>

        <Button type='primary' loading={loading} style={{ marginTop: '30px' }} onClick={save}>修改并保存</Button>
      </Space>

    </Card>
  )

}


export default Config;