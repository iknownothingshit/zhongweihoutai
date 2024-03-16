import { App, Modal } from 'antd';
import React, { useMemo, useEffect, useState } from 'react';
import { Form, FormItem, Input, Cascader, Select } from '@formily/antd-v5';
import { createForm } from '@formily/core';
import type { ISchema } from '@formily/react';
import { createSchemaField } from '@formily/react';
import { editJob } from '@/api/factory';
import { cityArray } from '@/utils/city';
import FactorySelector from '@/components/FactorySelcetor';
import TagSelector from '@/components/TagSelector';
import UploadAvatar from '@/components/UploadAvatar';

type Props = {
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
  data: FactoryAPI.Job | null;
};

const iSchema: ISchema = {
  type: 'object',
  properties: {
    postName: {
      title: '岗位名',
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
    accommodation: {
      title: '食宿介绍',
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
    coverPic: {
      title: '封面照片',
      type: 'string',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'UploadAvatar',
      "x-component-props": {
        maxNum: 3
      }
    },
    entryProcessPicArr: {
      title: '入职流程指南',
      type: 'string',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'UploadAvatar',
      "x-component-props": {
        maxNum: 1
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
    salaryIntroduction: {
      title: '薪资介绍',
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
    salary: {
      title: '薪资',
      type: 'number',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      "x-component-props": {
        suffix: '元',
        type: 'number'
      }
    },
    postNumber: {
      title: '报名人数',
      type: 'number',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      "x-component-props": {
        type: 'number'
      }
    },
    timeUnit: {
      title: '工作时间单位',
      type: 'string',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      "x-component-props": {
        placeholder: '例如：小时、天'
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
      values.entryProcessPicArr = data.entryProcessPic ? [data.entryProcessPic] : [];
      values.coverPic = Array.isArray(data.coverPic) ? data.coverPic : [];
      form.setInitialValues(values);
    }
  }, [data]);

  // 提交表单
  const handleOk = () => {
    const val = form.values;
    form
      .validate()
      .then(async () => {
        const { id, name } = val.factory;
        val.factoryId = id;
        val.factoryName = name;
        val.entryProcessPic = val.entryProcessPicArr[0];
        delete val.factory;
        delete val.entryProcessPicArr;

        setLoading(true);
        const { code } = await editJob({
          ...val,
          name: val.postName
        });
        setLoading(false);

        if (code !== 200) return;

        message.success('编辑成功');
        onOk();
      })
      .catch();
  };

  return (
    <Modal open={visible} onCancel={onCancel} title="编辑" onOk={handleOk} confirmLoading={loading} destroyOnClose>
      <Form form={form} labelCol={6}>
        <SchemaFiled schema={iSchema} />
      </Form>
    </Modal>
  );
};

export default Edit;
