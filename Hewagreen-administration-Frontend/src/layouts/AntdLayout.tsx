import React from "react";
import { ConfigProvider } from "antd";

interface AntdLayoutProps {
  children: React.ReactNode; // Déclaration explicite que les enfants peuvent être de n'importe quel noeud React valide
}

const AntdLayout: React.FC<AntdLayoutProps> = ({ children }) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#00838F",
          fontFamily: "",
        },
        components: {
          Button: {},
          DatePicker: {},
          Descriptions: {},
          Drawer: {},
          Empty: {},
          Form: {},
          Input: {},
          InputNumber: {},
          List: {},
          Message: {},
          Modal: {},
          Notification: {},
          Popconfirm: {},
          Popover: {},
          Select: {},
          Table: {},
          Tabs: {},
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default AntdLayout;
