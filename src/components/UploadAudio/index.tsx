import React, { useState } from 'react';
import {
  LoadingOutlined,
  UploadOutlined,
  DeleteOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import { App, Upload, Space, Button, Input } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';

type Props = {
  value: string;
  onChange: Function;
};

// 音频上传
const UploadAudio: React.FC<Props> = ({ value, onChange }) => {
  const [loading, setLoading] = useState(false);
  const [blobUrl, setBlobUrl] = useState('');
  const [showInput, setShowInput] = useState(false);

  const { message } = App.useApp();

  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    setLoading(false);
    if (info.file.status === 'done') {
      const { code, data } = info.file.response;

      if (code !== 200) {
        message.error('上传失败，请重试');
        return;
      }

      let url;
      if (info.file.originFileObj) {
        // 拿到新的资源的url后去更新audio的src时，直接赋值无法生效，解决办法如下：
        // 重新上传后，将图片的File对象转成blob对象再传给audio的src，如果直接将诸如'xxx.mp3'格式的url传给src，会无法生效
        url = URL.createObjectURL(info.file.originFileObj);
        setBlobUrl(url);
      }
      onChange(data);
    }
  };

  const handleInput = (e: any) => {
    onChange(e.target.value);
  };

  return (
    <Space direction="vertical" size={2}>
      {value ? <audio style={{ height: '40px' }} src={blobUrl ? blobUrl : value} controls /> : null}

      {showInput ? (
        <Space>
          <Input
            style={{ width: '400px' }}
            value={value}
            onChange={handleInput}
            placeholder="输入音频链接"
            allowClear
          />
        </Space>
      ) : null}

      <Space>
        <Upload
          name="file"
          accept="audio/*"
          showUploadList={false}
          action={process.env.BASE_API + 'admin/oss/upload/audio'}
          // beforeUpload={beforeUpload}
          onChange={handleChange}
          disabled={loading}
        >
          <Button type="link">
            {loading ? (
              <>
                上传中
                <LoadingOutlined />
              </>
            ) : (
              <>
                上传
                <UploadOutlined />
              </>
            )}
          </Button>
        </Upload>
        <Button type="link" onClick={() => setShowInput(!showInput)}>
          {showInput ? '收起' : '输入链接'}
          <LinkOutlined />
        </Button>
        <Button type="link" onClick={() => onChange('')}>
          删除
          <DeleteOutlined />
        </Button>
      </Space>
    </Space>
  );
};

export default UploadAudio;
