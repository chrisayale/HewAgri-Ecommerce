"use client";
import useAuth from "@/controller/hooks/useAuth";
import LayoutCompWithTable from "@/view/model/LayoutCompWithTable";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { baseURL } from "@/controller/api/config/baseUrl";
import { Button } from "@/components/ui/button";
import { Avatar, Col, Drawer, Input, Form, List, Popconfirm, Row, Select, Space, Table, Tag, Image } from "antd";
import { EditIcon, ListCollapse, Trash2 } from "lucide-react";
import { _deleteProduit, _produit } from "@/controller/tanstack/produit/getProduit.service";
import { ProduitCredentials } from "@/types";
import useProduit from "@/controller/tanstack/produit/useProduit";
import Loader from "@/components/global/loader/Loader";
import { _categorieProduit } from "@/controller/tanstack/categorieProduit/getCategProduit.service";
import { _sousCategorieProduit } from "@/controller/tanstack/sousCategProd/getSousCategProduit.service";
import { _uniteMesure } from "@/controller/tanstack/uniteMesure/getUniteMesure.service";
import useDeleteProduit from "@/controller/tanstack/produit/useDeleteProduit";
import { toast } from "@/components/ui/use-toast";
import { produit } from "@/controller/api/constant/apiLink";
import axios from "axios";
import { useForm } from "antd/lib/form/Form";
import { FiPrinter } from "react-icons/fi";
import { generateProduitPdf } from "@/components/docs/produitpdf";
import SpinLoader from "@/components/global/lazy/SpinLoader";
const { Option } = Select;

