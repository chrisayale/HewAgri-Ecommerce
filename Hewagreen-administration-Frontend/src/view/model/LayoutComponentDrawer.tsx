import { Drawer } from 'antd';
import React from 'react';

interface LayoutComponentDrawerProps {
  form: any;
  btn: any;
  onClose: any;
  open: any;
  title: string;
}

const LayoutComponentDrawer: React.FC<LayoutComponentDrawerProps> = ({
  form,
  btn,
  onClose,
  open,
  title,
}) => {
  return (
    <Drawer
      title={title}
      width={720}
      onClose={onClose}
      open={open}
      styles={{
        body: {
          paddingBottom: 80,
        },
      }}
      extra={btn}
    >
      {form}
    </Drawer>
  );
};

export default LayoutComponentDrawer;