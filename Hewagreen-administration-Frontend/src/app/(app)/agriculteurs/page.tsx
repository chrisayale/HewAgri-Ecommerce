"use client";
import useAuth from "@/controller/hooks/useAuth";
import { _agriculteur } from "@/controller/tanstack/agriculteurs/getAgriculteur.service";
import LayoutCompWithTable from "@/view/model/LayoutCompWithTable";
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
import { Avatar, Col, Drawer, Form, Input, List, Row, Select, Space, Table, Tag } from "antd";
import { EditIcon, ListCollapse } from "lucide-react";
import { baseURL } from "@/controller/api/config/baseUrl";
import { frenchFormattedDate } from "@/lib/dates";
import { Button } from "@/components/ui/button";
import { AgriculteurCredentials } from "@/types";
import useAgriculteur from "@/controller/tanstack/agriculteurs/useAgriculteur";
import { _identification } from "@/controller/tanstack/identification/getIdentification.service";
import { _cooperative } from "@/controller/tanstack/cooperative/getCooperative.service";
import Loader from "@/components/global/loader/Loader";
import { FiPrinter } from "react-icons/fi";
import { generateAgriculteurPdf } from "@/components/docs/agriculteurpdf";
import SpinLoader from "@/components/global/lazy/SpinLoader";
const { Option } = Select;

