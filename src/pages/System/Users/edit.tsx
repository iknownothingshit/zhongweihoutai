import { addUser } from '@/api/system';
import { Form, FormItem, Input, Select } from '@formily/antd-v5';
import { createForm } from '@formily/core';
import type { ISchema } from '@formily/json-schema';
import { createSchemaField } from '@formily/react';
import { Modal } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { roleMap } from '.';

type Props = {
  visible: boolean;
  data: SystemAPI.UserItem | null;
  onSubmit: (data: SystemAPI.UserItem) => void;
  onCancel: () => void;
  loading: boolean;
};

const Edit: React.FC<Props> = ({ visible, data, onCancel, loading, onSubmit }) => {

  useEffect(() => {
  }, []);

  const schema: ISchema = useMemo(
    () => ({
      type: 'object',
      properties: {
        phone: {
          type: 'string',
          title: '手机号',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
        name: {
          type: 'string',
          title: '用户名',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
        password: {
          type: 'string',
          title: '密码',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
        inviteCode: {
          type: 'string',
          title: '邀请码',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          "x-component-props": {
            disabled: !!data?.inviteCode
          }
        },
        role: {
          type: 'array',
          title: '角色',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          "x-component-props": {
            options: roleMap
          }
        },
      },
    }),
    [data],
  );

  const SchemaField = useMemo(() => {
    return createSchemaField({
      components: {
        FormItem,
        Input,
        Select,
      },
    });
  }, []);

  const form = useMemo(
    () =>
      createForm({
        validateFirst: true,
      }),
    [data],
  );

  // 处理数据格式
  const formatData = (dataValue: SystemAPI.UserItem) => {
    const d: any = { ...dataValue };

    form.setInitialValues(d);
  };

  useEffect(() => {
    if (data) {
      formatData(data);
    }
  }, [data]);

  const handleOk = () => {
    const vals = form.values;

    form.validate().then(() => {
      onSubmit(vals);
    });
  };

  return (
    <Modal
      title="编辑"
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      width={700}
      confirmLoading={loading}
    >
      <Form form={form} labelCol={6}>
        <SchemaField schema={schema} />
      </Form>
    </Modal>
  );
};

export default Edit;
