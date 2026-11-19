"use client";
import useAuth from '@/controller/hooks/useAuth';
import { _taux } from '@/controller/tanstack/taux/getTaux.service';
import React from 'react'
import { useQuery } from 'react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import LayoutCompWithTable from '@/view/model/LayoutCompWithTable';
import { List, Table, Tag } from 'antd';
import { EditIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SpinLoader from '@/components/global/lazy/SpinLoader';

const HomeTaux = () => {

  const { token } = useAuth();
  const { data: dataTaux, isLoading: dataTauxLoad ,refetch} = useQuery(
    "auth-taux",
    () => _taux(token!)
  );
  const dataSource = dataTaux?.data ? [dataTaux.data] : undefined;


  return (
    <div>
      <LayoutCompWithTable
        title="Liste des rôles"
        btn={
          <>
            <Dialog>
              <DialogTrigger>
                <Button>Configurer Taux</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Configurer Taux</DialogTitle>
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
                                  id="role"
                                  placeholder="Designation role"
                                />
                              </dd>
                            </div>
                          </div>

                          <div className="w-[100%] mt-5">
                            <div className="py-3 sm:py-1 sm:gap-1 ">
                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {/* <Button
                                  //   type="submit"
                                  className="w-[100%]"
                                  onClick={() => handleSubmit()}
                                >
                                  {loadAddrole ? (
                                    <Loader />
                                  ) : (
                                    " Enregistrer"
                                  )} 
                                </Button> */}
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
          </>
        }
        content={
          <>
            {
              dataTauxLoad ? (
                <SpinLoader />
              ) : (
                <>
                  <Table
                    dataSource={dataSource}
                    loading={dataTauxLoad}
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
                        title: "Taux d'echange",
                        dataIndex: "taux",
                        key: "taux",
                        render: (_, item) => (
                          <>
                            <List.Item.Meta
                              className=" flex items-center gap-4"
                              // avatar={<Avatar src={`${baseURL}/${item?.avatar}`} />}
                              title={<strong>{`${item?.taux_change}`}</strong>}
                            // description={item?.description}
                            />
                          </>
                        ),
                      },



                      {
                        title: "Commission",
                        dataIndex: "comm",
                        key: "comm",

                        render: (_, item) => (
                          <a>{item?.commission_price}</a>
                        ),
                      },
                      // {
                      //   title: "Modifier",
                      //   key: "update",
                      //   dataIndex: "update",
                      //   align: "center",
                      //   render: (_,) => (
                      //     <>
                      //       <Tag color="green" className=" p-2">
                      //         <EditIcon size={16} />
                      //       </Tag>
                      //     </>
                      //   ),
                      // },

                    ]}
                  />
                </>
              )
            }
          </>

        }
      />
    </div>
  )
}

export default HomeTaux