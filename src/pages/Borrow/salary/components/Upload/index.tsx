import { Modal, Space, Upload, App } from 'antd';
import db from '@/utils/db';
import type { UploadChangeParam } from 'antd/es/upload';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useState } from 'react';
import styles from './index.module.less';
import { UploadOutlined } from '@ant-design/icons';

type Props = {
    visible: boolean;
    onCancel: () => void;
}

// 上传、下载
const UploadCom: React.FC<Props> = ({
    visible,
    onCancel
}) => {

    const { message } = App.useApp();
    const [loading, setLoading] = useState(false);

    const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
        setLoading(false);
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }

        if (info.file.status === 'done') {
            const { code, data, message } = info.file.response;
            setLoading(false);
            if (code !== 200) {
                message.error(message || '上传失败，请重试');
                return;
            }

            message.success('上传成功');
        }
    };

    return <Modal
        open={visible}
        title="导入数据"
        onCancel={onCancel}
        footer={null}
    >
        <Space direction='vertical' align='center' style={{ width: '100%' }}>
            <Upload
                name="file"
                headers={{
                    Authorization: 'Bearer ' + db.get('ACCESS_TOKEN') as string,
                    'platform': 'admin',
                }}
                showUploadList={false}
                action={'https://enzezhonghr.com/api/' + 'oss/upload'}
                onChange={handleChange}
                disabled={loading}
            >
                <div className={styles.uploadDiv}>
                    <UploadOutlined />
                    点击上传模板
                    <p>支持csv、xls、xlsx</p>
                </div>
            </Upload>

            <a href="">
                点击下载模板
            </a>
        </Space>
    </Modal>

}

export default UploadCom;