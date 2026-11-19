
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
import { MdAddShoppingCart } from "react-icons/md";
import Link from "next/link";
import { LiaHandsSolid } from "react-icons/lia";
import { FaAmazonPay } from "react-icons/fa6";
import { BsBank2 } from "react-icons/bs";
import { FaListOl } from "react-icons/fa";

export const menuAdmin = [
  {
    key: "/dashboard",
    icon: <HomeOutlined />,
    label: <Link href="/dashboard">Dashboard</Link>,
  },
  {
    key: "/identification",
    icon: <UserOutlined />,
    label: <Link href="/identification">Identification</Link>,
  },
  {
    key: "/cooperative",
    icon: <LiaHandsSolid />,
    label: <Link href="/cooperative">Cooperative</Link>,
  },
  {
    key: "/agriculteurs",
    icon: <UsergroupAddOutlined />,
    label: <Link href="/agriculteurs">Agriculteurs</Link>,
  },
  {
    key: "4-01",
    icon: <UsergroupAddOutlined />,
    label: <Link href="/cartes">Cartes</Link>,
  },
  {
    key: "/cartes",
    icon: <ShoppingCartOutlined />,
    label: <Link href="/produit">Produit</Link>,
  },
  {
    key: "/stock",
    icon: <ShopOutlined />,
    label: <Link href="/stock">Stocks</Link>,
  },
  {
    key: "/commande",
    icon: <ScheduleOutlined />,
    label: <Link href="/commande">Commades</Link>,
  },
  {
    key: "/credit",
    icon: <CreditCardOutlined />,
    label: <Link href="/credit">Crédit</Link>,
  },
  {
    key: "/banques",
    icon: <DoubleLeftOutlined />,
    label: <Link href="/banques">Banques</Link>,
  },
  {
    key: "/payment",
    icon: <FaAmazonPay />,
    label: <Link href="/payment">Paiements</Link>,
  },
  {
    key: "Paramètres",
    icon: <SettingOutlined />,
    label: "Paramètres",
    children: [
      {
        key: "/parameters/category",
        // icon: <DoubleLeftOutlined />,
        label: <Link href="/parameters/category">Catégorie</Link>,
      },

      {
        key: "/parameters/configuration",
        label: (
          <Link href="/parameters/configuration">
            Configuration
          </Link>
        ),
      },
      {
        key: "/parameters/carousel",
        label: (
          <Link href="/parameters/carousel">
            Carousels
          </Link>
        ),
      },
    ],
  },
]

export const menuBank = [
  {
    key: "/infosbank",
    icon: <BsBank2 />,
    label: <Link href="/infosbank">Infos Bank</Link>,
  },
  {
    key: "/credit",
    icon: <CreditCardOutlined />,
    label: <Link href="/creditbank">Crédit</Link>,
  },
  {
    key: "/historiqueapprovisionnement",
    icon: <FaListOl />,
    label: <Link href="/historiqueapprovisionnement">Historique Appro.</Link>,
  },

  {
    key: "/historiqueventes",
    icon: <MdAddShoppingCart />,
    label: <Link href="/historiqueventes">Historique Vente</Link>,
  },

]