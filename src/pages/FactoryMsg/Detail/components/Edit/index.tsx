import { App, Modal } from 'antd';
import React, { useMemo, useEffect, useState } from 'react';
import { Form, FormItem, Input, Cascader, Select } from '@formily/antd-v5';
import { createForm } from '@formily/core';
import type { ISchema } from '@formily/react';
import { createSchemaField } from '@formily/react';
import { editIntroduction } from '@/api/factory';
import { cityArray } from '@/utils/city';
import FactorySelector from '@/components/FactorySelcetor';
import TagSelector from '@/components/TagSelector';
import UploadAvatar from '@/components/UploadAvatar';

type Props = {
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
  data: FactoryAPI.Introduction | null;
};

const iSchema: ISchema = {
  type: 'object',
  properties: {
    title: {
      title: '标题',
      type: 'string',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    factory: {
      title: '关联工厂',
      type: 'object',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'FactorySelector',
    },
    tag: {
      title: '标签',
      type: 'array',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'TagSelector',
    },
    pic: {
      title: '相关图片',
      type: 'array',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'UploadAvatar',
    },
    canteen: {
      title: '食堂',
      type: 'string',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    content: {
      title: '介绍内容',
      type: 'string',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input.TextArea',
      "x-component-props": {
        autoSize: {
          minRows: 2,
          maxRows: 8
        }
      }
    },
    dormitory: {
      title: '宿舍',
      type: 'string',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    factoryEnvironment: {
      title: '厂区环境',
      type: 'string',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input.TextArea',
      "x-component-props": {
        autoSize: {
          minRows: 2,
          maxRows: 8
        }
      }
    },
    postIntroduction: {
      title: '岗位介绍',
      type: 'string',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input.TextArea',
      "x-component-props": {
        autoSize: {
          minRows: 2,
          maxRows: 8
        }
      }
    },
    recruitmentNotice: {
      title: '招聘须知',
      type: 'string',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input.TextArea',
      "x-component-props": {
        autoSize: {
          minRows: 2,
          maxRows: 8
        }
      }
    },
    welfareBenefits: {
      title: '福利待遇',
      type: 'string',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input.TextArea',
      "x-component-props": {
        autoSize: {
          minRows: 2,
          maxRows: 8
        }
      }
    },
    status: {
      title: '上下架状态',
      type: 'string',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: '请选择发布状态',
        options: [
          { value: 'LISTED', label: '发布' },
          { value: 'REMOVED', label: '下架' },
        ],
      },
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
          Cascader,
          Select,
          FactorySelector,
          TagSelector,
          UploadAvatar
        },
      }),
    [],
  );

  // 初始化表单
  useEffect(() => {
    if (data) {
      const values: any = { ...data };
      values.area = [values.province, values.city, values.region];
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
        val.factoryId = id;

        setLoading(true);
        const { code } = await editIntroduction(val);
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
