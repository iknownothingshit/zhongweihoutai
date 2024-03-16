import React, { useState } from 'react';
import { Modal } from 'antd';

// 查看完整文字内容
const TextDetail: React.FC<{ text: string; title?: string }> = ({ text, title }) => {
  const [content, setContent] = useState(''); // 内容详情
  const [contentVisible, setContentVisible] = useState(false);

  const showContent = (text: string) => {
    setContent(text);
    setContentVisible(true);
  };

  return (
    <>
      <a onClick={() => showContent(text)}>
        <div className="mutiple-text" style={{ whiteSpace: 'pre-wrap' }}>
          {text}
        </div>
      </a>

      <Modal
        title={title || "详情"}
        open={contentVisible}
        onCancel={() => setContentVisible(false)}
        footer={null}
        destroyOnClose
        bodyStyle={{ whiteSpace: 'pre-wrap' }}
      >
        {content}
      </Modal>
    </>
  );
};

export default TextDetail;