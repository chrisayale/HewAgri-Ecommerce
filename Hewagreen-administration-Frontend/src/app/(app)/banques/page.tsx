"use client";
import useAuth from "@/controller/hooks/useAuth";
import { _addBank, _banks } from "@/controller/tanstack/banks/getBanks.service";
import { frenchFormattedDate } from "@/lib/dates";
import LayoutCompWithTable from "@/view/model/LayoutCompWithTable";
import { Avatar, Col, Drawer, Form, Input, List, Popconfirm, Row, Select, Space, Table, Tag } from "antd";
import { ListCollapse, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useQuery } from "react-query";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useDeleteBank from "@/controller/tanstack/banks/useDeleteBank";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { _identification } from "@/controller/tanstack/identification/getIdentification.service";
import { BankCredentials } from "@/types";
import useBank from "@/controller/tanstack/banks/useBank";
import Loader from "@/components/global/loader/Loader";
import { generateBanquePdf } from "@/components/docs/banquepdf";
import { FiPrinter } from "react-icons/fi";
import SpinLoader from "@/components/global/lazy/SpinLoader";
const { Option } = Select;

const Home = () => {
  const { token } = useAuth();
  const { data: dataBank, isLoading: dataBankLoad , refetch} = useQuery("auth-bank", () =>
    _banks(token!)
  );

  const { data: dataIdentification, isLoading: dataBaqueLoad } =
    useQuery("auth-profil3", () => _identification(token!));

  const {
    mutateAsync: _deleteBank,
  } = useDeleteBank();

  const handleDelete = async (bnkId: number) => {
    await _deleteBank({
      bankid: bnkId,
      token: token!,
    });
  };

  const {
    mutateAsync: _addBank,
  } = useBank();

  const [credentials, setCredentials] = useState<BankCredentials>({
    phone: "",
    email: "",
    bank: "",
    description: "",
    adresse: "",
    id_responsable: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await _addBank({
        credentials: {
          phone: credentials?.phone,
          email: credentials?.email,
          bank: credentials?.bank,
          description: credentials?.description,
          adresse: credentials?.adresse,
          id_responsable: credentials?.id_responsable,
        },
        token: token!,
      });
      refetch();
    } catch (error) {
      console.error("", error);
    }
  };
  const handleRespoChange = (value: number) => {
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      id_responsable: value,
    }));
  };

  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const [searchedText, setSearchedText] = useState<string>("");
  const filteredData = dataBank?.data.rows?.filter(
    (item: any): boolean => {
      return Object.keys(item).some((key: string) =>
        item[key]?.toString().toLowerCase().includes(searchedText.toLowerCase())
      );
    }
  );

  return <div>
    <LayoutCompWithTable
      title="Liste des Banques"
      btn={
        <>
          <div className="w-full md:w-auto md:mr-4 flex gap-4 items-center">
            <Input.Search
              placeholder="Rechercher un utilisateur"
              className="placeholder:!text-xs"
              onSearch={(v) => setSearchedText(v)}
              onChange={(e) => setSearchedText(e.target.value)}
            />
            <Button onClick={showDrawer}>Ajouter Une Banque</Button>
            <Button onClick={() => generateBanquePdf('Liste des banques', filteredData)}><FiPrinter />Imprimer</Button>
          </div>

          <Drawer
            title="Ajouter une Banque"
            width={720}
            onClose={onClose}
            open={open}
            styles={{
              body: {
                paddingBottom: 80,
              },
            }}
            extra={
              <Space>
                {/* <Button onClick={onClose}>Cancel</Button> */}
                <Button onClick={handleSubmit}>
                  {dataBaqueLoad ? (
                    <Loader />
                  ) : (
                    "Enregistrer"
                  )}
                </Button>
              </Space>
            }
          >
            <Form layout="vertical" hideRequiredMark>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="bank"
                    label="Nom Banque"
                    rules={[
                      {
                        required: true,
                        message: "Entrer le nom de la banque",
                      },
                    ]}
                  >
                    <Input
                      type="text"
                      name="bank"
                      id="bank"
                      placeholder="Nom banque"
                      onChange={handleChange}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="phone"
                    label="Téléphone"
                    rules={[{ required: true, message: "Entrer le le numero" }]}
                  >
                    <Input
                      type="text"
                      name="phone"
                      id="phone"
                      placeholder="Telephone"
                      onChange={handleChange}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ required: true, message: "Entrer l'adresse email" }]}
                  >
                    <Input
                      type="text"
                      name="email"
                      id="email"
                      placeholder="Email"
                      onChange={handleChange}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="id_responsable"
                    label="Responsable / Gérant"
                    rules={[
                      {
                        required: true,
                        message: "Entrez le responsable",
                      },
                    ]}
                  >
                    <Select showSearch style={{ width: "100%" }} dropdownStyle={{ height: 200 }}

                      placeholder="Selectionner province" optionFilterProp="children"

                      filterOption={(input: string, option: any) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      onChange={handleRespoChange}
                    >
                      <Option selected value="">Responsable
                      </Option>
                      {
                        dataIdentification?.data?.rows.map((item, i) => (
                          item.__tbl_ecom_roles?.map((element) => {
                            if (element.role === "Responsable Bank") {
                              return (
                                <Option key={i} value={item.id}>{`${item.nom} ${item.postnom}`}</Option>
                              );
                            }
                            return null;
                          })
                        ))
                      }
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>

                <Col span={24}>
                  <Form.Item
                    name="adresse"
                    label="Adresse"
                    rules={[
                      {
                        required: true,
                        message: "Entrez l'adresse'",
                      },
                    ]}
                  >
                    <Input
                      type="text"
                      name="adresse"
                      id="adresse"
                      placeholder="Adresse"
                      onChange={handleChange}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>

                <Col span={24}>
                  <Form.Item
                    name="description"
                    label="Description"
                    rules={[
                      {
                        required: true,
                        message: "Entrez la description",
                      },
                    ]}
                  >
                    <Input
                      type="text"
                      name="description"
                      id="description"
                      placeholder="Description"
                      onChange={handleChange}
                    />
                  </Form.Item>
                </Col>


              </Row>

            </Form>
          </Drawer>
        </>
      }
      content={
        <>
          {
            dataBankLoad ? (
              <SpinLoader />
            ) : (
              <>
                <Table
                  dataSource={filteredData}
                  loading={dataBankLoad}
                  columns={[
                    {
                      title: "N°",
                      dataIndex: "index",
                      key: "index",
                      render: (_, __, index) => index + 1,
                      width: "3rem",
                    },
                    {
                      title: "Banque",
                      dataIndex: "banque",
                      key: "banque",
                      render: (_, item) => (
                        <>
                          <List.Item.Meta
                            className=" flex items-center gap-4"
                            avatar={<Avatar />}
                            title={
                              <strong>
                                {`${item?.bank}`}
                              </strong>
                            }
                            description={`${item?.email}`}
                          />
                        </>
                      ),
                    },
                    {
                      title: "Téléphone",
                      dataIndex: "tel",
                      key: "tel",
                      render: (_, item) => <a>{item?.phone}</a>,
                    },
                    {
                      title: "Responsable",
                      dataIndex: "respo",
                      key: "respo",
                      render: (_, item) => (
                        <>
                          <List.Item.Meta
                            className=" flex items-center gap-4"
                            title={
                              <strong>
                                {`${item?.__tbl_ecom_user?.nom} ${item?.__tbl_ecom_user?.postnom} ${item?.__tbl_ecom_user?.prenom}`}
                              </strong>
                            }
                            description={`${item?.__tbl_ecom_user?.email}`}
                          />
                        </>
                      ),
                    },
                    {
                      title: "Date de création",
                      dataIndex: "date",
                      key: "date",

                      render: (_, item) => (
                        <a>{frenchFormattedDate(item?.createdAt)}</a>
                      ),
                    },
                    {
                      title: "Supprimer",
                      key: "delete",
                      align: "center",
                      render: (_, item) => (
                        <>
                          <Popconfirm
                            placement="bottom"
                            title="Suppression Banque"
                            description="Voulez-vous vraiment supprimer cette banque"
                            okText="OUI"
                            cancelText="NON"
                            onConfirm={() => handleDelete(item?.id)}
                          >
                            <Tag color="volcano" className=" p-2">
                              <Trash2 size={16} />
                            </Tag>
                          </Popconfirm>
                        </>
                      ),
                    },

                    {
                      title: "Détail",
                      key: "datail",
                      align: "center",
                      render: (_, item) => (
                        <>
                          <Sheet>
                            <SheetTrigger>
                              <Tag color="green" className=" p-2">
                                <ListCollapse size={16} />
                              </Tag>
                            </SheetTrigger>
                            <SheetContent className="w-[900px] md:w-full md:max-w-2xl lg:max-w-3xl">
                              <SheetHeader>
                                <SheetTitle>Détail du crédit</SheetTitle>
                                <SheetDescription>
                                  <div className=" w-full py-6 px-2 flex flex-col gap-8">
                                    <div className=" w-full flex justify-center">
                                      <Avatar
                                        // src={`${baseURL}/${item?.avatar}`}
                                        className=" w-20 h-20"
                                      />
                                    </div>
                                    <div>
                                      <div className="h-[60vh] overflow-auto">
                                        <div className="border-t border-gray-200  py-5 sm:p-0">
                                          <dl className="sm:divide-y sm:divide-gray-200">
                                            <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Banque
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                <strong>
                                                  {`${item?.bank}`}
                                                </strong>
                                              </dd>
                                            </div>
                                            <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Email
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {item?.email}
                                              </dd>
                                            </div>
                                            <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Téléphone
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {item?.phone}
                                              </dd>
                                            </div>
                                            <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Déscription
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {item?.description}
                                              </dd>
                                            </div>
                                            <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Créer
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {frenchFormattedDate(item?.createdAt)}
                                              </dd>
                                            </div>

                                            <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Responsable
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {`${item?.__tbl_ecom_user?.nom} ${item?.__tbl_ecom_user?.postnom} ${item?.__tbl_ecom_user?.prenom}`}
                                              </dd>
                                            </div>

                                            <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Email
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {item?.__tbl_ecom_user?.email}
                                              </dd>
                                            </div>
                                            <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Téléphone
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {item?.__tbl_ecom_user?.phone}
                                              </dd>
                                            </div>

                                          </dl>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </SheetDescription>
                              </SheetHeader>
                            </SheetContent>
                          </Sheet>
                        </>
                      ),
                    },
                  ]}
                />
              </>
            )
          }
        </>

      }
    />
  </div>;
};

export default Home;
