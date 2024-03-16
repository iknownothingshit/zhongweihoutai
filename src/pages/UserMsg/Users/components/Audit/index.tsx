import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Image, Modal, Space, App, Popconfirm, Tooltip, message } from 'antd';
import { useState } from 'react';
import { passOrRejectCertificate } from '@/api/users';

type Props = {
    visible: boolean;
    data: UsersAPI.Certificates[];
    canEdit: boolean;
    onCancel: (needReload?: boolean) => void;
}

// 证书审核
const Audit: React.FC<Props> = ({
    visible,
    data,
    canEdit,
    onCancel
}) => {

    const { message } = App.useApp();

    const [loading, setLoading] = useState(false);

    const handleAudit = async (id: number, type: string) => {
        if (loading) return;

        message.loading({ content: '执行中...', duration: 0, key: 'auditCetificate' });
        setLoading(true);

        const { code } = await passOrRejectCertificate(id + '', type);
        setLoading(false);
        message.destroy('auditCetificate');

        if (code !== 200) return;

        onCancel(true);
    }

    return <Modal
        title='证书审核'
        open={visible}
        footer={null}
        onCancel={() => onCancel()}
    >
        <Space direction='vertical'>
            {
                data?.map(c => {
                    return <Space key={c.id}>
                        {c.name}
                        <Image src={c.imgUrl} />

                        {c.auditStatus === 1 && '已驳回'}
                        {c.auditStatus === 2 && '已通过'}

                        {
                            canEdit && c.auditStatus === 0 && < Space >
                                <a>
                                    <Popconfirm title="确认通过吗？" onConfirm={() => handleAudit(c.id, 'pass')}>
                                        <Tooltip title="通过">
                                            <CheckOutlined />
                                        </Tooltip>
                                    </Popconfirm>
                                </a>

                                <a key="refuse">
                                    <Popconfirm title="确认拒绝吗？" onConfirm={() => handleAudit(c.id, 'reject')}>
                                        <Tooltip title="拒绝">
                                            <CloseOutlined />
                                        </Tooltip>
                                    </Popconfirm>
                                </a>
                            </Space>
                        }
                    </Space>
                })
            }
        </Space>

    </Modal >
}

export default Audit;