const Home = () => {
  const { token } = useAuth();
  const [form] = useForm();
  const [loading, setLoading] = useState(false)
  const { data: dataProduit, isLoading: dataProduitLoad, refetch } = useQuery("auth-produits", () =>
    _produit(token!)
  );

  const { data: dataCategProduit } = useQuery("auth-categ", () =>
    _categorieProduit(token!)
  );
  const { data: dataSousCategProduit } = useQuery("auth-sous", () =>
    _sousCategorieProduit(token!)
  );

  const { data: dataUnite } = useQuery("auth-unite", () =>
    _uniteMesure(token!)
  );

  const [image_default_name, setImageDefaultName] = useState('')
  const [saveFile, setSaveFile] = useState('')
  const [produit1, setProduit1] = useState('')
  const [categ, setCateg] = useState('')
  const [sousCateg, setSousCateg] = useState('')
  const [description, setDescription] = useState('')
  const [unitemesue, setUnitemesue] = useState('')
  const [image_default, setImageDefault] = useState('')
  const [idProd, setIdProd] = useState(Number);
  const [tvap, setTvap] = useState('')

  const {
    mutateAsync: _deleteProduit
  } = useDeleteProduit();

  const [credentials, setCredentials] = useState<ProduitCredentials>({
    produit: "",
    image: null,
    description: "",
    id_unity: "",
    id_category: 0,
    id_souscategory: 0,
    tva: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const { mutateAsync: _addProduits } = useProduit()

  // const handleSubmit = async () => {
  //   await _addProduits({ credentials: credentials, token: token! });
  // };

  const handleSubmit = async () => {
    const formData = new FormData();

    formData.append('produit', credentials?.produit);
    formData.append('image', saveFile);
    formData.append('description', credentials?.description);
    formData.append('id_unity', credentials?.id_unity);
    formData.append('id_category', credentials?.id_category.toString() || '');
    formData.append('id_souscategory', credentials?.id_souscategory.toString() || '');

    setLoading(true);

    if (credentials?.produit === '') {
      toast({
        description: `Assurer vous d'avoir completez tout les champs requis !`,
      });
    } else {
      try {
        const response = await axios.post(
          baseURL + `${produit?.addProduit}`,
          formData,
          {
            headers: {

              "Content-Type": "multipart/form-data",
              'x-ecommerce-kgreen-api': 'Bearer ' + token,

            },
          }
        );

        const json = response.data;
        if (json.status == 200) {
          toast({
            description: `enregistré avec succes`,
          });
          setCredentials({
            ...credentials,
            produit: "",
            image: null,
            description: "",
            id_unity: "",
            id_category: 0,
            id_souscategory: 0,
            tva: ""
          });
          refetch();
        } else {
          setLoading(false)
          toast({
            description: `${json.message}`,
          });
        }
       
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            throw new Error(
              error.response.data.message || "Erreur lors de l'enregistrement"
            );
          } else if (error.request) {
            throw new Error(
              "Le serveur n'a pas répondu. Veuillez réessayer plus tard."
            );
          }
        }
        throw new Error("Une erreur est survenue. Veuillez réessayer.");
      }
    }



    setTimeout(() => {
      setLoading(false);
    }, 3000);

  };

  const handleUpdate = async () => {
    const formData = new FormData();

    formData.append('produit', produit1);
    formData.append('image', saveFile);
    formData.append('description', description);
    formData.append('id_unity', unitemesue);
    formData.append('id_category', categ.toString() || '');
    formData.append('id_souscategory', credentials?.id_souscategory.toString() || '');

    setLoading(true);

    if (produit1 === '') {
      toast({
        description: `Assurer vous d'avoir completez tout les champs requis !`,
      });
    } else {
      try {
        const response = await axios.put(
          baseURL + `${produit?.updateProduit(idProd)}`,
          formData,
          {
            headers: {

              "Content-Type": "multipart/form-data",
              'x-ecommerce-kgreen-api': 'Bearer ' + token,

            },
          }
        );

        const json = response.data;
        if (json.status == 200) {
          toast({
            description: `enregistré avec succes`,
          });
          setCredentials({
            ...credentials,
            produit: "",
            image: null,
            description: "",
            id_unity: "",
            id_category: 0,
            id_souscategory: 0,
            tva: ""
          });
        } else {
          setLoading(false)
          toast({
            description: `${json.message}`,
          });
        }
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            throw new Error(
              error.response.data.message || "Erreur lors de l'enregistrement"
            );
          } else if (error.request) {
            throw new Error(
              "Le serveur n'a pas répondu. Veuillez réessayer plus tard."
            );
          }
        }
        throw new Error("Une erreur est survenue. Veuillez réessayer.");
      }
    }



    setTimeout(() => {
      setLoading(false);
    }, 3000);

  };

  const handleDelete = async (prodId: number) => {
    await _deleteProduit({
      useid: prodId,
      token: token!,
    });
  };

  const [selectedCategId, setSelectedCategId] = useState<
    number | undefined
  >();

  const handleCategChange = (value: number) => {
    setSelectedCategId(value);
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      id_category: value,
    }));
  };
  console.log(selectedCategId)
  const handleSousCategChange = (value: number) => {
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      id_souscategory: value,
    }));
  };

  const handleUniteChange = (value: string) => {
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      id_unity: value,
    }));
  };

  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false)
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setOpenUpdate(false)
  };

  const [searchedText, setSearchedText] = useState<string>("");
  const filteredData = dataProduit?.data?.rows?.filter(
    (item: any): boolean => {
      return Object.keys(item).some((key: string) =>
        item[key]?.toString().toLowerCase().includes(searchedText.toLowerCase())
      );
    }
  );

  const handleImageUpload = (event: any) => {
    const file = event.target.files[0];
    setImageDefault(URL.createObjectURL(file));
    setSaveFile(event.target.files[0]);
  };
  const [formProduit] = useForm<ProduitCredentials>()
  const showElement = (element: any) => {
    setOpenUpdate(true)
    setProduit1(element.produit)
    setCateg(element.id_category)
    setSelectedCategId(element.id_category)

    setDescription(element.description)
    setUnitemesue(element.__tbl_ecom_unitesmesure.id)
    setImageDefault(element.image)
    setSaveFile(element.image)
    setIdProd(element.id);
    setImageDefaultName(baseURL + '/' + element?.image)
    setTvap(element.tva)
    formProduit.setFieldsValue(element);
  }

  return <div>
    <LayoutCompWithTable
      title="Listes des utilisateurs"
      btn={
        <>

          <div className="w-full md:w-auto md:mr-4 flex gap-4 items-center">
            <Input.Search
              placeholder="Rechercher un produit"
              className="placeholder:!text-xs"
              onSearch={(v) => setSearchedText(v)}
              onChange={(e) => setSearchedText(e.target.value)}
            />
            <Button onClick={showDrawer}>Ajouter un produit</Button>
            <Button onClick={() => generateProduitPdf('Liste des Produits', filteredData)}><FiPrinter />Imprimer</Button>
          </div>
          <Drawer
            title="Ajouter un produit"
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
                  {loading ? (
                    <Loader />
                  ) : (
                    "Enregistrer"
                  )}
                </Button>
              </Space>
            }
          >
            <Form layout="vertical" hideRequiredMark >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="produit"
                    label="Designation Produit"
                    rules={[
                      {
                        required: true,
                        message: "Designation produit",
                      },
                    ]}
                  >
                    <Input
                      type="text"
                      name="produit"
                      value={credentials.produit}
                      onChange={handleChange}
                      id="produit"
                      placeholder="Designation produit"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="id_category"
                    label="Catégories"
                    rules={[{ required: true, message: "En sigle" }]}
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
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="id_souscategory"
                    label="Sous Catégories"
                    rules={[
                      {
                        required: true,
                        message: "Entrez la sous categorie",
                      },
                    ]}
                  >
                    <Select
                      style={{ width: "100%" }}
                      placeholder="Selectionnez"
                      onChange={handleSousCategChange}
                    >
                      <Option selected value="">Liste...</Option>

                      {selectedCategId &&
                        dataSousCategProduit?.data?.rows
                          .filter(
                            (item) => item.id_category === selectedCategId
                          )
                          .map((item, index) => (
                            <Option key={index} value={item.id}>
                              {item.souscategory}
                            </Option>
                          ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="id_unity"
                    label="Unité de mesure"
                    rules={[
                      {
                        required: true,
                        message: "Entrez l'unite de mesure",
                      },
                    ]}
                  >
                    <Select
                      style={{ width: "100%" }}
                      placeholder="Selectionnez"
                      onChange={handleUniteChange}
                    >
                      <Option selected value="">Liste...</Option>
                      {
                        dataUnite &&
                          dataUnite !== undefined ?
                          dataUnite?.data?.rows?.map((item, i) => (
                            <Option key={i} value={item.id}>{item.unity}</Option>
                          ))
                          : ""
                      }
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name="tva"
                    label="Tva"
                    rules={[
                      {
                        required: true,
                        message: "Entrez le tva",
                      },
                    ]}
                  >
                    <Input
                      style={{ width: "100%" }}
                      placeholder="Entrez le tva"
                      name="tva"
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
                      style={{ width: "100%" }}
                      placeholder="Entrez la description"
                      name="description"
                      onChange={handleChange}
                    />
                  </Form.Item>
                </Col>

              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="image"
                    label="Image Produit"
                    rules={[
                      {
                        required: true,
                        message: "Image Produit",
                      },
                    ]}
                  >
                    <div className="col" style={{ marginTop: 15 }}>
                      <Image
                        className='form-control'
                        src={image_default || image_default_name}
                        style={{ width: 150 }}
                        alt=""
                      />
                      <br />
                      <label className={'badge bg-primary'} style={{ color: 'white' }}>
                        Attacher Image
                        <input type='file' style={{ display: 'none' }} onChange={handleImageUpload} />
                      </label>
                    </div>
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
            dataProduitLoad ? (
              <SpinLoader />
            ) : (
              <>
                <Table
                  dataSource={filteredData}
                  loading={dataProduitLoad}
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
                      title: "Designation",
                      dataIndex: "prod",
                      key: "prod",
                      render: (_, item) => (
                        <>
                          <List.Item.Meta
                            className=" flex items-center gap-4"
                            avatar={<Avatar src={`${baseURL}/${item?.image}`} />}
                            title={
                              <strong>
                                {`${item?.produit}`}
                              </strong>
                            }
                            description={item?.description}
                          />
                        </>
                      ),
                    },

                    {
                      title: "Categories",
                      dataIndex: "categ",
                      key: "categ",
                      render: (_, item) => (
                        <>
                          <List.Item.Meta
                            className=" flex items-center gap-4"
                            title={
                              <h6 >
                                {item?.__tbl_ecom_category && item.__tbl_ecom_category.category
                                  ? item.__tbl_ecom_category.category
                                  : ""}
                              </h6>
                            }
                          // description={item?.__tbl_ecom_category?.description}
                          />
                        </>
                      ),
                    },

                    {
                      title: "Sous Categories",
                      dataIndex: "categ",
                      key: "categ",
                      render: (_, item) => (
                        <>
                          <List.Item.Meta
                            className=" flex items-center gap-4"
                            title={
                              <h6 >
                                {item?.__tbl_ecom_souscategory && item.__tbl_ecom_souscategory.souscategory
                                  ? item.__tbl_ecom_souscategory.souscategory
                                  : ""}
                              </h6>
                            }
                          // description={item?.__tbl_ecom_souscategory?.description}
                          />
                        </>
                      ),
                    },

                    //  {
                    //    title: "Date de création",
                    //    dataIndex: "date",
                    //    key: "date",

                    //    render: (_, item, index) => (
                    //      <a>{frenchFormattedDate(item?.createdAt)}</a>
                    //    ),
                    //  },
                    {
                      title: "Modifier",
                      key: "update",
                      dataIndex: "update",
                      align: "center",
                      render: (_, item) => (
                        <>
                          <Tag onClick={() => showElement(item)} color="green" className=" p-2 cursor-pointer">
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
                            title="Supprimer le produit"
                            description="Voulez-vous vraiment supprimer cet produit?"
                            okText="OUI"
                            cancelText="NON"
                            onConfirm={() => handleDelete(item?.id)}
                          >
                            <Tag color="volcano" className=" p-2 cursor-pointer">
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
                                <SheetTitle>Détail Produit</SheetTitle>
                                <SheetDescription>
                                  <div className=" w-full py-6 px-2 flex flex-col gap-8">
                                    <div className=" w-full flex justify-center">
                                      <Avatar
                                        src={`${baseURL}/${item?.image}`}
                                        className=" w-20 h-20"
                                      />
                                    </div>
                                    <div>
                                      <div className="overflow h-10">
                                        <div className="border-t border-gray-200  py-5 sm:p-0">
                                          <dl className="sm:divide-y sm:divide-gray-200">
                                            <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Designation
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                <strong>
                                                  {`${item?.produit}`}
                                                </strong>
                                              </dd>
                                            </div>
                                            <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Description
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {item?.description}
                                              </dd>
                                            </div>
                                            <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Catécogorie
                                              </dt>
                                              <dd className="mt-1  text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {`${item?.__tbl_ecom_category?.category ?? ""}`}<br />
                                                <small>{`${item?.__tbl_ecom_category?.description ?? ""}`}</small>
                                              </dd>
                                            </div>
                                            <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Sous Catégorie
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {item?.__tbl_ecom_souscategory?.souscategory ?? ""}<br />
                                                <small>{`${item?.__tbl_ecom_souscategory?.description ?? ""}`}</small>
                                                
                                              </dd>
                                            </div>
                                            <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Unité de mesure
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {item?.__tbl_ecom_unitesmesure?.unity}
                                              </dd>
                                            </div>
                                            <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Tva
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {item?.tva}
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

    <Drawer
      title="Modifier le produit"
      width={720}
      onClose={onClose}
      open={openUpdate}
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
            onClick={handleUpdate}
          >
            {loading ? (
              <Loader />
            ) : (
              "Modifier"
            )}
          </Button>
        </Space>
      }
    >
      <Form layout="vertical" hideRequiredMark form={formProduit}
        initialValues={{
          produit: produit1,
          image: image_default_name,
          description: description,
          id_unity: unitemesue,
          id_category: categ,
          id_souscategory: sousCateg,
          tva: tvap
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="produit"
              label="Designation Produit"
              rules={[
                {
                  required: true,
                  message: "Designation produit",
                },
              ]}
              initialValue={produit1}
            >
              <Input
                type="text"
                name="produit"
                value={produit1}
                onChange={handleChange}
                id="produit"
                placeholder="Designation produit"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="id_category"
              label="Catégories"
              rules={[{ required: true, message: "En sigle" }]}
            >
              <Select showSearch style={{ width: "100%" }} dropdownStyle={{ height: 200 }}

                placeholder="Selectionner categorie" optionFilterProp="children"

                filterOption={(input: string, option: any) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }

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
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="id_souscategory"
              label="Sous Catégories"
              rules={[
                {
                  required: true,
                  message: "Entrez la sous categorie",
                },
              ]}
            >
              <Select
                style={{ width: "100%" }}
                placeholder="Selectionnez"
                onChange={handleSousCategChange}

              >
                <Option selected value="">Liste...</Option>

                {selectedCategId &&
                  dataSousCategProduit?.data?.rows
                    .filter(
                      (item) => item.id_category === selectedCategId
                    )
                    .map((item, index) => (
                      <Option key={index} value={item.id}>
                        {item.souscategory}
                      </Option>
                    ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="id_unity"
              label="Unité de mesure"
              rules={[
                {
                  required: true,
                  message: "Entrez l'unite de mesure",
                },
              ]}
            >
              <Select
                style={{ width: "100%" }}
                placeholder="Selectionnez"
                onChange={handleUniteChange}
              >
                <Option selected value="">Liste...</Option>
                {
                  dataUnite &&
                    dataUnite !== undefined ?
                    dataUnite?.data?.rows?.map((item, i) => (
                      <Option key={i} value={item.id}>{item.unity}</Option>
                    ))
                    : ""
                }
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="tva"
              label="Tva"
              rules={[
                {
                  required: true,
                  message: "Entrez le tva",
                },
              ]}
            >
              <Input
                style={{ width: "100%" }}
                placeholder="Entrez le tva"
                name="tva"
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
                style={{ width: "100%" }}
                placeholder="Entrez la description"
                name="description"
                onChange={handleChange}
              />
            </Form.Item>
          </Col>

        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="image"
              label="Image Produit"
              rules={[
                {
                  required: true,
                  message: "Image produit",
                },
              ]}
            >
              <div className="col" style={{ marginTop: 15 }}>
                <Image
                  className='form-control'
                  src={image_default || image_default_name}
                  style={{ width: 150 }}
                  alt=""
                />
                <br />
                <label className={'badge bg-primary'} style={{ color: 'white' }}>
                  Attacher Image
                  <input type='file' style={{ display: 'none' }} onChange={handleImageUpload} />
                </label>
              </div>
            </Form.Item>
          </Col>

        </Row>

      </Form>
    </Drawer>
  </div>;
};

export default Home;
