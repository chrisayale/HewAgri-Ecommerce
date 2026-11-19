"use client";
import useAuth from "@/controller/hooks/useAuth";
import { _sousCategorieProduit } from "@/controller/tanstack/sousCategProd/getSousCategProduit.service";
import LayoutCompWithTable from "@/view/model/LayoutCompWithTable";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { Col, Drawer, Form, Input, List, Popconfirm, Row, Select, Space, Table, Tag } from "antd";
import { EditIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SousCategorieCredentials } from "@/types";
import useSousCategorieProduit from "@/controller/tanstack/sousCategProd/useSousCategProduit";
// import { Input } from "@/components/ui/input";
import { _categorieProduit } from "@/controller/tanstack/categorieProduit/getCategProduit.service";
import Loader from "@/components/global/loader/Loader";
import { generateSousCategProduitPdf } from "@/components/docs/souscategorieproduit";
import { FiPrinter } from "react-icons/fi";
import SpinLoader from "@/components/global/lazy/SpinLoader";
import useDeleteSousCateg from "@/controller/tanstack/sousCategProd/useDeleteSousCateg";
import { useForm } from "antd/es/form/Form";
import useUpdatesousCateg from "@/controller/tanstack/sousCategProd/useUpdateSousCateg";
const { Option } = Select;

