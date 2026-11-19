"use client";
import useAuth from "@/controller/hooks/useAuth";
import LayoutCompWithTable from "@/view/model/LayoutCompWithTable";
import React, { useState } from "react";
import { useQuery } from "react-query";

import { Col, Form, Input, List, Popconfirm, Row, Table, Tag, Select, Space, Drawer } from "antd";
import { Button } from "@/components/ui/button";
import { EditIcon, Trash2 } from "lucide-react";
import { _deleteTypeLivraison, _typeLivraison } from "@/controller/tanstack/typeLivraison/getTypeLivraison.service";
// import { Input } from "@/components/ui/input";
import { _province } from "@/controller/tanstack/province/getProvince.service";

import { ResponseProvince, TypeLivraisonCredentials } from "@/types";
import useTypeLivraison from "@/controller/tanstack/typeLivraison/useTypeLivraison";
import Loader from "@/components/global/loader/Loader";
import { generateTypeLivraisonPdf } from "@/components/docs/typelivraison";
import { FiPrinter } from "react-icons/fi";
import SpinLoader from "@/components/global/lazy/SpinLoader";
import useDeleteTypeLivraison from "@/controller/tanstack/typeLivraison/useDeleteTypeLivraison";
import { useForm } from "antd/es/form/Form";
import useUpdateTypeLivraison from "@/controller/tanstack/typeLivraison/useUpdateTypeLivraison";
const { TextArea } = Input;

