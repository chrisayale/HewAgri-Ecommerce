"use client";
import useAuth from "@/controller/hooks/useAuth";
import { _addStocks, _stocks } from "@/controller/tanstack/stocks/getStocks.service";
import LayoutCompWithTable from "@/view/model/LayoutCompWithTable";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { Button } from "@/components/ui/button";
import { Avatar, Col, DatePicker, Drawer, Form, Input, List, Popconfirm, Row, Select, Space, Table, Tag } from "antd";
import { frenchFormattedDate } from "@/lib/dates";
import { ListCollapse, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ProduitPanier, StockCredentials } from "@/types";
import useStocks from "@/controller/tanstack/stocks/useStock";
import { _cooperative } from "@/controller/tanstack/cooperative/getCooperative.service";
const { Option } = Select;
import { Moment } from "moment";
import { _produit } from "@/controller/tanstack/produit/getProduit.service";
import { IoCloseOutline } from "react-icons/io5";
import Loader from "@/components/global/loader/Loader";
import { FiPrinter } from "react-icons/fi";
import SpinLoader from "@/components/global/lazy/SpinLoader";
import { generateFicheStockPdf } from "@/components/docs/fichestockpdf";

const HomeAllStock = () => {
  const { token } = useAuth();

  const { data: dataStock, isLoading: dataStockLoad } = useQuery("auth-stocks", () =>
    _stocks(token!)
  );

  const { data: dataCooperative } = useQuery("auth-coop", () =>
    _cooperative(token!)
  );

  const { data: dataProduit } = useQuery("auth-produit", () =>
    _produit(token!)
  );
  //Gestion panier
  const [idProduit, setIdProduit] = useState('')
  const [qte, setQte] = useState('');
  const [prixUnitaire, setPrixUnitaire] = useState('');
  const [currency, setCurrency] = useState('');
  const [panier, setPanier] = useState<ProduitPanier[]>([]);
  const [mappedRows, setMappedRows] = useState<any[]>([]);
  const {
    mutateAsync: _addStocks,
    isLoading: loadAddStock,
  } = useStocks();


  const [credentials, setCredentials] = useState<StockCredentials>({
    id_ccoperative: 0,
    description: "",
    date_production: "",
    date_expiration: "",
    items: []
  });


  const handleSubmit = async () => {
    await _addStocks({
      credentials: {
        id_ccoperative: credentials?.id_ccoperative,
        description: credentials?.description,
        date_production: credentials?.date_production,
        date_expiration: credentials?.date_expiration,
        items: panier
      },
      token: token!,
    });
  };

  const handleCoopChange = (value: number) => {
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      id_ccoperative: value,
    }));
  };

  const handleDateChange = (date: Moment | null, dateString: string | string[]) => {
    if (date) {
      const formattedDate = Array.isArray(dateString) ? dateString[0] : dateString;
      setCredentials((prevCredentials) => ({
        ...prevCredentials,
        date_production: formattedDate,
      }));
    }
  };

  const handleDateChange2 = (date: Moment | null, dateString: string | string[]) => {
    if (date) {
      const formattedDate = Array.isArray(dateString) ? dateString[0] : dateString;
      setCredentials((prevCredentials) => ({
        ...prevCredentials,
        date_expiration: formattedDate,
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const handleProduit = (value: string) => {
    setIdProduit(value);
  }


  const handleAjouterAuPanier = () => {
    // Vérifier si les champs sont vides
    if (idProduit === '' || qte === '' || prixUnitaire === '' || currency === '') {
      // Afficher un message d'erreur à l'utilisateur
      alert('Veuillez remplir tous les champs');
      return;
    }

    // Créez un nouvel objet représentant le produit
    const idProduitNumber = parseInt(idProduit, 10);
    const produitExiste = panier.find(produit => produit.id_produit === idProduitNumber);

    const nouveauProduit: ProduitPanier = {
      id_produit: parseInt(idProduit),
      qte: parseInt(qte),
      prix_unitaire: parseFloat(prixUnitaire),
      currency: currency
    };

    // Ajoutez le nouvel objet produit au panier
    if (!produitExiste) {
      setPanier([...panier, nouveauProduit]);
    }

    // Réinitialisez les valeurs des champs d'entrée
    setIdProduit('');
    setQte('');
    setPrixUnitaire('');
    setCurrency('');
  };

  const handleSupprimerProduit = (index: number) => {
    const nouveauPanier = [...panier];
    nouveauPanier.splice(index, 1);
    setPanier(nouveauPanier);
  };

  const [open, setOpen] = useState(false);
  // const showDrawer = () => {
  //   setOpen(true);
  // };
  const onClose = () => {
    setOpen(false);
  };

  const [searchedText, setSearchedText] = useState<string>("");
  const filteredData = dataStock?.data?.rows?.filter(
    (item: any): boolean => {
      return Object.keys(item).some((key: string) =>
        item[key]?.toString().toLowerCase().includes(searchedText.toLowerCase())
      );
    }
  );



  return <div>
    <LayoutCompWithTable
      title="Tout les stocks"
      btn={
        <>

          <div className="w-full md:w-auto md:mr-4 flex gap-4 items-center">
            <Input.Search
              placeholder="Rechercher un produit"
              className="placeholder:!text-xs"
              onSearch={(v) => setSearchedText(v)}
              onChange={(e) => setSearchedText(e.target.value)}
            />
            {/* <Button onClick={showDrawer}>Ajouter Stock</Button> */}

          </div>
          <Drawer
            title="Nouveau Stock"
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
                  {loadAddStock ? (
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
                        message: "Enter le nom de la coopérative",
                      },
                    ]}
                  >
                    <Select showSearch style={{ width: "100%" }} dropdownStyle={{ height: 200 }}

                      placeholder="Selectionner province" optionFilterProp="children"

                      filterOption={(input: string, option: any) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }


                      onChange={handleCoopChange}
                    >
                      <Option selected value="">Listes...
                      </Option>
                      {
                        dataCooperative?.data?.rows?.map((item, i) => (
                          <Option key={i} value={item.id}>{item.cooperative}</Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>



              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="date_production"
                    label="Date Production"
                    rules={[
                      {
                        required: true,
                        message: "Enter la date production",
                      },
                    ]}
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      getPopupContainer={(trigger) => trigger.parentElement!}
                      format="DD/MM/YYYY"
                      onChange={handleDateChange}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="date_expiration"
                    label="Date Expiration"
                    rules={[
                      {
                        required: true,
                        message: "Entrez la date expiration",
                      },
                    ]}
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      getPopupContainer={(trigger) => trigger.parentElement!}
                      format="DD/MM/YYYY"
                      onChange={handleDateChange2}
                    />
                  </Form.Item>
                </Col>

              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="produit"
                    label="Produit"
                    rules={[
                      {
                        required: true,
                        message: "Enter le nom le produit",
                      },
                    ]}
                  >
                    <Select showSearch style={{ width: "100%" }} dropdownStyle={{ height: 200 }}

                      placeholder="Selectionner produit" optionFilterProp="children"

                      filterOption={(input: string, option: any) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }

                      onChange={handleProduit}
                    >
                      <Option selected value="">Listes...
                      </Option>
                      {
                        dataProduit?.data?.rows?.map((item, i) => (
                          <Option key={i} value={item.id}> {`${item.produit}   (${item.__tbl_ecom_unitesmesure?.unity || 'N/A'}) `}</Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="qte"
                    label="Qte"
                    rules={[
                      {
                        required: true,
                        message: "Entrez la qte",
                      },
                    ]}
                  >
                    <Input
                      type="number"
                      style={{ width: "100%" }}
                      placeholder="Qte"
                      value={qte} onChange={(e) => setQte(e.target.value)}

                    />
                  </Form.Item>
                </Col>

              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="prix"
                    label="Prix Unitaire"
                    rules={[
                      {
                        required: true,
                        message: "Entrez prix unitaire",
                      },
                    ]}
                  >
                    <Input
                      style={{ width: "100%" }}
                      placeholder="prix"
                      name="prix"
                      value={prixUnitaire} onChange={(e) => setPrixUnitaire(e.target.value)}
                    />
                  </Form.Item>
                </Col>


                <Col span={12}>
                  <Form.Item
                    name="devise"
                    label="Devise"
                    rules={[
                      {
                        required: true,
                        message: "Entrez la devise",
                      },
                    ]}
                  >
                    <Select style={{ width: '100%' }}
                      value={currency}
                      onChange={(value) => {
                        setCurrency(value);
                      }}
                    >
                      <Option >Devise</Option>
                      <Option value='CDF'>CDF</Option>
                      <Option value='USD'>USD</Option>
                    </Select>
                  </Form.Item>
                </Col>

              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Button onClick={handleAjouterAuPanier}>Ajout Pannier</Button>
                </Col>

              </Row>



              {panier.map((produit, index) => (
                <>
                  <Row gutter={16}>
                    <Col span={6}>
                      <Form.Item
                        label="Produit"
                        rules={[
                          {
                            required: true,
                            message: "Entrez la qte",
                          },
                        ]}
                      >
                        <Input
                          style={{ width: "100%" }}
                          placeholder="Qte"
                          value={dataProduit?.data?.rows?.find((el) => el.id === produit.id_produit)?.produit}

                        />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        label="Qte"
                        rules={[
                          {
                            required: true,
                            message: "Entrez la qte",
                          },
                        ]}
                      >
                        <Input
                          type="number"
                          style={{ width: "100%" }}
                          placeholder="Qte"
                          value={produit.qte}

                        />
                      </Form.Item>
                    </Col>

                    <Col span={6}>
                      <Form.Item
                        label="Prix Unitaire"
                        rules={[
                          {
                            required: true,
                            message: "Entrez la qte",
                          },
                        ]}
                      >
                        <Input
                          type="number"
                          style={{ width: "100%" }}
                          placeholder="Qte"
                          value={produit.prix_unitaire}

                        />
                      </Form.Item>
                    </Col>

                    <Col span={3}>
                      <Form.Item
                        label="Produit"
                        rules={[
                          {
                            required: true,
                            message: "Entrez la qte",
                          },
                        ]}
                      >
                        <Input
                          style={{ width: "100%" }}
                          placeholder="Qte"
                          value={produit.currency}

                        />
                      </Form.Item>
                    </Col>

                    <Col span={3}>
                      <Form.Item
                        label="exit"
                      >

                        <Button onClick={() => handleSupprimerProduit(index)}><IoCloseOutline className="text-2xl" /></Button>
                      </Form.Item>
                    </Col>

                  </Row>
                </>

              ))}



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

            </Form>
          </Drawer>
        </>
      }

      content={
        <div>
          {
            dataStockLoad ? (
              <SpinLoader />
            ) : (
              <>
                <Table
                  dataSource={filteredData}
                  loading={dataStockLoad}
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
                      title: "Coopérative",
                      dataIndex: "coop",
                      key: "coop",
                      render: (_, item) => (
                        <>
                          <List.Item.Meta
                            className=" flex items-center gap-4"
                            avatar={<Avatar />}
                            title={
                              <strong >
                                {`${item?.__tbl_ecom_cooperative?.cooperative}`}
                              </strong>
                            }
                            description={item?.__tbl_ecom_cooperative?.phone}
                          />
                        </>
                      ),
                    },


                    {
                      title: "Qte en stock",
                      dataIndex: "qte",
                      key: "qte",
                      render: (_, item) => (
                        <>
                          <List.Item.Meta
                            className=" flex items-center gap-4"
                            title={
                              <h6 >
                                {`${item?.__tbl_ecom_produits?.length}`} Produit
                              </h6>
                            }
                          />
                        </>
                      ),
                    },

                    {
                      title: "Date Approv",
                      dataIndex: "categ",
                      key: "categ",
                      render: (_, item) => (
                        <>
                          <List.Item.Meta
                            className=" flex items-center gap-4"
                            title={
                              <a >
                                {`${frenchFormattedDate(item?.createdAt)}`}
                              </a>
                            }
                          // description={item?.__tbl_ecom_category?.description}
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
                      title: "Supprimer",
                      key: "delete",
                      align: "center",
                      render: (_,) => (
                        <>
                          <Popconfirm
                            placement="bottom"
                            title="Suppression utilisateur"
                            description="Voulez-vous vraiment supprimer cet utilisateur"
                            okText="OUI"
                            cancelText="NON"
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
                                <SheetTitle>Détail Stock</SheetTitle>
                                <SheetDescription>
                                  <div className=" w-full py-6 px-2 flex flex-col gap-8">

                                    <div>
                                      <div className="overflow h-10">
                                        <div className="border-t border-gray-200  py-5 sm:p-0">
                                          <dl className="sm:divide-y sm:divide-gray-200">
                                            <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Coopérative
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                <strong>
                                                  {`${item?.__tbl_ecom_cooperative?.cooperative}`}
                                                </strong>
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
                                            <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Num.Enreg
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {item?.__tbl_ecom_cooperative?.num_enregistrement}
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
                                            <div className="py-1 sm:py-2 ">
                                              <LayoutCompWithTable
                                                title={<>
                                                  <div className="flex justify-between items-center">
                                                    <p className="font-semibold">Listes des Produits</p>
                                                    
                                                  </div>
                                                </>}
                                                btn={<p>
                                                  <Button onClick={() => generateFicheStockPdf('Liste des Produits', `${item?.__tbl_ecom_cooperative?.cooperative}`, item.__tbl_ecom_produits)}>
                                                    <FiPrinter /> Imprimer
                                                  </Button>
                                                </p>}
                                                content={
                                                  <>
                                                    <Table
                                                      dataSource={item.__tbl_ecom_produits}
                                                      loading={dataStockLoad}
                                                      className=" h-[70vh] overflow-auto"

                                                      columns={[
                                                        {
                                                          title: "N°",
                                                          dataIndex: "index",
                                                          key: "index",
                                                          render: (_, __, index) => index + 1,
                                                          width: "1rem",
                                                        },
                                                        {
                                                          title: "Produit",
                                                          dataIndex: "date",
                                                          key: "date",

                                                          render: (_, item, index) => (
                                                            <a>{item.produit}</a>
                                                          ),
                                                        },

                                                        {
                                                          title: "Qte",
                                                          dataIndex: "qte",
                                                          key: "qte",

                                                          render: (_, item, index) => (
                                                            <a>{item.__tbl_ecom_hasproducts.qte}</a>
                                                          ),

                                                        },
                                                        {
                                                          title: "P.U",
                                                          dataIndex: "pu",
                                                          key: "pu",

                                                          render: (_, item, index) => (
                                                            <a>{item.__tbl_ecom_hasproducts.prix_unitaire} {item.__tbl_ecom_hasproducts.currency}</a>
                                                          ),
                                                          width: "10rem",
                                                        },
                                                        {
                                                          title: "Commission",
                                                          dataIndex: "pt",
                                                          key: "pt",

                                                          render: (_, item, index) => (
                                                            <a>{item.__tbl_ecom_hasproducts.prix_plus_commission} {item.__tbl_ecom_hasproducts.currency}</a>
                                                          ),
                                                        },
                                                      ]}
                                                    />
                                                  </>
                                                }

                                              />
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
            )}
        </div>
      }


    />
  </div>;
};

export default HomeAllStock;
