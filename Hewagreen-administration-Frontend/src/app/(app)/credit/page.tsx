"use client";
import useAuth from "@/controller/hooks/useAuth";
import { _credits } from "@/controller/tanstack/credits/getCredits.service";
import LayoutCompWithTable from "@/view/model/LayoutCompWithTable";
import { Avatar, Input, List, Popconfirm, Table, Tag } from "antd";
import { ListCollapse, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useQuery } from "react-query";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { _province } from "@/controller/tanstack/province/getProvince.service";
import { _territoire } from "@/controller/tanstack/territoire/getTerritoire.service";
import { _identification } from "@/controller/tanstack/identification/getIdentification.service";
import { _categorieCooperative } from "@/controller/tanstack/categorieCooperative/getCategCooperative.service";
import useDeleteCredit from "@/controller/tanstack/credits/useDeleteCredit";
import useValidateCredit from "@/controller/tanstack/credits/useValidateCredit";
import { baseURL } from "@/controller/api/config/baseUrl";
import { generateCreditsPdf } from "@/components/docs/creditspdf";
import { Button } from "@/components/ui/button";
import { FiPrinter } from "react-icons/fi";
import SpinLoader from "@/components/global/lazy/SpinLoader";

const Home = () => {

  const { token } = useAuth();
  const [idTerritoire, _setIdTerritoire] = useState('');
  const { data: dataCredits, isLoading: dataCreditsLoad } = useQuery("auth-credits", () =>
    _credits(token!)
  );

  const { data: dataProvince } = useQuery(
    "auth-province",
    () => _province(token!)
  );
  const { data: dataTerritoire } = useQuery(
    "auth-territoire",
    () => _territoire(token!, idTerritoire)
  );

  const { data: dataIdentification } =
    useQuery("auth-profil2", () => _identification(token!));

  const { data: dataCategCooperative } = useQuery("auth-categ", () =>
    _categorieCooperative(token!)
  );

  const {
    mutateAsync: _deleteCredit,
  } = useDeleteCredit();

  const {
    mutateAsync: _validateCredit,
  } = useValidateCredit();

  const rows = dataIdentification?.data?.rows;

  const handleDelete = async (CoopId: number) => {
    await _deleteCredit({
      creditid: CoopId,
      token: token!,
    });
  };

  const [searchedText, setSearchedText] = useState<string>("");
  const filteredData = dataCredits?.data.rows?.filter(
    // (item: any): boolean => {
    //   return Object.keys(item).some((key: string) =>
    //     item?.__tbl_ecom_user[key]?.toString().toLowerCase().includes(searchedText.toLowerCase())
    //   );
    // }
    (item: any): boolean => {
      return Object.keys(item).some((key: string) =>
        item?.__tbl_ecom_user && // Vérification ajoutée ici
        item?.__tbl_ecom_user[key]?.toString().toLowerCase().includes(searchedText.toLowerCase())
      );
    }
  );

  

  return <div>
    <LayoutCompWithTable
      title="Liste des credits"
      btn={
        <div className="w-full md:w-auto md:mr-4 flex gap-4 items-center">
          <Input.Search
            placeholder="Rechercher un utilisateur"
            className="placeholder:!text-xs"
            onSearch={(v) => setSearchedText(v)}
            onChange={(e) => setSearchedText(e.target.value)}
          />
          <Button onClick={() => generateCreditsPdf('Liste des credits', filteredData)}><FiPrinter />Imprimer</Button>
        </div>
      }
      content={
        <>
          {
            dataCreditsLoad ? (
              <SpinLoader />
            ) : (
              <>
                <Table
                  dataSource={filteredData}
                  loading={dataCreditsLoad}
                  columns={[
                    {
                      title: "N°",
                      dataIndex: "index",
                      key: "index",
                      render: (_, __, index) => index + 1,
                      width: "3rem",
                    },
                    {
                      title: "Membres",
                      dataIndex: "membres",
                      key: "membres",
                      render: (_, item) => (
                        <>
                          <List.Item.Meta
                            className=" flex items-center gap-4"
                            avatar={<Avatar src={item?.__tbl_ecom_user?.avatar} />}
                            title={
                              <strong>
                                {`${item?.__tbl_ecom_user?.nom} ${item?.__tbl_ecom_user?.postnom}`}
                              </strong>
                            }
                            description={`Téléphone : ${item?.__tbl_ecom_user?.phone}`}
                          />
                        </>
                      ),
                    },
                    {
                      title: "Credits",
                      dataIndex: "credit",
                      key: "credit",
                      render: (_, item) => (
                        <>
                          <List.Item.Meta
                            className=" flex items-center gap-4"
                            title={
                              <strong>
                                {`${item?.montant} ${item?.currency}`}
                              </strong>
                            }
                            description={`Motif : ${item?.motif}`}
                          />
                        </>
                      ),
                    },
                    {
                      title: "Délais",
                      dataIndex: "tel",
                      key: "tel",
                      render: (_, item) => <a>{item?.periode_remboursement} mois</a>,
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
                              <strong>
                                {`${item?.__tbl_ecom_cooperative?.cooperative}`}
                              </strong>
                            }
                            description={item?.__tbl_ecom_cooperative?.phone}
                          />
                        </>
                      ),
                    },

                    {
                      title: "Status",
                      key: "update",
                      dataIndex: "update",
                      align: "center",
                      render: (_, item) => (
                        <>
                          <Tag color="green" className=" p-1">
                            {item?.status == 0 ? 'Est en attente' : 'Validé'}
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
                            title="Suppression Crédits"
                            description="Voulez-vous vraiment supprimer ce crédit"
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
                                <SheetTitle>Détail du crédit</SheetTitle>
                                <SheetDescription>
                                  <div className=" w-full py-6 px-2 flex flex-col gap-8">
                                    <div className=" w-full flex justify-center">
                                      <Avatar
                                        src={`${baseURL}/${item?.__tbl_ecom_user?.avatar}`}
                                        className=" w-20 h-20"
                                      />
                                    </div>
                                    <div>
                                      <div className="h-[60vh] overflow-auto ">
                                        <div className="border-t h-full border-gray-200  py-5 sm:p-0 ">
                                          <dl className="sm:divide-y sm:divide-gray-200">
                                            <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Membre
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                <strong>
                                                  {`${item?.__tbl_ecom_user?.nom} ${item?.__tbl_ecom_user?.postnom} `}
                                                </strong>
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
                                              <dt className="text-sm font-medium text-gray-500">
                                                Email
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {item?.__tbl_ecom_user?.email}
                                              </dd>
                                            </div>

                                            <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Genre
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {item?.__tbl_ecom_user?.sexe}
                                              </dd>
                                            </div>

                                            <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Date Naissance
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {item?.__tbl_ecom_user?.date_naiss}
                                              </dd>
                                            </div>

                                            <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                hectare Cultiver
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {item?.__tbl_ecom_user?.hectare_cultive}
                                              </dd>
                                            </div>

                                            <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Crédit
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                <strong>
                                                  {`${item?.montant}  ${item?.currency}`}
                                                </strong>
                                              </dd>
                                            </div>

                                            <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Motif
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {item?.motif}
                                              </dd>
                                            </div>
                                            <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Periode Remb.
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {item?.periode_remboursement} mois
                                              </dd>
                                            </div>
                                            <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Status
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                <Tag color="green" className=" p-1">
                                                  {item?.status == 0 ? 'Est en attente' : 'Validé'}
                                                </Tag>
                                              </dd>
                                            </div>

                                            <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Coopérative
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                <strong>
                                                  {item?.__tbl_ecom_cooperative?.cooperative}
                                                </strong>
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
                                                Email
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {item?.__tbl_ecom_cooperative?.email}
                                              </dd>
                                            </div>
                                            <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Formalisation
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {item?.__tbl_ecom_cooperative?.isformel == 1 ? "Formel" : "Nom Formel"}
                                              </dd>
                                            </div>
                                            <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Province
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {dataProvince?.data?.rows?.find((el) => el.id = item?.__tbl_ecom_cooperative?.id_province)?.province}
                                              </dd>
                                            </div>
                                            <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Territoire
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {dataTerritoire?.data?.rows?.find((el) => el.id = item?.__tbl_ecom_cooperative?.id_territoire)?.territoire}
                                              </dd>
                                            </div>

                                            <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Responsable
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {rows?.find((el) => el.id = item?.__tbl_ecom_cooperative?.id_responsable)?.nom}<br />
                                                {rows?.find((el) => el.id = item?.__tbl_ecom_cooperative?.id_responsable)?.phone}
                                              </dd>
                                            </div>
                                            <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Adjoint
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {rows?.find((el) => el.id = item?.__tbl_ecom_cooperative?.id_adjoint)?.nom}<br />
                                                {rows?.find((el) => el.id = item?.__tbl_ecom_cooperative?.id_adjoint)?.phone}
                                              </dd>
                                            </div>
                                            <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                              <dt className="text-sm font-medium text-gray-500">
                                                Catégorie
                                              </dt>
                                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {dataCategCooperative?.data?.rows?.find((el) => el.id = item?.__tbl_ecom_cooperative?.id_category)?.category}
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
        </>

      }
    />
  </div>;
};

export default Home;