const { Option } = Select;
const HomeTypeLivraison = () => {
  const { token } = useAuth();

  const { data: dataType, isLoading: dataTypeLivraison, refetch } = useQuery("auth-typelivrai", () =>
    _typeLivraison(token!)
  );

  const { data: dataProvince } = useQuery(
    "auth-province",
    () => _province(token!)
  );

  const [credentials, setCredentials] = useState<TypeLivraisonCredentials>({
    type: "",
    frais_livraison: 0,
    quantite: 0,
    description: "",
    lieux: []
  })

  const handleChangeLieux = (value: any) => {
    setLieux(value)
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      lieux: value,
    }));
  };

  const handleChangeLieux2 = (value: any) => {
    setLieux(Array.isArray(value) ? value : [value]);

  };

  // const handleChangeLieux = (value: any) => {
  //   setLieux(Array.isArray(value) ? value : [value]); // Mettre la valeur dans un tableau
  //   setCredentials((prevCredentials) => ({
  //     ...prevCredentials,
  //     lieux: Array.isArray(value) ? value : [value], // Mettre la valeur dans un tableau
  //   }));
  // };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const handleChangeArea = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      description: value,
    }));
  };

  const { mutateAsync: _addTypeLivraison, isLoading: loadAddTypeLivraison } = useTypeLivraison()


  const handleSubmit = async () => {
    try {
      await _addTypeLivraison({ credentials: credentials, token: token! });
      refetch();
    } catch (error) {
      console.error("", error);
    }
  };
  const [searchedText, setSearchedText] = useState<string>("");
  const filteredData = dataType?.data?.rows?.filter(
    (item: any): boolean => {
      return Object.keys(item).some((key: string) =>
        item[key]?.toString().toLowerCase().includes(searchedText.toLowerCase())
      );
    }
  );

  const {
    mutateAsync: _deleteTypeLivraison,
  } = useDeleteTypeLivraison();


  const handleDelete = async (userId: number) => {

    try {
      await _deleteTypeLivraison({
        useid: userId,
        token: token!,
      });
      refetch();
    } catch (error) {
      console.error("", error);
    }
  };

  const {
    mutateAsync: _updateTypeLivraison,
    isLoading: loadUpdate,
  } = useUpdateTypeLivraison();

  const [formTypeLivraison] = useForm<TypeLivraisonCredentials>()

  //update categorie Cooperative
  const handleUpdateId = async (typeId: number) => {

    try {
      const values: TypeLivraisonCredentials = await formTypeLivraison.validateFields()
      await _updateTypeLivraison({
        credentials: values, useid: typeId,
        token: token!
      })
      refetch();
    } catch (error) {
      console.error("", error);
    }
  }
  const [open, setOpen] = useState(false)
  const [openModif, setOpenModif] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setOpenModif(false)
  };
  const [id, setId] = useState(Number)
  const [typeL, setTypeL] = useState('')
  const [fraisLivraison, setFraisLivraison] = useState('')
  const [quantite, setQuantite] = useState('')
  const [description, setDescription] = useState('')
  const [lieux, setLieux] = useState<number[]>([]);
  const showDrawerModif = (element: any) => {
    setOpenModif(true);
    setTypeL(element.type)
    setDescription(element.description)
    setQuantite(element.quantite)
    setFraisLivraison(element.frais_livraison)
    setLieux(JSON.parse(element.lieux))
    setId(element.id)
    formTypeLivraison.setFieldsValue(element);

  };

  const selectedLieux = lieux ? lieux.map((lieuxId) => {
    const prov = dataProvince?.data.rows.find((item) => item.id === lieuxId);
    return prov ? prov.province : '';
  }) : [];

  return <div>
    <LayoutCompWithTable
      title="Liste des types de livraison"
      btn={
        <>
          <div className="w-full md:w-auto md:mr-4 flex gap-4 items-center">
            <Input.Search
              placeholder="Rechercher un utilisateur"
              className="placeholder:!text-xs"
              onSearch={(v) => setSearchedText(v)}
              onChange={(e) => setSearchedText(e.target.value)}
            />

            <Button onClick={showDrawer}>Ajouter Type</Button>

            <Button onClick={() => generateTypeLivraisonPdf('Listes des types de livraison', filteredData)}><FiPrinter />Imprimer</Button>
          </div>


          <Drawer
            title="Ajouter Une coopérative"
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
                  {loadAddTypeLivraison ? <Loader /> : "Enregistrer"}
                </Button>
              </Space>
            }
          >
            <Form layout="vertical" hideRequiredMark>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="type"
                    label="Type de livraivraison"
                    rules={[
                      {
                        required: true,
                        message: "Enter le type de livraivraison",
                      },
                    ]}
                  >
                    <Input
                      type="text"
                      name="type"
                      value={credentials.type}
                      onChange={handleChange}
                      id="type"
                      placeholder="type livraison"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="quantite"
                    label="Quantité"
                    rules={[{ required: true, message: "En sigle" }]}
                  >
                    <Input
                      type="number"
                      name="quantite"
                      id="quantite"
                      value={credentials.quantite}
                      onChange={handleChange}
                      placeholder="Quantiter"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="frais_livraison"
                    label="Frais de Livraison"
                    rules={[
                      {
                        required: true,
                        message: "Entrez le responsable",
                      },
                    ]}
                  >
                    <Input
                      type="text"
                      name="frais_livraison"
                      onChange={handleChange}
                      id="frais_livraison"
                      placeholder="Frais lie livraison"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="lieux"
                    label="Lieu de livraison"
                    rules={[
                      {
                        required: true,
                        message: "Entrez le responsable adjoint",
                      },
                    ]}
                  >
                    <Select
                      mode="tags"
                      placeholder="Please select"
                      value={credentials?.lieux}
                      onChange={handleChangeLieux}
                      style={{
                        width: '100%',
                      }}

                    >
                      <Option selected value="">Lieu</Option>
                      {
                        dataProvince &&
                          dataProvince !== undefined ?
                          dataProvince?.data?.rows?.map((item, i) => (
                            <Option key={i} value={item.id}>{item.province}</Option>
                          ))
                          : "Role"
                      }
                    </Select>
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
                    <TextArea
                      name="description"
                      value={credentials.description}
                      onChange={handleChangeArea}
                      rows={2}
                      cols={30}
                      style={{ width: '100%' }}
                      placeholder="Designation Categorie"
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
            dataTypeLivraison ? (

              <SpinLoader />
            ) : (
              <>
                <Table
                  dataSource={filteredData}
                  loading={dataTypeLivraison}
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
                      title: "Type de Livraison",
                      dataIndex: "type",
                      key: "type",
                      render: (_, item) => (
                        <>
                          <List.Item.Meta
                            className=" flex items-center gap-4"
                            title={<strong>{`${item.type}`}</strong>}
                            description={item?.description}
                          />
                        </>
                      ),
                    },

                    {
                      title: "Quantité",
                      dataIndex: "qte",
                      key: "qte",

                      render: (_, item) => <a>{item?.quantite}</a>,
                    },
                    {
                      title: "Frais Livraison",
                      dataIndex: "frais",
                      key: "frais",

                      render: (_, item) => <a>{item?.frais_livraison}</a>,
                    },
                    {
                      title: "Modifier",
                      key: "update",
                      dataIndex: "update",
                      align: "center",
                      render: (_, item) => (
                        <>
                          <Tag color="green" className="cursor-pointer p-2"
                            // onClick={() => handleOpenDialog(item)}
                            onClick={() => showDrawerModif(item)}
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
                            title="Suppression type de livraison"
                            description="Voulez-vous vraiment supprimer le type de livraisonty ??"
                            okText="Supprimer"
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
      title="Modifier le types de livraison"
      width={720}
      onClose={onClose}
      open={openModif}
      styles={{
        body: {
          paddingBottom: 80,
        },
      }}
      extra={
        <Space>

          <Button onClick={() => handleUpdateId(id)}>
            {loadUpdate ? <Loader /> : "Modifier"}
          </Button>
        </Space>
      }
    >
      <Form layout="vertical" hideRequiredMark form={formTypeLivraison}
        initialValues={
          {
            type: typeL,
            frais_livraison: fraisLivraison,
            quantite: quantite,
            description: description,
            lieux: selectedLieux
          }
        }
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="type"
              label="Type de livraivraison"
              rules={[
                {
                  required: true,
                  message: "Enter le type de livraivraison",
                },
              ]}
            >
              <Input
                type="text"
                name="type"
                id="type"
                value={credentials.type}
                onChange={handleChange}
                placeholder="type livraison"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="quantite"
              label="Quantité"
              rules={[{ required: true, message: "En sigle" }]}
            >
              <Input
                type="number"
                name="quantite"
                id="quantite"
                value={credentials.quantite}
                onChange={handleChange}
                placeholder="Quantiter"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="frais_livraison"
              label="Frais de Livraison"
              rules={[
                {
                  required: true,
                  message: "Entrez le responsable",
                },
              ]}
            >
              <Input
                type="text"
                name="frais_livraison"
                onChange={handleChange}
                id="frais_livraison"
                placeholder="Frais lie livraison"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="lieux"
              label="Lieu de livraison"
              rules={[
                {
                  required: true,
                  message: "Entrez le responsable adjoint",
                },
              ]}
            >
              <Select
                mode="tags"
                placeholder="Sélectionnez les lieux"
                onChange={handleChangeLieux2}
                style={{
                  width: '100%',
                }}
                value={selectedLieux}
              >
                {dataProvince &&
                  dataProvince !== undefined ?
                  dataProvince?.data?.rows?.map((item) => (
                    <Option key={item.province} value={item.province}>{item.province}</Option>
                  ))
                  : "Chargement..."
                }
              </Select>
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
                  message: "Entrez le mot de passe",
                },
              ]}
            >
              <TextArea
                name="description"
                value={credentials.description}
                onChange={handleChangeArea}
                rows={2}
                cols={30}
                style={{ width: '100%' }}
                placeholder="Designation Categorie"
              />
            </Form.Item>
          </Col>
        </Row>

      </Form>
    </Drawer>
  </div>;
};

export default HomeTypeLivraison;
