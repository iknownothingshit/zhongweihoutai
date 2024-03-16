import React, { useState } from 'react';
import { UploadOutlined, CloseCircleFilled } from '@ant-design/icons';
import { App, Upload, Image, Button, Space } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import db from '../../utils/db';

type Props = {
  value: string[];
  onChange: Function;
  maxNum: number;
};

// 图片上传
const UploadAvatar: React.FC<Props> = ({ value = [], onChange, maxNum = 3 }) => {
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();

  const handleDelete = (src: string) => {
    const arr = value.filter(s => src !== s);
    onChange(arr);
  }

  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    setLoading(false);
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }

    if (info.file.status === 'done') {
      const { code, data } = info.file.response;
      setLoading(false);
      if (code !== 200) {
        message.error('上传失败，请重试');
        return;
      }

      onChange([...value, data]);
    }
  };

  const beforeUpload = (file: RcFile) => {
    // const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    // if (!isJpgOrPng) {
    //   message.error('You can only upload JPG/PNG file!');
    // }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('上传图片不能大于 2MB!');
    }
    // return isJpgOrPng && isLt2M;
    return isLt2M
  };

  return (
    <>
      <Space align="end">
        {!!value && value.map((src, i) => {
          return <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', right: '-5px', top: '-20px', cursor: 'pointer', zIndex: 99 }} onClick={() => handleDelete(src)}>
              <CloseCircleFilled />
            </div>
            <Image src={src} alt="avatar" width={100} height={50} />
          </div>
        })}

        {
          (!value || value.length < maxNum) && <Upload
            name="file"
            headers={{
              Authorization: 'Bearer ' + db.get('ACCESS_TOKEN') as string,
              'platform': 'admin',
            }}
            showUploadList={false}
            action={'https://enzezhonghr.com/api/' + 'oss/upload'}
            beforeUpload={beforeUpload}
            onChange={handleChange}
            disabled={loading}
          >
            <Button type="primary">
              上传
              <UploadOutlined />
            </Button>
          </Upload>
        }
      </Space>
    </>
  );
};

export default UploadAvatar;
