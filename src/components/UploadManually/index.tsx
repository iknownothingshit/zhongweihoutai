import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';

type UploadManuallyProps = {
  value?: UploadFile[];
  onChange: (val: UploadFile[]) => void;
  maxCount?: number;
  componentProps?: UploadProps;
};

// 柱子哥写的上传组件
const UploadManually: React.FC<UploadManuallyProps> = (props) => {
  const { onChange, maxCount, componentProps } = props;
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const uploadProps: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      onChange(newFileList);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      let fileArr = [...fileList, file];
      if (maxCount) {
        fileArr = fileArr.slice(-maxCount);
      }
      onChange(fileArr);
      setFileList(fileArr);
      return false;
    },
    fileList,
    ...componentProps,
  };

  return (
    <>
      <Upload {...uploadProps}>
        <Button icon={<UploadOutlined />}>选择文件</Button>
      </Upload>
    </>
  );
};

export default UploadManually;
