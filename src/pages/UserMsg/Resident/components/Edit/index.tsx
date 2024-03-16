import { App, Modal } from 'antd';
import React, { useMemo, useEffect, useState } from 'react';
import { Form, FormItem, Input } from '@formily/antd-v5';
import { createForm } from '@formily/core';
import type { ISchema } from '@formily/react';
import { createSchemaField } from '@formily/react';
import { edit } from '@/api/resident';
import FactorySelector from '@/components/FactorySelcetor';
import UserSelector from '@/components/UserSelcetor';


type Props = {
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
  data: ResidentAPI.Resident | null;
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
    user: {
      title: '关联用户',
      type: 'object',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'UserSelector',
    },
  },
};

const Edit: React.FC<Props> = ({ visible, onCancel, data, onOk }) => {
  const [loading, setLoading] = useState(false);
  const form = useMemo(() => createForm(), [data]);

  const { message } = App.useApp();

  const SchemaFiled = useMemo(
    () =>
      createSchemaField({
        components: {
          Input,
          FormItem,
          FactorySelector,
          UserSelector
        },
      }),
    [],
  );

  // 初始化表单
  useEffect(() => {
    if (data) {
      const values: any = { ...data };
      values.factory = { id: data.factoryId, name: data.factoryName };
      form.setInitialValues(values);
    }
  }, [data]);

  // 提交表单
  const handleOk = () => {
    const val = form.values;
    form
      .validate()
      .then(async () => {
        const { id } = val.factory;
        const { id: userId } = val.user;

        setLoading(true);
        const { code } = await edit({
          factoryId: id,
          adminUserId: userId
        });
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
