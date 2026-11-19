import { baseURL } from '@/controller/api/config/baseUrl';
import { Modal } from 'antd';
import { useEffect, useRef } from 'react';

const FileModal = ({ isModalOpen, handleOk, handleCancel, file , title}: any) => {

  const iframeRef = useRef<HTMLIFrameElement>(null);
console.log(`${baseURL}/${file}`)
  useEffect(() => {
    if (iframeRef.current && typeof iframeRef.current.src === 'string') {
      iframeRef.current.src = `${baseURL}/${file}`;
    }
  }, [file]);

  return (
    <Modal
      title={title}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
      width={1000}
    >
      <div className="iq-card-body m-10">
        <embed src={`${baseURL}/${file}`} type="application/pdf" width="100%" height="900px" />

        {/* <iframe
          ref={iframeRef}
          width={700}
          // height={height}
          style={{ padding: 10 }}
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        /> */}
      </div>
    </Modal>
  );
};

export default FileModal;

