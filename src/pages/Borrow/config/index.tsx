import { Button, Space, App, Card, Input } from 'antd';
import { useEffect, useState, } from 'react';
import { doConfig, getConfig, createConfig } from '@/api/borrow';
import { useAccess } from '@umijs/max';
import styles from './index.module.less';
import { getRoleAccess } from '@/utils/index';
import Edit from './Edit';
import Create from './Create';

// 借资配置
const Config: React.FC = () => {

  const { message } = App.useApp();

  const [createVis, setCreateVis] = useState(false);
  const [eidtVis, setEidtVis] = useState(false);
  const [loading, setLoading] = useState(false);
  const [curConfig, setCurConfig] = useState<LoanAPI.ConfigItem | null>(null);
  const [configList, setConfigList] = useState<LoanAPI.ConfigItem[]>([]); // 配置列表

  const [factoryName, setFactoryName] = useState('');
  const [factoryId, setFactoryId] = useState('');

  const { canEditAllMoneyModule } = getRoleAccess();


  // 保存配置
  const save = async (data: LoanAPI.ConfigItem) => {
    if (loading) return;
    setLoading(true);
    const { code } = await doConfig(data)
    setLoading(false);

    if (code !== 200) {
      message.error('出错啦');
      return;
    }

    message.success('修改成功');
    afterEdit();
  }

  // 编辑完成后刷新
  const afterEdit = () => {
    init();
    setCreateVis(false);
    setEidtVis(false);
    setCurConfig(null);
  }

  // 获取列表数据
  const init = async (fName?: string, fId?: string) => {
    const parms: any = {};
    if (fName) parms.factoryName = fName;
    if (fId) parms.factoryId = fId;

    const { code, data } = await getConfig(parms);

    if (code !== 200 || !data) return;

    const { records } = data;
    setConfigList(records);
  }

  // 打开编辑
  const openEidt = (config: LoanAPI.ConfigItem) => {
    setCurConfig(config);
    setEidtVis(true);
  }

  // 查询
  const search = () => {
    init(factoryName, factoryId);
  }

  // 重置
  const reset = () => {
    setFactoryId('');
    setFactoryName('');
    init();
  }

  useEffect(() => {
    init();
  }, [])

  return (
    <Space direction='vertical'>

      <Space style={{ marginBottom: '30px', }}>
        <Input placeholder='输入工厂名..' value={factoryName} onChange={(e) => setFactoryName(e.target.value)} />
        <Input placeholder='输入工厂Id..' value={factoryId} onChange={(e) => setFactoryId(e.target.value)} />

        <Space>
          <Button type='primary' onClick={search}>查询</Button>
          <Button type='default' onClick={reset}>重置</Button>
          <Button type='primary' onClick={() => setCreateVis(true)}>创建规则</Button>
        </Space>

      </Space>

      <div className={styles.cards}>
        {
          configList.map(c => {
            return (
              <Card
                key={c.id}
                title={c.factoryName}
                bordered={false}
                hoverable
                className={styles.cardItem}
                extra={canEditAllMoneyModule && <Button type='primary' onClick={() => openEidt(c)}>编辑</Button>}>
                <p>入职 {c.entryDayLimit} 天可发起借资</p>
                <p>每隔 {c.loanIntervalDayLimit} 天可发起审批</p>
                <p>每月可借金额上限 {c.loanAmountMonthLimit} </p>
              </Card>
            )
          })
        }
      </div>

      <Edit visible={eidtVis} data={curConfig} onCancel={() => {
        setEidtVis(false);
        setCurConfig(null);
      }} onOk={save} loading={loading} afterEdit={afterEdit} />

      <Create visible={createVis} onCancel={() => setCreateVis(false)} onOk={afterEdit} />

    </Space>
  )

}


export default Config;