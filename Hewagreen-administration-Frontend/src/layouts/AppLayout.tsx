import React, { useEffect, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  HomeOutlined,
  UsergroupAddOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  ScheduleOutlined,
  CreditCardOutlined,
  DoubleLeftOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Layout, Menu, Popconfirm, PopconfirmProps, theme } from "antd";
import AntdLayout from "./AntdLayout";
import Link from "next/link";
import useAuth from "@/controller/hooks/useAuth";
import { baseURL } from "@/controller/api/config/baseUrl";
import { BiLogOut } from "react-icons/bi";
import { FaAmazonPay } from "react-icons/fa6";
import { usePathname } from "next/navigation";
import Image from "next/image";
import logo from "../components/images/HewAgrii.png"
import { LiaHandsSolid } from "react-icons/lia";
import { menuAdmin, menuBank } from "./MenuItems";

const { Header, Sider, Content } = Layout;


export interface IRoleObject {
  id: number
  role: string
  __tbl_ecom_hasroles: TblEcomHasroles
}

export interface TblEcomHasroles {
  id: number
  TblEcomUserId: number
  TblEcomRoleId: number
  createdAt: string
  updatedAt: string
}



const AppLayout = ({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) => {
  const [menuItems, setMenu] = useState<any>(null);
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const router = usePathname();

  // Déterminez la clé basée sur le chemin de la route actuelle
  const [selectedKey, setSelectedKey] = useState("");

  useEffect(() => {
    setSelectedKey(router);
  }, [router]);

  useEffect(() => {
    redirectUser();
  }, [menuItems]);
  // Le reste de votre composant...

 
  const handleMenuClick = (e: any) => {
    setSelectedKey(e.key);
  };

  const redirectUser = () => {
    const xxxRole = localStorage.getItem("xxx");
    if (xxxRole && xxxRole === 'yes') {
      setMenu(menuBank);
    } else {
      setMenu(menuAdmin);
    }
  }

  const { nameUser, avatarUser, destroySession } = useAuth();
  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user-session");
    destroySession();
    window.location.href = "/";
  };

  const confirm: PopconfirmProps["onConfirm"] = (e) => {
    logout();
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile">
        <Link href="/profil" className="flex items-center gap-2">
          <UserOutlined /> Profil
        </Link>
      </Menu.Item>
      <Menu.Item key="logout">
        <Popconfirm
          title="Déconnexion"
          description="Voulez-vous vraiment vous déconnecter"
          onConfirm={confirm}
          okText="Déconnexion"
          cancelText="Non"
        >
          <p className="flex items-center text-base gap-2">
            <BiLogOut size={20} /> Déconnexion
          </p>
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );

  return (
    <AntdLayout>
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          // className=" h-[98vh] relative"
          className=" h-[98vh] overflow-auto"
          style={{ backgroundColor: "white" }}
        >
          <div className="demo-logo-vertical" />
          <div className=" pt-2 pb-2 px-3">
            <Image
              src={logo}
              width={150}
              height={140}
              alt="log"
              style={{ width: 'auto', height: 'auto' }}
            />
            {/* <p className=" text-xl font-bold text-green-700">
              {collapsed ? "" : "HewAgri"}
            </p> */}
          </div>
          <Menu
            // theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
            selectedKeys={[selectedKey]}
            onClick={handleMenuClick}
            items={menuItems}
          />
          {/* <>
            <Popconfirm
              placement="bottom"
              title="Suppression utilisateur"
              description="Voulez-vous vraiment vous deconnectez"
              okText="Deconnexion"
              cancelText="NON"
              onConfirm={logout}
            >
              <div className=" absolute bottom-4 pl-6">
                <p className=" flex items-center text-base gap-2">
                  <BiLogOut size={20} /> Déconnexion
                </p>
              </div>
            </Popconfirm>
          </> */}
        </Sider>
        <Layout>
          <Header
            style={{ background: colorBgContainer }}
            className=" flex justify-between items-center px-0"
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            <div className=" pr-6 flex gap-2 items-center">


              <Dropdown overlay={userMenu} trigger={["click"]}>
                <div className=" flex flex-col gap-0 items-center cursor-pointer">
                  <Avatar
                    style={{ backgroundColor: "#87d068", marginBottom: -0 }}
                    // icon={<UserOutlined />}
                    src={`${baseURL}/${avatarUser}`}
                  />
                  <p className=" text-xs">{nameUser}</p>
                </div>
              </Dropdown>
            </div>
          </Header>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </AntdLayout>
  );
};

export default AppLayout;
