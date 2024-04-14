import { App, Modal } from 'antd';
import React, { useMemo, useState } from 'react';
import { Form, FormItem, Input } from '@formily/antd-v5';
import { createForm } from '@formily/core';
import type { ISchema } from '@formily/react';
import { createSchemaField } from '@formily/react';
import FactorySelector from '@/components/FactorySelcetor';
import { createConfig } from '@/api/borrow';

type Props = {
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
};

const iSchema: ISchema = {
  type: 'object',
  properties: {
    factory: {
      title: '关联工厂',
      type: 'object',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'FactorySelector',
    },
    entryDayLimit: {
      title: '入职多少天可发起借资',
      type: 'string',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      "x-component-props": {
        suffix: '天'
      }
    },
    loanAmountMonthLimit: {
      title: '每月最多可借多少钱',
      type: 'string',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      "x-component-props": {
        suffix: '元'
      }
    },
    loanIntervalDayLimit: {
      title: '每隔多少天可发起借资',
      type: 'string',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      "x-component-props": {
        suffix: '天'
      }
    },
  },
};

// 创建规则
const Edit: React.FC<Props> = ({ visible, onCancel, onOk }) => {
  const [loading, setLoading] = useState(false);
  const form = createForm();

  const { message } = App.useApp();

  const SchemaFiled = useMemo(
    () =>
      createSchemaField({
        components: {
          Input,
          FormItem,
          FactorySelector,
        },
      }),
    [],
  );

  // 提交表单
  const handleOk = () => {
    const val = form.values;
    form
      .validate()
      .then(async () => {
        const { id, name } = val.factory;
        const { entryDayLimit, loanAmountMonthLimit, loanIntervalDayLimit } = val;

        setLoading(true);
        const { code } = await createConfig({
          factoryId: id,
          factoryName: name,
          entryDayLimit,
          loanAmountMonthLimit,
          loanIntervalDayLimit
        });
        setLoading(false);

        if (code !== 200) {
          message.error('创建失败，请重试');
          return;
        }

        message.success('创建成功');
        onOk();
      })
      .catch();
  };

  return (
    <Modal open={visible} onCancel={onCancel} title="创建" onOk={handleOk} confirmLoading={loading}>
      <Form form={form} labelCol={10}>
        <SchemaFiled schema={iSchema} />
      </Form>
    </Modal>
  );
};

export default Edit;