const Home = () => {
  const { token } = useAuth();

  const { data: dataAgriculteur, isLoading: dataAgriculteurLoard ,refetch} = useQuery("auth-agri", () =>
    _agriculteur(token!)
  );

  const { data: dataIdentification } =
    useQuery("data-identification", () => _identification(token!));

  const { data: dataCooperative } = useQuery("auth-coop", () =>
    _cooperative(token!)
  );

  const [credentials, setCredentials] = useState<AgriculteurCredentials>({
    ids_members: [],
    id_cooperative: ""
  })


  const { mutateAsync: _addAgriculteur, isLoading: loadAddAgri, error } = useAgriculteur()

  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };


  const [selectedMembre, setSelectedMembre] = useState<[]>([]);

  const handleSubmit = async () => {  
    try {
      await _addAgriculteur({
        credentials: {
          ids_members: selectedMembre,
          id_cooperative: credentials?.id_cooperative
        },
        token: token!,
      });
      refetch();
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'agriculteur :", error);
    }
  };
  const handleMembreChange = (value: any) => {
    setSelectedMembre(value)
  };
  
  const handleCoopChange = (value: string) => {
   
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      id_cooperative: value,
    }));
  };

  const [searchedText, setSearchedText] = useState<string>("");

  const filteredData = dataAgriculteur?.data?.rows?.filter(
    (item: any): boolean => {
      return item?.__tbl_ecom_user && Object.keys(item?.__tbl_ecom_user).some((key: string) =>
        item?.__tbl_ecom_user[key]?.toString().toLowerCase().includes(searchedText.toLowerCase())
      );
    }
  );

  return <div>
    <LayoutCompWithTable
      title="Listes des agriculteurs"
      btn={
        <>

          <div className="w-full md:w-auto md:mr-4 flex gap-4 items-center">
            <Input.Search
              placeholder="Rechercher un agriculteur"
              className="placeholder:!text-xs"
              onSearch={(v) => setSearchedText(v)}
              onChange={(e) => setSearchedText(e.target.value)}
            />
            <Button onClick={showDrawer}>Ajouter un Agriculteur </Button>
            <Button onClick={() => generateAgriculteurPdf('Liste des agriculteurs', filteredData)}><FiPrinter />Imprimer</Button>
          </div>
          <Drawer
            title="Ajouter Un Agriculteur"
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
                  {loadAddAgri ? (
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
                <Col span={24}>
                  <Form.Item
                    name="cooperative"
                    label="Coopérative"
                    rules={[
                      {
                        required: true,
                        message: "Entrez le nom de la coopérative",
                      },
                    ]}
                  >
                    <Select showSearch style={{ width: "100%" }} dropdownStyle={{ height: 200 }}

                      placeholder="Selectionnez cooperative" optionFilterProp="children"

                      filterOption={(input: string, option: any) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }

                    //  mode="tags"
                      onChange={handleCoopChange}
                    >
                      <Option selected value="">Coopérative
                      </Option>
                      {
                        dataCooperative?.data?.rows?.map((item, i) => (
                          <Option key={i} value={item.id}>{item.cooperative}</Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    name="ids_members"
                    label="Membres"
                    rules={[{ required: true, message: "Séléctionnez des membres" }]}
                  >
                    <Select
                      style={{ width: "100%" }}
                      mode="tags"
                      placeholder="Séléctionnez des membres"
                      showSearch
                      filterOption={(input: string, option: any) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      onChange={handleMembreChange}
                    >
                      <Option selected value="">Liste...</Option>
                      {
                        dataIdentification &&
                          dataIdentification !== undefined ?
                          dataIdentification?.data?.rows?.map((item, i) => (
                            <Option key={i} value={item.id}>{`${item.nom} ${item.postnom} `}</Option>
                          ))
                          : ""
                      }
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

            </Form>
          </Drawer>
        </>
      }

      content={
        <div>
          {
            dataAgriculteurLoard ? (
              <SpinLoader />
            ) : (
              <>
                <Table
                  dataSource={filteredData}
                  loading={dataAgriculteurLoard}
                  className=" h-[70vh] overflow-auto"
                  columns={[
                    {
                      title: "N°",
                      dataIndex: "index",
                      key: "index",
                      render: (_, __, index) => index + 1,
                      width: "3rem",
                    },
                    {
                      title: "Membres",
                      dataIndex: "name",
                      key: "name",
                      render: (_, item) => (
                        <>
                          <List.Item.Meta
                            className=" flex items-center gap-4"
                            // avatar={<Avatar  />}
                            title={
                              <strong>
                                {`${item?.__tbl_ecom_user?.nom} ${item?.__tbl_ecom_user?.postnom} ${item?.__tbl_ecom_user?.prenom}`}
                              </strong>
                            }
                            description={item?.__tbl_ecom_user?.email}
                          />
                        </>
                      ),
                    },
                    {
                      title: "Téléphone",
                      dataIndex: "tel",
                      key: "tel",
                      render: (_, item) => <a>{item?.__tbl_ecom_user?.phone}</a>,
                    },
                    {
                      title: "Coopérative",
                      dataIndex: "coop",
                      key: "coop",
                      render: (_, item) => (
                        <>
                          <List.Item.Meta
                            className=" flex items-center gap-4"
                            avatar={<Avatar src={`${baseURL}/${item?.__tbl_ecom_cooperative?.logo}`} />}
                            title={
                              <strong>
                                {`${item?.__tbl_ecom_cooperative?.cooperative}`}
                              </strong>
                            }
                            description={item?.__tbl_ecom_cooperative?.phone}
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
                    // {
                    //   title: "Modifier",
                    //   key: "update",
                    //   dataIndex: "update",
                    //   align: "center",
                    //   render: (_,) => (
                    //     <>
                    //       <Dialog>
                    //         <DialogTrigger>
                    //           <Tag color="green" className=" p-2">
                    //             <EditIcon size={16} />
                    //           </Tag>
                    //         </DialogTrigger>
                    //         <DialogContent>
                    //           <DialogHeader>
                    //             <DialogTitle>
                    //               Modifier L&apos; Utilisateur
                    //             </DialogTitle>

                    //             <DialogDescription>

                    //             </DialogDescription>
                    //           </DialogHeader>
                    //         </DialogContent>
                    //       </Dialog>
                    //     </>
                    //   ),
                    // },


                    // {
                    //   title: "Supprimer",
                    //   key: "delete",
                    //   align: "center",
                    //   render: (_, item, index) => (
                    //     <>
                    //       <Popconfirm
                    //         placement="bottom"
                    //         title="Suppression agriculteur"
                    //         description="Voulez-vous vraiment supprimer cet utilisateur"
                    //         okText="OUI"
                    //         cancelText="NON"
                    //       >
                    //         <Tag color="volcano" className=" p-2">
                    //           <Trash2 size={16} />
                    //         </Tag>
                    //       </Popconfirm>
                    //     </>
                    //   ),
                    // },
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
                                <SheetTitle>Détail Agriculteur</SheetTitle>
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
                                        <div className=" border-t border-gray-200  py-5 sm:p-0">
                                          <dl className="sm:divide-y sm:divide-gray-200">
                                            <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Membre
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                <strong>
                                                  {`${item?.__tbl_ecom_user?.nom} ${item?.__tbl_ecom_user?.postnom} ${item?.__tbl_ecom_user?.prenom}`}
                                                </strong>
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
                                            <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Date Création
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {frenchFormattedDate(item?.createdAt)}
                                              </dd>
                                            </div>
                                            <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Coopérative
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {`${item?.__tbl_ecom_cooperative?.cooperative}`}
                                              </dd>
                                            </div>
                                            <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Email
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {item?.__tbl_ecom_cooperative?.email}
                                              </dd>
                                            </div>
                                            <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Téléphone
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {item?.__tbl_ecom_cooperative?.phone}
                                              </dd>
                                            </div>

                                            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Adresse
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {item?.__tbl_ecom_cooperative?.adresse}
                                              </dd>
                                            </div>
                                            <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Formalisation
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {item?.__tbl_ecom_cooperative?.isformel == 1 ? "Formel" : "Nom Formel"}
                                              </dd>
                                            </div>
                                            <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Description
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {item?.__tbl_ecom_cooperative?.description}
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
        </div>

      }
    />
  </div>;
};

export default Home;
