import { Form, FormItem, Input, NumberPicker } from '@formily/antd-v5';
import { createForm } from '@formily/core';
import type { ISchema } from '@formily/json-schema';
import { createSchemaField } from '@formily/react';
import { App, Modal } from 'antd';
import { useEffect, useMemo } from 'react';

type Props = {
  visible: boolean;
  data: Partial<SystemAPI.MenuItem> | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isAdding: boolean;
};

const Detail: React.FC<Props> = ({ visible, data, onSubmit, onCancel, isAdding }) => {
  const { message } = App.useApp();

  const SchemaField = useMemo(() => {
    return createSchemaField({
      components: {
        FormItem,
        Input,
        NumberPicker,
      },
    });
  }, []);

  const schema: ISchema = {
    type: 'object',
    properties: {
      parentId: {
        type: 'string',
        title: '父级权限Id',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          disabled: true,
        },
        'x-hidden': !data?.parentId,
      },
      label: {
        type: 'string',
        title: '名称',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          maxLength: 10,
          showCount: true,
        },
      },
      perms: {
        type: 'string',
        title: '权限code',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': {
          disabled: !isAdding,
        },
      },
    },
  };

  const form = useMemo(
    () =>
      createForm({
        validateFirst: true,
      }),
    [data],
  );

  useEffect(() => {
    if (data) {
      form.setInitialValues(data);
    }
  }, [data]);

  const handleOk = () => {
    const { label, parentId, perms, id } = form.values;

    const vals: any = { menuName: label, parentId, perms, type: 1 };
    if (id) vals.menuId = id;

    form
      .validate()
      .then(() => {
        onSubmit(vals);
      })
      .catch(() => {
        message.warning('请完成表单');
      });
  };

  return (
    <Modal title={isAdding ? '新增' : '编辑'} open={visible} onCancel={onCancel} onOk={handleOk}>
      <Form form={form} layout="horizontal" size="large" labelCol={6} wrapperCol={18}>
        <SchemaField schema={schema} />
      </Form>
    </Modal>
  );
};

export default Detail;
