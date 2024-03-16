import { App, Modal } from 'antd';
import React, { useMemo, useEffect, useState } from 'react';
import { Form, FormItem, Input, Cascader, Select } from '@formily/antd-v5';
import { createForm } from '@formily/core';
import type { ISchema } from '@formily/react';
import { createSchemaField } from '@formily/react';
import { editFactory } from '@/api/factory';
import { cityArray } from '@/utils/city';

type Props = {
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
  data: FactoryAPI.Factory | null;
  type: string;
};

const iSchema: ISchema = {
  type: 'object',
  properties: {
    name: {
      title: '工厂名',
      type: 'string',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    area: {
      title: '地区',
      type: 'array',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Cascader',
      'x-component-props': {
        options: cityArray,
      }
    },
  },
};

const Edit: React.FC<Props> = ({ visible, onCancel, data, onOk, type }) => {
  const [loading, setLoading] = useState(false);
  const form = useMemo(() => createForm(), [data]);

  const { message } = App.useApp();

  const SchemaFiled = useMemo(
    () =>
      createSchemaField({
        components: {
          Input,
          FormItem,
          Cascader,
          Select
        },
      }),
    [],
  );

  // 初始化表单
  useEffect(() => {
    if (data) {
      const values: any = { ...data };
      values.area = [values.province, values.city, values.region];
      form.setInitialValues(values);
    }
  }, [data]);

  // 提交表单
  const handleOk = () => {
    const val = form.values;
    form
      .validate()
      .then(async () => {
        const [province, city, region] = val.area;
        val.province = province;
        val.city = city;
        val.region = region;

        setLoading(true);
        const { code } = await editFactory(val);
        setLoading(false);

        if (code !== 200) return;

        message.success('编辑成功');
        onOk();
      })
      .catch();
  };

  return (
    <Modal open={visible} onCancel={onCancel} title="编辑" onOk={handleOk} confirmLoading={loading}>
      <Form form={form} labelCol={6}>
        <SchemaFiled schema={iSchema} />
      </Form>
    </Modal>
  );
};

export default Edit;
