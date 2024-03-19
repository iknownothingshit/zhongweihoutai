import { Button, Space, Input, App, Card, Modal } from 'antd';
import { useEffect, useState, } from 'react';
import { doConfig, getConfig } from '@/api/borrow';
import { useAccess } from '@umijs/max';
import styles from './index.module.less';
import { getRoleAccess } from '@/utils/index';

// 借资配置
const Config: React.FC = () => {

  const { message, modal: { confirm } } = App.useApp();

  const [eidtVis, setEidtVis] = useState(false);

  const [entryDayLimit, setEntryDayLimit] = useState(0);
  const [loanAmountMonthLimit, setLoanAmountMonthLimit] = useState(0);
  const [loanIntervalDayLimit, setLoanIntervalDayLimit] = useState(0);
  const [loading, setLoading] = useState(false);

  const [configList, setConfigList] = useState([1, 2, 3, 4, 5]); // 配置列表

  const { canEditAllMoneyModule } = getRoleAccess();

  // 修改配置值
  const handleChange = (key: string, val: number) => {
    switch (key) {
      case '1': setEntryDayLimit(val || 0); break;
      case '2': setLoanAmountMonthLimit(val || 0); break;
      case '3': setLoanIntervalDayLimit(val || 0); break;
    }
  }


  // 保存配置
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

  // 获取列表数据
  const init = async () => {
    const { code, data } = await getConfig();

    if (code !== 200 || !data) return;

    const { entryDayLimit: edl, loanAmountMonthLimit: laml, loanIntervalDayLimit: lidl } = data;
    setEntryDayLimit(edl);
    setLoanAmountMonthLimit(laml);
    setLoanIntervalDayLimit(lidl);

  }

  // 打开编辑
  const openEidt = () => {
    setEidtVis(true);
  }

  // 删除配置
  const handleDelete = async () => {
    confirm({
      title: '确认删除此配置吗？',
      okText: '确认',
      cancelText: '取消'
    })
  }

  useEffect(() => {
    init();
  }, [])

  return (
    <Space direction='vertical'>

      <div className={styles.cards}>
        {
          configList.map(c => {
            return (
              <Card
                title="工厂名字"
                bordered={false}
                hoverable
                className={styles.cardItem}
                extra={canEditAllMoneyModule && <Button type='primary' onClick={openEidt}>编辑</Button>}>
                <p>入职{entryDayLimit}天可发起借资</p>
                <p>每隔{loanAmountMonthLimit}天可发起审批</p>
                <p>每月可借金额上限{loanIntervalDayLimit}</p>
              </Card>
            )
          })
        }
      </div>

      <Modal
        open={eidtVis}
        onCancel={() => setEidtVis(false)}
        title="编辑"
        confirmLoading={loading}
        footer={<Space style={{ paddingTop: '10px' }}>
          <Button type='primary' loading={loading} style={{ marginRight: '10px' }} onClick={save}>修改并保存</Button>
          <Button loading={loading} onClick={handleDelete}>删除</Button>
        </Space>}
      >
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
        </Space>
      </Modal>

    </Space>
  )

}


export default Config;