"use client";
import { Button } from "@/components/ui/button";
import useAuth from "@/controller/hooks/useAuth";
import { frenchFormattedDate } from "@/lib/dates";
import LayoutCompWithTable from "@/view/model/LayoutCompWithTable";
import { Form, Input, List, Popconfirm, Table, Tag } from "antd";
import { EditIcon, Trash2 } from "lucide-react";
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
// import { Input } from "@/components/ui/input";
import { RoleCredentials, RoleCredentialsUpdated } from "@/types";
import { _addRole, _roles } from "@/controller/tanstack/role/getRole.service";
import useRole from "@/controller/tanstack/role/useRole";
import Loader from "@/components/global/loader/Loader";
import { generateRolePdf } from "@/components/docs/rolepdf";
import { FiPrinter } from "react-icons/fi";
import SpinLoader from "@/components/global/lazy/SpinLoader";
import useDeleteRole from "@/controller/tanstack/role/useDeleteRole";
import { useForm } from "antd/es/form/Form";
import _useUpdateRole from "@/controller/tanstack/role/useUpdateRole";

const HomeRoles = () => {
  const { token } = useAuth();
  const { data: dataRole, isLoading: dataRoleLoad , refetch} = useQuery(
    "auth-role",
    () => _roles(token!)
  );

  const [credentials, setCredentials] = useState<RoleCredentials>({
    role: "",
  });

  const [credentials1, setCredentials1] = useState<RoleCredentialsUpdated>({
    role: "",
    description: "",
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };
  const { mutateAsync: _addRole, isLoading: loadAddrole } = useRole();

  const handleSubmit = async () => {
    console.log({ credentials: credentials, token: token! });
    
    try {
      await _addRole({ credentials: credentials, token: token! });
      setCredentials({
        ...credentials,
        role: ""
      });
      dataRole
      refetch();
    } catch (error) {
      
    }
  };

  const [searchedText, setSearchedText] = useState<string>("");
  const filteredData = dataRole?.data?.rows?.filter(
    (item: any): boolean => {
      return Object.keys(item).some((key: string) =>
        item[key]?.toString().toLowerCase().includes(searchedText.toLowerCase())
      );
    }
  );

  const {
    mutateAsync: _deleteRole
  } = useDeleteRole();

  const handleDelete = async (id: number) => {
    try {
      await _deleteRole({ useid: id, token: token! });
      dataRole
      refetch();
    } catch (error) {
      
    }
    
  };

  const [_selectedItem, setSelectedItem] = useState(null);

  const [formIRoleUpdata] = useForm<RoleCredentialsUpdated>()

  const handleOpenDialog = (item: any) => {
    setSelectedItem(item);
    formIRoleUpdata.setFieldsValue({
      role: item.role,
      description: item.description,
    });
  };

  const {
    mutateAsync: updateRole,
    isLoading: loadUpdate,
  } = _useUpdateRole();


  const handleUpdateId = async (roleid: number) => {
    const values: RoleCredentialsUpdated = await formIRoleUpdata.validateFields()
    try {

      await updateRole({credentials1: values, roleid: roleid, token: token!})
      setCredentials1({
        ...credentials1,
        role: "",
        description: ""
      });
      dataRole
      refetch();
    } catch (error) {
      console.error("Error :", error);
    }
   
  }

  return (
    <div>
      <LayoutCompWithTable
        title="Liste des rôles"
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
                  <Button>Ajouter un rôle</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajouter un rôle</DialogTitle>
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
                                    name="role"
                                    value={credentials.role}
                                    onChange={handleChange}
                                    id="role"
                                    placeholder="Designation role"
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
                                    {loadAddrole ? (
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

              <Button onClick={() => generateRolePdf('Listes des rôles', filteredData)}><FiPrinter />Imprimer</Button>
            </div>

          </>
        }
        content={
          <>
            {
              dataRoleLoad ? (
                <SpinLoader />
              ) : (
                <>
                  <Table
                    dataSource={filteredData}
                    loading={dataRoleLoad}
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
                        title: "Designation rôle",
                        dataIndex: "role",
                        key: "role",
                        render: (_, item) => (
                          <>
                            <List.Item.Meta
                              className=" flex items-center gap-4"
                              // avatar={<Avatar src={`${baseURL}/${item?.avatar}`} />}
                              title={<strong>{`${item?.role}`}</strong>}
                            // description={item?.description}
                            />
                          </>
                        ),
                      },

                      {
                        title: "Déscription",
                        dataIndex: "date",
                        key: "date",

                        render: (_, item) => (
                          <a>{item?.description}</a>
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
                                  <DialogTitle>Modifier rôle</DialogTitle>
                                  <DialogDescription>
                                    <Form layout="vertical" hideRequiredMark form={formIRoleUpdata}
                                      initialValues={{
                                        role: item?.role,
                                        description: item?.description
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
                                                  {/* <Input
                                                    type="text"
                                                    name="role"
                                                    value={credentials.role}
                                                    onChange={handleChange}
                                                    id="role"
                                                    placeholder="Designation role"
                                                  /> */}
                                                  <Form.Item
                                                    name="role"
                                                    rules={[
                                                      {
                                                        required: true,
                                                        message: "Enter le nom",
                                                      },
                                                    ]}
                                                  >
                                                    <Input
                                                      type="text"
                                                      placeholder="Designation role"
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
                                                  {/* <Input
                                                    type="text"
                                                    name="role"
                                                    value={credentials.role}
                                                    onChange={handleChange}
                                                    id="role"
                                                    placeholder="Designation role"
                                                  /> */}

                                                  <Form.Item
                                                    name="description"
                                                    rules={[
                                                      {
                                                        required: true,
                                                        message: "Enter le nom",
                                                      },
                                                    ]}
                                                  >
                                                    <Input.TextArea
                                                      rows={4}
                                                      placeholder="Description role"
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
                              title="Supprimer le role"
                              description="Voulez-vous vraiment supprimer le role"
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
    </div>
  );
};

export default HomeRoles;
