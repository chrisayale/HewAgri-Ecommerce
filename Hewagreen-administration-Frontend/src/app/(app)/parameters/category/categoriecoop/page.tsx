"use client";
import useAuth from "@/controller/hooks/useAuth";
import LayoutCompWithTable from "@/view/model/LayoutCompWithTable";
import React, { useEffect, useState } from "react";
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
import { Col, Form, Input, List, Popconfirm, Row, Table, Tag } from "antd";
import { EditIcon, Trash2 } from "lucide-react";
import { _categorieCooperative, _deleteCategCooperative, _updateCategorieCooperative } from "@/controller/tanstack/categorieCooperative/getCategCooperative.service";
import { CatergorieCooperativeCredentials } from "@/types";
import useCategorieCooperative from "@/controller/tanstack/categorieCooperative/useCategorieCooperative";
// import { Input } from "@/components/ui/input";
import Loader from "@/components/global/loader/Loader";
import { generateCategCooperativePdf } from "@/components/docs/categcooperative";
import { FiPrinter } from "react-icons/fi";
import { useForm } from "antd/es/form/Form";
import SpinLoader from "@/components/global/lazy/SpinLoader";
import useDeleteCategCoop from "@/controller/tanstack/categorieCooperative/useDeleteCategCoop";
import useUpdateCategCoop from "@/controller/tanstack/categorieCooperative/useUpdateCategCoop";

const HomeCategorieCoop = () => {
  const { token } = useAuth();

  const { data: dataCategCooperative, isLoading: dataCategCooperativeLoad, refetch } = useQuery("auth-catgiecoop", () =>
    _categorieCooperative(token!)
  );

  const {
    mutateAsync: _deleteCategCooperative,
  } = useDeleteCategCoop();

  const {
    mutateAsync: _updateCategorieCooperative,
    isLoading: loadUpdate,
  } = useUpdateCategCoop();


  const [credentials, setCredentials] = useState<CatergorieCooperativeCredentials>({
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

  const { mutateAsync: _addCategorieCooperative, isLoading: loadAddCategCoop } = useCategorieCooperative()

  
  const handleSubmit = async () => {  
    try {
      await _addCategorieCooperative({ credentials: credentials, token: token! });
      refetch();
    } catch (error) {
      console.error("", error);
    }
  };
  const [searchedText, setSearchedText] = useState<string>("");
  const filteredData = dataCategCooperative?.data?.rows?.filter(
    (item: any): boolean => {
      return Object.keys(item).some((key: string) =>
        item[key]?.toString().toLowerCase().includes(searchedText.toLowerCase())
      );
    }
  );

  const [_selectedItem, setSelectedItem] = useState(null);

  const [formICategorieCooperative] = useForm<CatergorieCooperativeCredentials>()

  const handleOpenDialog = (item: any) => {
    setSelectedItem(item);
    formICategorieCooperative.setFieldsValue({
      category: item.category,
      description: item.description,
    });
  };
  //update categorie Cooperative
  const handleUpdateId = async (userId: number) => {
    const values: CatergorieCooperativeCredentials = await formICategorieCooperative.validateFields()
    await _updateCategorieCooperative({
      credentials: values, useid: userId,
      token: token!
    })
  }
  const handleDelete = async (userId: number) => {
    await _deleteCategCooperative({
      useid: userId,
      token: token!,
    });
  };

  return <div>
    <LayoutCompWithTable
      title="Listes des categorie coopératives"
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
                  <DialogTitle>Ajouter Categorie</DialogTitle>
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

            <Button onClick={() => generateCategCooperativePdf('Listes des categorie coopératives', filteredData)}><FiPrinter />Imprimer</Button>
          </div>

        </>
      }

      content={
        <>
          {
            dataCategCooperativeLoad ? (
              <SpinLoader />
            ) : (
              <>
                <Table
                  dataSource={filteredData}
                  loading={dataCategCooperativeLoad}
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
                              <Tag color="green" className="cursor-pointer p-2"
                                onClick={() => handleOpenDialog(item)}
                              >
                                <EditIcon size={16} />
                              </Tag>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Modifier Categorie</DialogTitle>
                                <DialogDescription>
                                  <Form layout="vertical" hideRequiredMark form={formICategorieCooperative}
                                    initialValues={{
                                      category: item?.category,
                                      description: item?.description,
                                    }}
                                  >
                                    <Row gutter={16}>
                                      <Col span={24}>
                                        <Form.Item
                                          name="category"
                                          label="category"
                                          rules={[
                                            {
                                              required: true,
                                              message: "Enter le nom",
                                            },
                                          ]}
                                        >
                                          <Input
                                            type="text"
                                            placeholder="Designation Categorie"
                                          />
                                        </Form.Item>
                                      </Col>
                                      <Col span={24}>
                                        <Form.Item
                                          name="description"
                                          label="Description"
                                          rules={[
                                            {
                                              required: true,
                                              message: "Enter le nom",
                                            },
                                          ]}
                                        >
                                          <Input
                                            type="text"
                                            id="description"
                                            placeholder="Designation Categorie"
                                          />
                                        </Form.Item>
                                      </Col>

                                      <Col span={24}>
                                        <Form.Item
                                          name=""
                                          label=""
                                         
                                        >
                                          <Button
                                            className="w-[100%]"
                                            onClick={() => handleUpdateId(item?.id)}>
                                            {loadUpdate ? <Loader /> : "Modifier"}
                                          </Button>

                                        </Form.Item>
                                      </Col>
                                    </Row>
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
                            title="Suppression Categorie Cooperative"
                            description="Voulez-vous vraiment supprimer le Categorie ??"
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
  </div>;
};

export default HomeCategorieCoop;
