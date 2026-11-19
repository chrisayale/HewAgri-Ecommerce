"use client";
import SpinLoader from '@/components/global/lazy/SpinLoader';
import useAuth from '@/controller/hooks/useAuth';
import { _payement } from '@/controller/tanstack/payement/getPayment.service';
import LayoutCompWithTable from '@/view/model/LayoutCompWithTable';
import { Avatar, Input, List, Table, Tag } from 'antd';
import React, { useState } from 'react'
import { useQuery } from 'react-query';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ListCollapse } from 'lucide-react';
import { _produit } from '@/controller/tanstack/produit/getProduit.service';
import { _typeLivraison } from '@/controller/tanstack/typeLivraison/getTypeLivraison.service';
import { FiPrinter } from 'react-icons/fi';
import { generateFichePaimentPdf } from '@/components/docs/fichePaiementpdf';

const Home = () => {
  const { token } = useAuth();
  const { data: dataPayement, isLoading: dataPayementLoad } = useQuery(
    "auth-taux",
    () => _payement(token!)
  );
  const { data: dataType, isLoading: dataTypeLivraison } = useQuery("auth-typelivrai", () =>
    _typeLivraison(token!)
  );

  const { data: dataProduit, isLoading: dataProduitLoad } = useQuery("auth-produits", () =>
    _produit(token!)
  );

  const getProductNameById = (id: number) => {
    const product = dataProduit?.data?.rows?.find(p => p.id === id);
    return product ? product?.produit : 'Produit non trouver';
  };

  const getLivraisonName = (id: number) => {
    const livraison = dataType?.data?.rows?.find(p => p.id === id);
    return livraison ? livraison?.description : 'Non trouver';
  };
  const [searchedText, setSearchedText] = useState<string>("");

  const filteredData = dataPayement?.data?.filter(
    (item: any): boolean => {
      return item?.__tbl_ecom_user && Object.keys(item?.__tbl_ecom_user).some((key: string) =>
        item?.__tbl_ecom_user[key]?.toString().toLowerCase().includes(searchedText.toLowerCase())
      );
    }
  );
  return (
    <div>
      <LayoutCompWithTable
        title='Liste des paiements'
        btn={
          <div className="w-full md:w-auto md:mr-4 flex gap-4 items-center">
            <Input.Search
              placeholder="Rechercher un agriculteur"
              className="placeholder:!text-xs"
              onSearch={(v) => setSearchedText(v)}
              onChange={(e) => setSearchedText(e.target.value)}
            />

            <Button onClick={() => generateFichePaimentPdf('Liste des paiements', filteredData)}><FiPrinter />Imprimer</Button>
          </div>
        }
        content={
          <div>
            {
              dataPayementLoad ? (
                <SpinLoader />
              ) : (
                <>
                  <Table
                    dataSource={filteredData}
                    loading={dataPayementLoad}
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
                        title: "Id.Référence",
                        dataIndex: "ref",
                        key: "ref",
                        render: (_, item) => <a>{item?.realref}</a>,
                      },
                      {
                        title: "Montant",
                        dataIndex: "montant",
                        key: "montant",
                        render: (_, item) => (
                          <>
                            <List.Item.Meta
                              className=" flex items-center gap-4"
                              title={
                                <strong>
                                  {item?.amount} {item?.currency}
                                </strong>
                              }
                              description={`Num.Trans: ${item?.customer_phone}`}
                            />
                          </>
                        ),
                      },
                      {
                        title: "Membre",
                        dataIndex: "mbre",
                        key: "mbre",
                        render: (_, item) => (
                          <>
                            <List.Item.Meta
                              className=" flex items-center gap-4"
                              title={
                                <strong>
                                  {item?.__tbl_ecom_user?.nom} {item?.__tbl_ecom_user?.postnom} {item?.__tbl_ecom_user?.prenom}
                                </strong>
                              }
                              description={`Email: ${item?.__tbl_ecom_user?.email}`}
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
                                  <SheetTitle>Détail paiement</SheetTitle>
                                  <SheetDescription>
                                    <div className=" w-full py-6 px-2 flex flex-col gap-8">

                                      <div>
                                        <div className="overflow h-10">
                                          <div className="border-t border-gray-200  py-5 sm:p-0">
                                            <dl className="sm:divide-y sm:divide-gray-200">
                                              <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                                <dt className="text-sm font-medium text-gray-500">
                                                  Montan
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                  <strong>
                                                    {`${item?.amount} ${item?.currency}`}
                                                  </strong>
                                                </dd>
                                              </div>
                                              <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                                <dt className="text-sm font-medium text-gray-500">
                                                  Numero paiement
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                  {item?.customer_phone}
                                                </dd>
                                              </div>
                                              <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                                <dt className="text-sm font-medium text-gray-500">
                                                  Id.Reference
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                  {item?.realref}
                                                </dd>
                                              </div>

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

                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                  <strong>Details d&apos;articles commander</strong>
                                                </dd>
                                              </div>

                                              <div className="py-3 sm:py-2 ">
                                                <div className="h-[70vh] overflow-auto">
                                                  {
                                                    dataPayementLoad ? (
                                                      <SpinLoader />
                                                    ) : (
                                                      <>
                                                        <Table
                                                          dataSource={item?.__tbl_ecom_commandes}
                                                          loading={dataPayementLoad}
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
                                                              title: "Produit",
                                                              dataIndex: "id_produit",
                                                              key: "id_produit",
                                                              render: (_, item) => getProductNameById(item?.id_produit),
                                                            },
                                                            {
                                                              title: "Qte",
                                                              dataIndex: "qte",
                                                              key: "qte",
                                                              render: (_, item) => <a>{item?.qte}</a>,
                                                            },
                                                            {
                                                              title: "P.u",
                                                              dataIndex: "pu",
                                                              key: "pu",
                                                              render: (_, item) => <a>{item?.prix_unit} {item?.currency}</a>,
                                                            },
                                                            {
                                                              title: "P.t",
                                                              dataIndex: "pt",
                                                              key: "pt",
                                                              render: (_, item) => <a>{item?.prix_total} {item?.currency}</a>,
                                                            },
                                                            {
                                                              title: "Num.Trans",
                                                              dataIndex: "numt",
                                                              key: "numt",
                                                              render: (_, item) => <a>{item?.payament_phone}</a>,
                                                            },
                                                            {
                                                              title: "Date",
                                                              dataIndex: "numt",
                                                              key: "numt",
                                                              render: (_, item) => <a>{item?.createdAt}</a>,
                                                            },
                                                            {
                                                              title: "Description",
                                                              dataIndex: "id_produit",
                                                              key: "id_produit",
                                                              render: (_, item) => getLivraisonName(item?.type_livraison),
                                                            },
                                                          ]}
                                                        />
                                                      </>
                                                    )}
                                                </div>


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
    </div>
  )
}

export default Home