const HomeSOusCategorie = () => {
  const { token } = useAuth();

  const { data: dataSousCategProduit, isLoading: dataSousCategLoad, refetch } = useQuery("auth-sous", () =>
    _sousCategorieProduit(token!)
  );
  const [id, setId] = useState("")
  const { data: dataCategProduit } = useQuery("auth-categ", () =>
    _categorieProduit(token!)
  );

  const [credentials, setCredentials] = useState<SousCategorieCredentials>({
    id_categorie: 0,
    souscategory: "",
    description: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const { mutateAsync: _addSousCategorieProduit, isLoading: loadAddSousCategorieProduit, error } = useSousCategorieProduit()

  const handleSubmit = async () => {
    try {
      await _addSousCategorieProduit({ credentials: credentials, token: token! });
      setCredentials({
        ...credentials,
        id_categorie: 0,
        souscategory: "",
        description: ""
      });
      dataCategProduit
      refetch();
      setOpen(false);
    } catch (error) {

    }

  };

  const handleCategChange = (value: number) => {
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      id_categorie: value,
    }));
  };

  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setOpen1(false);
  };

  const [searchedText, setSearchedText] = useState<string>("");
  const filteredData = dataSousCategProduit?.data?.rows?.filter(
    (item: any): boolean => {
      return Object.keys(item).some((key: string) =>
        item[key]?.toString().toLowerCase().includes(searchedText.toLowerCase())
      );
    }
  );

  const {
    mutateAsync: _deleteSousCategProduit
  } = useDeleteSousCateg();

  const handleDelete = async (id: number) => {
    try {
      await _deleteSousCategProduit({ useid: id, token: token! });
      dataCategProduit
      refetch();
    } catch (error) {
      console.error("Error :", error);
    }

  };

  const [formICategUpdata] = useForm<SousCategorieCredentials>()

  const handleOpenDialog = (item: any) => {
    setOpen1(true);
    formICategUpdata.setFieldsValue({
      id_categorie: item.id_category,
      souscategory: item.souscategory,
      description: item.description,
    });
    setId(item.id);
  };

  const {
    mutateAsync: updatesousCategProduit,
    isLoading: loadUpdate,
  } = useUpdatesousCateg();


  const handleUpdateId = async (useid: number) => {
    const values: SousCategorieCredentials = await formICategUpdata.validateFields()
    try {

      await updatesousCategProduit({ credentials: values, useid: useid, token: token! })
      setCredentials({
        ...credentials,
        id_categorie: 0,
        souscategory: "",
        description: ""
      });
      dataCategProduit
      setOpen1(false);
      refetch();
    } catch (error) {
      console.error("Error :", error);
    }

  }


  return <div>
    <LayoutCompWithTable
      title="Sous Categorie Produit"
      btn={
        <>
          <div className="w-full md:w-auto md:mr-4 flex gap-4 items-center">
            <Input.Search
              placeholder="Rechercher un utilisateur"
              className="placeholder:!text-xs"
              onSearch={(v) => setSearchedText(v)}
              onChange={(e) => setSearchedText(e.target.value)}
            />

            <Button onClick={showDrawer}>Ajouter Sous Categ</Button>

            <Button onClick={() => generateSousCategProduitPdf('Listes de sous categorie', filteredData)}><FiPrinter />Imprimer</Button>
          </div>

          <Drawer
            title="Ajouter la sous catégorie"
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
                <Button
                  className="w-[100%]"
                  onClick={handleSubmit}
                >
                  {loadAddSousCategorieProduit ? (
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
                    name="id_categorie"
                    label="Catégorie"
                    rules={[
                      {
                        required: true,
                        message: "Enter le nom de la coopérative",
                      },
                    ]}
                  >
                    <Select showSearch style={{ width: "100%" }} dropdownStyle={{ height: 200 }}

                      placeholder="Selectionner categorie" optionFilterProp="children"

                      filterOption={(input: string, option: any) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }

                      onChange={handleCategChange}
                    >
                      <Option selected value="">Listes...
                      </Option>
                      {
                        dataCategProduit?.data?.rows?.map((item, i) => (
                          <Option key={i} value={item.id}>{item.category}</Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="souscategory"
                    label="Catégories"
                    rules={[{ required: true, message: "En sigle" }]}
                  >
                    <Input
                      type="text"
                      name="souscategory"
                      onChange={handleChange}
                      id="souscategory"
                      placeholder="Designation Categorie"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>

                <Col span={24}>
                  <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: "En sigle" }]}
                  >
                    <Input
                      type="text"
                      name="description"
                      onChange={handleChange}
                      id="description"
                      placeholder="Description"
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
            dataSousCategLoad ? (
              <SpinLoader />
            ) : (
              <>
                <Table
                  dataSource={filteredData}
                  loading={dataSousCategLoad}
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
                      title: "Sous Catégories",
                      dataIndex: "role",
                      key: "role",
                      render: (_, item,) => (
                        <>
                          <List.Item.Meta
                            className=" flex items-center gap-4"
                            // avatar={<Avatar src={`${baseURL}/${item?.avatar}`} />}
                            title={<strong>{`${item?.souscategory}`}</strong>}
                          // description={item?.description}
                          />
                        </>
                      ),
                    },

                    {
                      title: "Déscription",
                      dataIndex: "date",
                      key: "date",

                      render: (_, item,) => (
                        <a>{item?.description}</a>
                      ),
                    },
                    {
                      title: "Modifier",
                      key: "update",
                      dataIndex: "update",
                      align: "center",
                      render: (_, item) => (
                        <>
                          <Tag color="green" className=" p-2"
                            onClick={() => handleOpenDialog(item)}
                          >
                            <EditIcon size={16} />
                          </Tag>
                        </>
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
                            title="Supprimmer la sous categorie"
                            description="Voulez-vous vraiment supprimer la sous categorie"
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
                  ]}
                />
              </>
            )
          }
        </>

      }
    />

    <Drawer
      title="Modifier la sous catégorie"
      width={720}
      onClose={onClose}
      open={open1}
      styles={{
        body: {
          paddingBottom: 80,
        },
      }}
      extra={
        <Space>
          {/* <Button onClick={onClose}>Cancel</Button> */}
          <Button
            className="w-[100%]"
            onClick={() => handleUpdateId(parseInt(id))}
          >
            {loadAddSousCategorieProduit ? (
              <Loader />
            ) : (
              "Modifier"
            )}
          </Button>
        </Space>
      }
    >
      <Form layout="vertical" hideRequiredMark form={formICategUpdata}

      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="id_categorie"
              label="Catégorie"
              rules={[
                {
                  required: true,
                  message: "Enter le nom de la coopérative",
                },
              ]}
            >
              <Select showSearch style={{ width: "100%" }} dropdownStyle={{ height: 200 }}

                placeholder="Selectionner categorie" optionFilterProp="children"

                filterOption={(input: string, option: any) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }

                onChange={handleCategChange}
              >
                <Option selected value="">Listes...
                </Option>
                {
                  dataCategProduit?.data?.rows?.map((item, i) => (
                    <Option key={i} value={item.id}>{item.category}</Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="souscategory"
              label="Catégories"
              rules={[{ required: true, message: "En sigle" }]}
            >
              <Input
                type="text"
                name="souscategory"
                onChange={handleChange}
                id="souscategory"
                placeholder="Designation Categorie"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>

          <Col span={24}>
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: "En sigle" }]}
            >
              <Input
                type="text"
                name="description"
                onChange={handleChange}
                id="description"
                placeholder="Description"
              />
            </Form.Item>
          </Col>
        </Row>

      </Form>
    </Drawer>
  </div>;
};

export default HomeSOusCategorie;
