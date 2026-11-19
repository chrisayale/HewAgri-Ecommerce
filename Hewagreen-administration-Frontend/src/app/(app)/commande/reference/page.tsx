"use client";
import { baseURL } from "@/controller/api/config/baseUrl";
import useAuth from "@/controller/hooks/useAuth";
import { _commandes } from "@/controller/tanstack/commande/getCommande.service";
import LayoutCompWithTable from "@/view/model/LayoutCompWithTable";
import { Avatar, Input, Table, Tag } from "antd";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { FiPrinter } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import SpinLoader from "@/components/global/lazy/SpinLoader";
import { generateCommandePdf } from "@/components/docs/commandepdf";
import { formatDate, geDateFormat } from "@/controller/api/config/config";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"; // Importez Sheet
import { _cooperative } from "@/controller/tanstack/cooperative/getCooperative.service";
import { ListCollapse } from "lucide-react";

interface Produit {
    produit: string;
    image: string;
    description: string;
    [key: string]: any; // Ajout d'une index signature
}

interface Commande {
    id: number;
    qte: number;
    state: number;
    payament_phone: string;
    transaction: string;
    createdAt: string;
    prix_unit: number;
    prix_total: number;
    is_pending: number;
    currency: string;

    __tbl_ecom_unitesmesure: {
        unity: string;
    };
    __tbl_ecom_typelivraison: {
        type: string;
        description: string;
        quantite: number;
    };
    id_cooperative: number;
    __tbl_ecom_produit: Produit;
    __tbl_ecom_user: {
        id: number;
        nom: string;
        postnom: string;
        phone: string;
    };
}

