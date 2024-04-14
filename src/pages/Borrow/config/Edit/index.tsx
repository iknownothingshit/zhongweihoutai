import { App, Modal, Space, Button } from 'antd';
import React, { useMemo, useEffect, useState } from 'react';
import { Form, FormItem, Input, } from '@formily/antd-v5';
import { createForm } from '@formily/core';
import type { ISchema } from '@formily/react';
import { createSchemaField } from '@formily/react';
import { deleteConfig } from '@/api/borrow';

type Props = {
    visible: boolean;
    onCancel: () => void;
    onOk: (data: LoanAPI.ConfigItem) => void;
    data: LoanAPI.ConfigItem | null;
    loading: boolean;
    afterEdit: () => void;
};

const Edit: React.FC<Props> = ({
    data,
    visible,
    onCancel,
    onOk,
    loading,
    afterEdit
}) => {

    const iSchema: ISchema = {
        type: 'object',
        properties: {
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
        }
    }

    const form = useMemo(() => createForm(), [data]);

    const { message, modal: { confirm } } = App.useApp();

    const SchemaFiled = useMemo(
        () =>
            createSchemaField({
                components: {
                    Input,
                    FormItem,
                },
            }),
        [],
    );

    // 删除配置
    const handleDelete = async () => {
        if (!data) return;
        confirm({
            title: '确认删除此配置吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
                const { id } = data;
                const { code, message: msg } = await deleteConfig(id);
                if (code !== 200) {
                    message.error(msg || '删除失败');
                    return;
                }
                message.success('成功');
                afterEdit();
            }
        })
    }

    // 提交修改
    const handleSave = () => {
        if (!data) return;
        const vals = form.values;
        onOk({ ...data, ...vals });
    }

    // 初始化表单
    useEffect(() => {
        if (data) {
            form.setInitialValues(data);
        }
    }, [data]);

    return <Modal
        open={visible}
        onCancel={onCancel}
        title="编辑"
        confirmLoading={loading}
        footer={<Space style={{ paddingTop: '10px' }}>
            <Button type='primary' loading={loading} style={{ marginRight: '10px' }} onClick={handleSave}>修改并保存</Button>
            <Button loading={loading} onClick={handleDelete}>删除</Button>
        </Space>}
    >

        <Form form={form} labelCol={10}>
            <SchemaFiled schema={iSchema} />
        </Form>
    </Modal>
}

export default Edit;