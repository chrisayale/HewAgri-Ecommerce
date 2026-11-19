"use client";
import useAuth from "@/controller/hooks/useAuth";
import { _addCategorieProduit, _categorieProduit } from "@/controller/tanstack/categorieProduit/getCategProduit.service";
import LayoutCompWithTable from "@/view/model/LayoutCompWithTable";
import React, { useState } from "react";
import { useQuery } from "react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, Input, List, Popconfirm, Table, Tag } from "antd";
import { EditIcon, Trash2 } from "lucide-react";
import { CategorieProduitCredentials } from "@/types";
import useCategorieProduit from "@/controller/tanstack/categorieProduit/useCategorieProduit";
import Loader from "@/components/global/loader/Loader";
import { generateCategProduitPdf } from "@/components/docs/categproduit";
import { FiPrinter } from "react-icons/fi";
import SpinLoader from "@/components/global/lazy/SpinLoader";
// import { Input } from "@/components/ui/input";
import { useForm } from "antd/es/form/Form";
import useDeleteCategProduit from "@/controller/tanstack/categorieProduit/useDeleteCategProduit";
import useUpdateCategProduit from "@/controller/tanstack/categorieProduit/useUpdateCategProduit";


const HomeCategorieProduit = () => {
  const { token } = useAuth();

  const { data: dataCategProduit, isLoading: dataCategProduitLoad, refetch } = useQuery("auth-produit-cat", () =>
    _categorieProduit(token!)
  );

  const [credentials, setCredentials] = useState<CategorieProduitCredentials>({
    category: "",
    description: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const { mutateAsync: _addCategorieProduit, isLoading: loadAddCategCoop } = useCategorieProduit()

  const handleSubmit = async () => {
    try {
      await _addCategorieProduit({ credentials: credentials, token: token! });
      setCredentials({
        ...credentials,
        category: "",
        description: ""
      });
      refetch()
    } catch (error) {
      console.error("Error :", error);
    }

  };

  const [searchedText, setSearchedText] = useState<string>("");
  const filteredData = dataCategProduit?.data?.rows?.filter(
    (item: any): boolean => {
      return Object.keys(item).some((key: string) =>
        item[key]?.toString().toLowerCase().includes(searchedText.toLowerCase())
      );
    }
  );

  const {
    mutateAsync: _deleteCategProduit
  } = useDeleteCategProduit();

  const handleDelete = async (id: number) => {
    try {
      await _deleteCategProduit({ useid: id, token: token! });
      dataCategProduit
    } catch (error) {

    }

  };

  const [_selectedItem, setSelectedItem] = useState(null);

  const [formICategUpdata] = useForm<CategorieProduitCredentials>()

  const handleOpenDialog = (item: any) => {
    setSelectedItem(item);
    formICategUpdata.setFieldsValue({
      category: item.category,
      description: item.description,
    });
  };

  const {
    mutateAsync: updateCategProduit,
    isLoading: loadUpdate,
  } = useUpdateCategProduit();


  const handleUpdateId = async (useid: number) => {
    const values: CategorieProduitCredentials = await formICategUpdata.validateFields()
    try {

      await updateCategProduit({ credentials: values, useid: useid, token: token! })
      setCredentials({
        ...credentials,
        category: "",
        description: ""
      });
      dataCategProduit
    } catch (error) {
      console.error("Error :", error);
    }

  }

  return <div>
    <LayoutCompWithTable
      title="Listes des catégories produits"
      btn={
        <>
          <div className="w-full md:w-auto md:mr-4 flex gap-4 items-center">
            <Input.Search
              placeholder="Rechercher un utilisateur"
              className="placeholder:!text-xs"
              onSearch={(v) => setSearchedText(v)}
              onChange={(e) => setSearchedText(e.target.value)}
            />

            <Dialog>
              <DialogTrigger>
                <Button>Ajouter Categorie</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter categorie produit</DialogTitle>
                  <DialogDescription>
                    <div className="w-full py-2 px-2 flex flex-col gap-8">
                      <div className="border-t border-gray-200  py-5 sm:p-0">
                        <dl className="">
                          <div className="w-[100%] mt-2">
                            <div className="py-3 sm:py-1 sm:grid sm:grid-rows-1 sm:gap-1 ">
                              <dt className="text-sm font-medium text-gray-500">
                                Designation
                              </dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <Input
                                  type="text"
                                  name="category"
                                  value={credentials.category}
                                  onChange={handleChange}
                                  id="category"
                                  placeholder="Designation Categorie"
                                />
                              </dd>
                            </div>
                          </div>
                          <div className="w-[100%] mt-2">
                            <div className="py-3 sm:py-1 sm:grid sm:grid-rows-1 sm:gap-1 ">
                              <dt className="text-sm font-medium text-gray-500">
                                Description
                              </dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <Input
                                  type="text"
                                  name="description"
                                  value={credentials.description}
                                  onChange={handleChange}
                                  id="description"
                                  placeholder="Designation Categorie"
                                />
                              </dd>
                            </div>
                          </div>

                          <div className="w-[100%] mt-5">
                            <div className="py-3 sm:py-1 sm:gap-1 ">
                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <Button
                                  type="submit"
                                  className="w-[100%]"
                                  onClick={() => handleSubmit()}
                                >
                                  {loadAddCategCoop ? (
                                    <Loader />
                                  ) : (
                                    " Enregistrer"
                                  )}
                                </Button>
                              </dd>
                            </div>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </DialogDescription>
                </DialogHeader>

              </DialogContent>
            </Dialog>

            <Button onClick={() => generateCategProduitPdf('Listes des categorie produits', filteredData)}><FiPrinter />Imprimer</Button>
          </div>
        </>
      }

      content={
        <>
          {
            dataCategProduitLoad ? (
              <SpinLoader />
            ) : (
              <>
                <Table
                  dataSource={filteredData}
                  loading={dataCategProduitLoad}
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
                      title: "Catégories",
                      dataIndex: "role",
                      key: "role",
                      render: (_, item, _index) => (
                        <>
                          <List.Item.Meta
                            className=" flex items-center gap-4"
                            // avatar={<Avatar src={`${baseURL}/${item?.avatar}`} />}
                            title={<strong>{`${item?.category}`}</strong>}
                          // description={item?.description}
                          />
                        </>
                      ),
                    },

                    {
                      title: "Déscription",
                      dataIndex: "date",
                      key: "date",

                      render: (_, item, _index) => (
                        <a>{item?.description}</a>
                      ),
                    },
                    {
                      title: "Modifier",
                      key: "update",
                      dataIndex: "update",
                      align: "center",
                      render: (_, item, _index) => (
                        <>

                          <Dialog>
                            <DialogTrigger>
                              <Tag color="green" className=" p-2"
                                onClick={() => handleOpenDialog(item)}
                              >
                                <EditIcon size={16} />
                              </Tag>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Modifier categorie produit</DialogTitle>
                                <DialogDescription>
                                  <Form layout="vertical" hideRequiredMark form={formICategUpdata}
                                    initialValues={{
                                      category: item?.category,
                                      description: item?.description
                                    }}
                                  >
                                    <div className="w-full py-2 px-2 flex flex-col gap-8">
                                      <div className="h-[60vh] overflow-auto border-t border-gray-200  py-5 sm:p-0">
                                        <dl className="">
                                          <div className="w-[100%] mt-2">
                                            <div className="py-3 sm:py-1 sm:grid sm:grid-rows-1 sm:gap-1 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Designation
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                <Form.Item
                                                  name="category"
                                                  rules={[
                                                    {
                                                      required: true,
                                                      message: "Enter le nom",
                                                    },
                                                  ]}
                                                >
                                                  <Input
                                                    type="text"
                                                    name="category"
                                                    value={credentials.category}
                                                    onChange={handleChange}
                                                    id="category"
                                                    placeholder="Designation Categorie"
                                                  />
                                                </Form.Item>

                                              </dd>
                                            </div>
                                          </div>
                                          <div className="w-[100%] mt-2">
                                            <div className="py-3 sm:py-1 sm:grid sm:grid-rows-1 sm:gap-1 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Description
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                <Form.Item
                                                  name="description"
                                                  rules={[
                                                    {
                                                      required: true,
                                                      message: "Enter le nom",
                                                    },
                                                  ]}
                                                >
                                                  <Input
                                                    type="text"
                                                    name="description"
                                                    value={credentials.description}
                                                    onChange={handleChange}
                                                    id="description"
                                                    placeholder="Designation Categorie"
                                                  />
                                                </Form.Item>

                                              </dd>
                                            </div>
                                          </div>

                                          <div className="w-[100%] mt-5">
                                            <div className="py-3 sm:py-1 sm:gap-1 ">
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                <Button
                                                  className="w-[100%]"
                                                  onClick={() => handleUpdateId(item?.id)}>
                                                  {loadUpdate ? <Loader /> : "Modifier"}
                                                </Button>
                                              </dd>
                                            </div>
                                          </div>
                                        </dl>
                                      </div>
                                    </div>
                                  </Form>

                                </DialogDescription>
                              </DialogHeader>

                            </DialogContent>
                          </Dialog>
                        </>
                      ),
                    },
                    {
                      title: "Supprimer",
                      key: "delete",
                      align: "center",
                      render: (_, item, _index) => (
                        <>
                          <Popconfirm
                            placement="bottom"
                            title="Suppremer la categorie produit"
                            description="Voulez-vous vraiment supprimer le produit"
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
  </div>;
};

export default HomeCategorieProduit;