const CmdReference: React.FC = () => {
    const { token } = useAuth();
    const { data: dataCooperative } = useQuery(
        "auth-toutcomman",
        () => _cooperative(token!)
    );
    const { data: dataCommande, isLoading: dataCommandeLoad } = useQuery(
        "auth-profilcommande",
        () => _commandes(token!)
    );

    const [searchedText, setSearchedText] = useState<string>("");

    const groupedData: { [key: string]: { totalQte: number; commandes: Commande[] } } =
        dataCommande?.data?.rows?.reduce((acc: { [key: string]: { totalQte: number; commandes: Commande[] } }, item: Commande) => {
            const transactionId = item.transaction;
            if (!acc[transactionId]) {
                acc[transactionId] = { totalQte: 0, commandes: [] };
            }
            acc[transactionId].totalQte += item.qte; // Additionner les quantités
            acc[transactionId].commandes.push(item);
            return acc;
        }, {}) || {};

    const filteredData = Object.entries(groupedData)
        .map(([transaction, { totalQte, commandes }]) => ({
            transaction,
            totalQte,
            commandes,
            createdAt: commandes[0].createdAt,
            state: commandes[0].state,
        }))
        .filter((item) => {
            return (
                item.transaction.toLowerCase().includes(searchedText.toLowerCase()) ||
                item.commandes.some((commande) =>
                    Object.keys(commande.__tbl_ecom_produit).some((key) =>
                        commande.transaction?.toString().toLowerCase().includes(searchedText.toLowerCase())
                    )
                )
            );
        });
        const [searchedText1, setSearchedText1] = useState<string>("");
        const filteredData1 = dataCommande?.data?.rows?.filter(
            (item: any): boolean => {
              return Object.keys(item).some((key: string) =>
                item?.transaction?.toString().toLowerCase().includes(searchedText1.toLowerCase())
              );
            }
          );

    return (
        <div>
            <LayoutCompWithTable
                title="Liste des commandes par refenrences"
                btn={
                    <div className="w-full md:w-auto md:mr-4 flex gap-4 items-center">
                        <Input.Search
                            placeholder="Rechercher une transaction"
                            className="placeholder:!text-xs"
                            onSearch={(v) => setSearchedText(v)}
                            onChange={(e) => setSearchedText(e.target.value)}
                        />
                        <Button
                            onClick={() => generateCommandePdf("Liste des commandes", filteredData1)}
                        >
                            <FiPrinter />
                            Imprimer
                        </Button>
                    </div>
                }
                content={
                    <>
                        {dataCommandeLoad ? (
                            <SpinLoader />
                        ) : (
                            <Table
                                dataSource={filteredData}
                                loading={dataCommandeLoad}
                                rowKey={(record) => record.transaction}
                                expandable={{
                                    expandedRowRender: (record) => (
                                        <Table
                                            dataSource={record.commandes}
                                            pagination={false}
                                            rowKey={(commande) => commande.id}
                                            columns={[
                                                {
                                                    title: "Produit",
                                                    key: "produit",
                                                    render: (record) => (
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <Avatar src={`${baseURL}/${record.__tbl_ecom_produit.image}`} />
                                                            <strong style={{ marginLeft: 10 }}>{record.__tbl_ecom_produit.produit}</strong>
                                                        </div>
                                                    ),
                                                },
                                                {
                                                    title: "Qte",
                                                    dataIndex: "qte",
                                                    key: "qte",
                                                    render: (qte) => <strong>{qte}</strong>,
                                                },

                                                {
                                                    title: "Unites mesure",
                                                    dataIndex: "untime",
                                                    key: "untime",
                                                    render: (_,item) => <strong>{item.__tbl_ecom_unitesmesure.unity}</strong>,
                                                },
                                               
                                                {
                                                    title: "P.T",
                                                    dataIndex: "prix_total",
                                                    key: "prix_total",
                                                    render: (_,item) => <strong>{item?.prix_total}</strong>,
                                                },
                                                 {
                                                    title: "Devise",
                                                    dataIndex: "devise",
                                                    key: "devise",
                                                    render: (_, item) => <strong> {item.currency}</strong>,
                                                },
                                            ]}
                                        />
                                    ),
                                    defaultExpandAllRows: false,
                                }}
                                columns={[
                                    {
                                        title: "Reference",
                                        dataIndex: "transaction",
                                        key: "transaction",
                                        render: (transaction) => <strong>{transaction}</strong>,
                                    },
                                    {
                                        title: "Date Commande",
                                        dataIndex: "createdAt",
                                        key: "createdAt",
                                        render: (createdAt) => (
                                            <div>{formatDate(createdAt)} <br /> {geDateFormat(createdAt)}</div>
                                        ),
                                    },
                                    {
                                        title: "Quantité Totale",
                                        dataIndex: "totalQte",
                                        key: "totalQte",
                                        render: (totalQte) => <strong>{totalQte}</strong>,
                                    },
                                    {
                                        title: "Mode de Paiement",
                                        dataIndex: "payament_phone",
                                        key: "payament_phone",
                                        render: (_, record) => <div>{record.commandes[0].payament_phone}</div>,
                                    },
                                    {
                                        title: "Type de Livraison",
                                        dataIndex: "typeLivraison",
                                        key: "typeLivraison",
                                        render: (_, record) => (
                                            <div>{record.commandes[0].__tbl_ecom_typelivraison?.type}</div>
                                        ),
                                    },
                                    {
                                        title: "Status",
                                        key: "status",
                                        dataIndex: "state",
                                        render: (state) => {
                                            let statusText = "";
                                            let statusColor = "";

                                            switch (state) {
                                                case 0:
                                                    statusText = "Non payée";
                                                    statusColor = "red";
                                                    break;
                                                case 1:
                                                    statusText = "Annulée";
                                                    statusColor = "grey";
                                                    break;
                                                case 2:
                                                    statusText = "En cours de livraison";
                                                    statusColor = "orange";
                                                    break;
                                                case 3:
                                                    statusText = "Possibilité de livraison";
                                                    statusColor = "cyan";
                                                    break;
                                                case 4:
                                                    statusText = "Livrée";
                                                    statusColor = "green";
                                                    break;
                                                default:
                                                    statusText = "État inconnu";
                                                    statusColor = "default";
                                            }

                                            return (
                                                <Tag color={statusColor} className="p-2">
                                                    {statusText}
                                                </Tag>
                                            );
                                        },
                                    },
                                    {
                                        title: "Détails",
                                        key: "details",
                                        render: (_, record) => (
                                            <Sheet>
                                                <SheetTrigger>
                                                    <Tag color="green" className=" p-2">
                                                        <ListCollapse size={16} />
                                                    </Tag>
                                                </SheetTrigger>
                                                <SheetContent className="w-[900px] md:w-full md:max-w-2xl lg:max-w-3xl">
                                                    <SheetHeader>
                                                        <SheetTitle>Détails Commandes</SheetTitle>
                                                        <SheetDescription>
                                                            <div className="w-full py-6 px-2 flex flex-col gap-8">

                                                                <div>
                                                                    <div className="overflow h-10">
                                                                        <div className="border-t border-gray-200 py-5 sm:p-0">
                                                                            <dl className="sm:divide-y sm:divide-gray-200">

                                                                                <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                                                                                    <dt className="text-sm font-medium text-gray-500">Commandée par</dt>
                                                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                                                        {`${record.commandes[0].__tbl_ecom_user.nom} ${record.commandes[0].__tbl_ecom_user.postnom}`}<br />
                                                                                        {record.commandes[0].__tbl_ecom_user.phone}
                                                                                    </dd>
                                                                                </div>
                                                                                <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                                                                                    <dt className="text-sm font-medium text-gray-500">Coopérative</dt>
                                                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                                                        {/* Remplacez avec la logique pour obtenir le nom de la coopérative */}
                                                                                        {
                                                                                            dataCooperative?.data?.rows?.find(
                                                                                                (el) => el.id === record.commandes[0].id_cooperative
                                                                                            )?.cooperative
                                                                                        }<br />
                                                                                        {
                                                                                            dataCooperative?.data?.rows?.find(
                                                                                                (el) => el.id === record.commandes[0].id_cooperative
                                                                                            )?.phone
                                                                                        }
                                                                                    </dd>
                                                                                </div>

                                                                                <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                                                                                    <dt className="text-sm font-medium text-gray-500">Date de création</dt>
                                                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                                                        {new Date(record.createdAt).toLocaleDateString()}
                                                                                    </dd>
                                                                                </div>
                                                                                <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                                                                                    <dt className="text-sm font-medium text-gray-500">Mode de Paiement</dt>
                                                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                                                        {record.commandes[0].payament_phone}
                                                                                    </dd>
                                                                                </div>
                                                                                <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                                                                                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                                                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                                                        {(() => {
                                                                                            let statusText = "";
                                                                                            let statusColor = "";

                                                                                            switch (record.state) {
                                                                                                case 0:
                                                                                                    statusText = "Non payée";
                                                                                                    statusColor = "red";
                                                                                                    break;
                                                                                                case 1:
                                                                                                    statusText = "Annulée";
                                                                                                    statusColor = "grey";
                                                                                                    break;
                                                                                                case 2:
                                                                                                    statusText = "En cours de livraison";
                                                                                                    statusColor = "orange";
                                                                                                    break;
                                                                                                case 3:
                                                                                                    statusText = "Possibilité de livraison";
                                                                                                    statusColor = "cyan";
                                                                                                    break;
                                                                                                case 4:
                                                                                                    statusText = "Livrée";
                                                                                                    statusColor = "green";
                                                                                                    break;
                                                                                                default:
                                                                                                    statusText = "État inconnu";
                                                                                                    statusColor = "default";
                                                                                            }

                                                                                            return (
                                                                                                <Tag color={statusColor} className="p-2">
                                                                                                    {statusText}
                                                                                                </Tag>
                                                                                            );
                                                                                        })()}
                                                                                    </dd>
                                                                                </div>
                                                                                <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                                                                                    <dt className="text-sm font-medium text-gray-500">Type de Livraison</dt>
                                                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                                                        {record.commandes[0].__tbl_ecom_typelivraison.type}
                                                                                    </dd>
                                                                                </div>
                                                                                <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                                                                                    <dt className="text-sm font-medium text-gray-500">Description</dt>
                                                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                                                        {record.commandes[0].__tbl_ecom_typelivraison.description}
                                                                                    </dd>
                                                                                </div>
                                                                                <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                                                                                    <dt className="text-sm font-medium text-gray-500">Qte Livraison</dt>
                                                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                                                        {record.commandes[0].__tbl_ecom_typelivraison.quantite}
                                                                                    </dd>
                                                                                </div>

                                                                                <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">

                                                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                                                        <strong>Details d&apos;articles commander</strong>
                                                                                    </dd>
                                                                                </div>

                                                                                <div className="py-3 sm:py-2 ">
                                                                                    <div className="h-[70vh] overflow-auto">
                                                                                    <Table
                                                                                                        dataSource={record.commandes}
                                                                                                        pagination={false}
                                                                                                        rowKey={(commande) => commande.id}
                                                                                                        columns={[
                                                                                                            {
                                                                                                                title: "Produit",
                                                                                                                key: "produit",
                                                                                                                render: (commande) => (
                                                                                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                                                                        <Avatar src={`${baseURL}/${commande.__tbl_ecom_produit.image}`} />
                                                                                                                        <strong style={{ marginLeft: 10 }}>{commande.__tbl_ecom_produit.produit}</strong>
                                                                                                                    </div>
                                                                                                                ),
                                                                                                            },
                                                                                                            {
                                                                                                                title: "Qte",
                                                                                                                dataIndex: "qte",
                                                                                                                key: "qte",
                                                                                                            },
                                                                                                            {
                                                                                                                title: "Unites mesure",
                                                                                                                dataIndex: "untime",
                                                                                                                key: "untime",
                                                                                                                render: (_,item) => <strong>{item.__tbl_ecom_unitesmesure.unity}</strong>,
                                                                                                            },
                                                                                                           
                                                                                                            {
                                                                                                                title: "P.T",
                                                                                                                dataIndex: "prix_total",
                                                                                                                key: "prix_total",
                                                                                                            },
                                                                                                            {
                                                                                                                title: "Devise",
                                                                                                                dataIndex: "currency",
                                                                                                                key: "currency",
                                                                                                            },
                                                                                                        ]}
                                                                                                    />
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
                                        ),
                                    }
                                ]}
                            />
                        )}
                    </>
                }
            />
        </div>
    );
};

export default CmdReference;