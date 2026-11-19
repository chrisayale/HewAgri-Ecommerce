"use client";
import useAuth from "@/controller/hooks/useAuth";
import { _uniteMesure } from "@/controller/tanstack/uniteMesure/getUniteMesure.service";
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
import { UniteMesureCrendentials } from "@/types";
import useUniteMesure from "@/controller/tanstack/uniteMesure/useUniteMesure";
// import { Input } from "@/components/ui/input";
import Loader from "@/components/global/loader/Loader";
import { FiPrinter } from "react-icons/fi";
import { generateUniterPdf } from "@/components/docs/uniterpdf";
import SpinLoader from "@/components/global/lazy/SpinLoader";
import useDeleteUniteMesure from "@/controller/tanstack/uniteMesure/useDeleteUniteMesure";
import { useForm } from "antd/es/form/Form";
import _useUpdateUniteMesure from "@/controller/tanstack/uniteMesure/useUpdateUniteMesure";

const HomeUniteMesure = () => {
  const { token } = useAuth();

  const { data: dataUnite, isLoading: dataUniteLoad, refetch } = useQuery("auth-uniter", () =>
    _uniteMesure(token!)
  );

  const [credentials, setCredentials] = useState<UniteMesureCrendentials>({
    unity: "",
    equival_kgs: 0,
    description: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const { mutateAsync: _addUniteMesure, isLoading: loadUniteMesure, error } = useUniteMesure()

  const handleSubmit = async () => {
    try {
      await _addUniteMesure({ credentials: credentials, token: token! });
      setCredentials({
        ...credentials,
        unity: "",
        equival_kgs: 0,
        description: "",
      });
      refetch();
    } catch (error) {
      console.error("Error :", error);
    }
  };

  const [searchedText, setSearchedText] = useState<string>("");
  const filteredData = dataUnite?.data?.rows?.filter(
    (item: any): boolean => {
      return Object.keys(item).some((key: string) =>
        item[key]?.toString().toLowerCase().includes(searchedText.toLowerCase())
      );
    }
  );

  const {
    mutateAsync: _deleteUnite
  } = useDeleteUniteMesure();

  const handleDelete = async (id: number) => {

    try {
      await _deleteUnite({ useid: id, token: token! });
      refetch
    } catch (error) {

    }
  };

  const [_selectedItem, setSelectedItem] = useState(null);
  const [formIUniteUpdata] = useForm<UniteMesureCrendentials>()

  const handleOpenDialog = (item: any) => {
    setSelectedItem(item);
    formIUniteUpdata.setFieldsValue({
      unity: item.unity,
      equival_kgs: item.equival_kgs,
      description: item.description,
    });
  };

  const {
    mutateAsync: updateUnite,
    isLoading: loadUpdate,
  } = _useUpdateUniteMesure();


  const handleUpdateId = async (roleid: number) => {
    const values: UniteMesureCrendentials = await formIUniteUpdata.validateFields()
    try {
      await updateUnite({
        credentials: values, roleid: roleid,
        token: token!
      })

      setCredentials({
        ...credentials,
        unity: "",
        equival_kgs: 0,
        description: "",
      });
      refetch
    } catch (error) {

    }

  }

  return <div>
    <LayoutCompWithTable
      title="Unite de mesure"
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
                <Button>Ajouter Unité mesure</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter Unité mesure</DialogTitle>
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
                                  name="unity"
                                  value={credentials.unity}
                                  onChange={handleChange}
                                  id="unity"
                                  placeholder="Unite de mesure"
                                />
                              </dd>
                            </div>
                          </div>

                          <div className="w-[100%] mt-2">
                            <div className="py-3 sm:py-1 sm:grid sm:grid-rows-1 sm:gap-1 ">
                              <dt className="text-sm font-medium text-gray-500">
                                Equvallent/KGS
                              </dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <Input
                                  type="text"
                                  name="equival_kgs"
                                  value={credentials.equival_kgs}
                                  onChange={handleChange}
                                  id="equival_kgs"
                                  placeholder="Equvallent en KGS"
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
                                  placeholder="Description"
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
                                  {loadUniteMesure ? (
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

            <Button onClick={() => generateUniterPdf('Unite de mesure', filteredData)}><FiPrinter />Imprimer</Button>
          </div>

        </>
      }

      content={
        <>
          {
            dataUniteLoad ? (
              <SpinLoader />
            ) : (
              <>
                <Table
                  dataSource={filteredData}
                  loading={dataUniteLoad}
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
                      title: "Unite de mesure",
                      dataIndex: "type",
                      key: "type",
                      render: (_, item) => (
                        <>
                          <List.Item.Meta
                            className=" flex items-center gap-4"
                            title={<strong>{`${item?.unity}`}</strong>}

                          />
                        </>
                      ),
                    },

                    {
                      title: "Déscription",
                      dataIndex: "desc",
                      key: "desc",

                      render: (_, item) => (
                        <a>{item?.description}</a>
                      ),
                    },

                    {
                      title: "Equival kgs",
                      dataIndex: "kgs",
                      key: "kgs",

                      render: (_, item) => (
                        <a>{item?.equival_kgs}</a>
                      ),
                    },

                    {
                      title: "Modifier",
                      key: "update",
                      dataIndex: "update",
                      align: "center",
                      render: (_, item) => (
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
                                <DialogTitle>Modifier Unité mesure</DialogTitle>
                                <DialogDescription>
                                  <Form layout="vertical" hideRequiredMark form={formIUniteUpdata}
                                    initialValues={{
                                      unity: item?.unity,
                                      equival_kgs: item?.equival_kgs,
                                      description: item?.description,
                                    }}
                                  >
                                    <div className="w-full py-2 px-2 flex flex-col gap-8">
                                      <div className="border-t border-gray-200  py-5 sm:p-0">
                                        <dl className="">
                                          <div className="w-[100%] mt-2">
                                            <div className="py-3 sm:py-1 sm:grid sm:grid-rows-1 sm:gap-1 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Designation
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                <Form.Item
                                                  name="unity"
                                                  rules={[
                                                    {
                                                      required: true,
                                                      message: "Enter le nom",
                                                    },
                                                  ]}
                                                >
                                                  <Input
                                                    type="text"
                                                    name="unity"
                                                    value={credentials.unity}
                                                    onChange={handleChange}
                                                    id="unity"
                                                    placeholder="Unite de mesure"
                                                  />

                                                </Form.Item>

                                              </dd>
                                            </div>
                                          </div>

                                          <div className="w-[100%] mt-2">
                                            <div className="py-3 sm:py-1 sm:grid sm:grid-rows-1 sm:gap-1 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Equvallent/KGS
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                <Form.Item
                                                  name="equival_kgs"
                                                  rules={[
                                                    {
                                                      required: true,
                                                      message: "Enter le nom",
                                                    },
                                                  ]}
                                                >
                                                  <Input
                                                    type="text"
                                                    name="equival_kgs"
                                                    value={credentials.equival_kgs}
                                                    onChange={handleChange}
                                                    id="equival_kgs"
                                                    placeholder="Equvallent en KGS"
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
                                                    placeholder="Description"
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
                      render: (_, item) => (
                        <>
                          <Popconfirm
                            placement="bottom"
                            title="Suppression unite de mesure"
                            description="Voulez-vous vraiment supprimer unite de mesure"
                            okText="OUI"
                            cancelText="NON"
                            onConfirm={() => handleDelete(item?.id)}
                          >

                            <Tag color="volcano" className="cursor-pointer p-2"
                            >
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

export default HomeUniteMesure;
