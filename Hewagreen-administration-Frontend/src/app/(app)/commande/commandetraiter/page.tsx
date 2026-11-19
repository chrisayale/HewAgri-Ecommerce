"use client";
import useAuth from '@/controller/hooks/useAuth';
import React, { useState } from 'react'
import { useQuery } from 'react-query';
import { baseURL } from "@/controller/api/config/baseUrl";
import { _commandes, _commandesParState, _commandesParState1 } from "@/controller/tanstack/commande/getCommande.service";
import LayoutCompWithTable from "@/view/model/LayoutCompWithTable";
import { Avatar, Input, List, Select, Table, Tag } from "antd";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ListCollapse } from "lucide-react";
import { _province } from '@/controller/tanstack/province/getProvince.service';
import { _cooperative } from '@/controller/tanstack/cooperative/getCooperative.service';
import { generateCommandePdf } from '@/components/docs/commandepdf';
import { Button } from '@/components/ui/button';
import { FiPrinter } from 'react-icons/fi';
import SpinLoader from '@/components/global/lazy/SpinLoader';
import { formatDate, geDateFormat } from '@/controller/api/config/config';
const { Option } = Select;

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

const CommaTraiter = () => {
    const { token } = useAuth();

    const { data: dataCooperative } = useQuery(
        "auth-toutcomman",
        () => _cooperative(token!)
    );

    const { data: dataCommandeState, isLoading: dataCommandeIdLoad } = useQuery("auth-idsta", () =>
        _commandesParState1
            (token!)
    );



    const [searchedText, setSearchedText] = useState<string>("");

    // Regroupement des données par produit
    const groupedData: { [key: string]: Commande[] } = dataCommandeState?.data?.rows?.reduce(
        (acc: { [key: string]: Commande[] }, item: Commande) => {
            const produitName = item.__tbl_ecom_produit.produit || "Inconnu";
            if (!acc[produitName]) {
                acc[produitName] = [];
            }
            acc[produitName].push(item);
            return acc;
        },
        {}
    ) || {};

    const filteredData = Object.entries(groupedData)
        .map(([produit, commandes]) => ({
            produit,
            commandes,
            createdAt: commandes[0].createdAt,
            state: commandes[0].state,
        }))
        .filter((item) => {
            return (
                item.produit.toLowerCase().includes(searchedText.toLowerCase()) ||
                item.commandes.some((commande) =>
                    Object.keys(commande.__tbl_ecom_produit).some((key) =>
                        commande.__tbl_ecom_produit[key]?.toString().toLowerCase().includes(searchedText.toLowerCase())
                    )
                )
            );
        });

    const [searchedText1, setSearchedText1] = useState<string>("");
    const filteredData1 = dataCommandeState?.data?.rows?.filter(
        (item: any): boolean => {
            return Object.keys(item).some((key: string) =>
                item?.__tbl_ecom_produit[key]?.toString().toLowerCase().includes(searchedText1.toLowerCase())
            );
        }
    );


    return (
        <div>

            <LayoutCompWithTable
                title="Liste de commandes payées"
                btn={
                    <>
                        <div className="w-full md:w-auto md:mr-4 flex gap-4 items-center">
                            <Input.Search
                                placeholder="Rechercher un agriculteur"
                                className="placeholder:!text-xs"
                                onSearch={(v) => setSearchedText(v)}
                                onChange={(e) => setSearchedText(e.target.value)}
                            />
                            <Button onClick={() => generateCommandePdf('Liste des commandes valider ou non valider', filteredData1)}><FiPrinter />Imprimer</Button>
                        </div>

                    </>
                }

                content={
                    <>
                        {
                            dataCommandeIdLoad ? (
                                <SpinLoader />
                            ) : (
                                <>
                                    <Table
                                        dataSource={filteredData}
                                        loading={dataCommandeIdLoad}
                                        rowKey={(record) => record.produit}
                                        className="h-[70vh] overflow-auto"
                                        expandable={{
                                            expandedRowRender: (record) => (
                                                <Table
                                                    dataSource={record.commandes}
                                                    pagination={false} // Désactiver la pagination pour l'affichage des commandes
                                                    rowKey={(commande) => commande.id} // Remplacez par une clé unique appropriée
                                                    columns={[
                                                        {
                                                            title: "Date Commande",
                                                            dataIndex: "date",
                                                            key: "date",

                                                            render: (_, item) => (
                                                                <div>{formatDate(item?.createdAt)} <br />
                                                                    {geDateFormat(item?.createdAt)}

                                                                </div>
                                                            ),
                                                        },
                                                        {
                                                            title: "Quantité",
                                                            dataIndex: "qte",
                                                            key: "qte",
                                                            render: (_, commande) => (
                                                                <div>
                                                                    <strong>{commande.qte}</strong> <span>{commande.__tbl_ecom_unitesmesure.unity}</span>
                                                                </div>
                                                            ),
                                                        },
                                                        {
                                                            title: "Mode de Paiement",
                                                            dataIndex: "payament_phone",
                                                            key: "payament_phone",
                                                            render: (_, commande) => <div>{commande.payament_phone}</div>,
                                                        },

                                                        {
                                                            title: "Type de Livraison",
                                                            dataIndex: "typeLivraison",
                                                            key: "typeLivraison",
                                                            render: (_, commande) => (
                                                                <div>{commande.__tbl_ecom_typelivraison?.type}</div>
                                                            ),
                                                        },
                                                        {
                                                            title: "Mode payement",
                                                            dataIndex: "name",
                                                            key: "name",
                                                            render: (_, item, _index) => (
                                                                <>
                                                                    <List.Item.Meta
                                                                        className=" flex items-center gap-4"
                                                                        avatar={''}
                                                                        title={
                                                                            <span >
                                                                                {`${item?.payament_phone}`}
                                                                            </span>
                                                                        }
                                                                        description={<div>
                                                                            <span style={{ color: '#F3766B' }}>Ref. {item?.transaction}</span>
                                                                        </div>}
                                                                    />
                                                                </>
                                                            ),
                                                        },

                                                        {
                                                            title: "Status",
                                                            key: "update",
                                                            dataIndex: "update",
                                                            align: "center",
                                                            render: (_, item) => {
                                                                let statusText = "";
                                                                let statusColor = "";

                                                                switch (item?.state) {
                                                                    case 0:
                                                                        statusText = "Non payée";
                                                                        statusColor = "red"; // Couleur pour non payée
                                                                        break;
                                                                    case 1:
                                                                        statusText = "Annulée";
                                                                        statusColor = "grey"; // Couleur pour annulée
                                                                        break;
                                                                    case 2:
                                                                        statusText = "Commandes payées";
                                                                        statusColor = "orange"; // Couleur pour en cours de livraison
                                                                        break;
                                                                    case 3:
                                                                        statusText = "Possibilité de livraison";
                                                                        statusColor = "cyan"; // Couleur pour possibilité de livraison
                                                                        break;
                                                                    case 4:
                                                                        statusText = "Livrée";
                                                                        statusColor = "green"; // Couleur pour livrée
                                                                        break;
                                                                    default:
                                                                        statusText = "État inconnu";
                                                                        statusColor = "default"; // Couleur par défaut
                                                                }

                                                                return (
                                                                    <Tag color={statusColor} className="p-2">
                                                                        {statusText}
                                                                    </Tag>
                                                                );
                                                            },
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
                                                                                <SheetTitle>Détail Commande</SheetTitle>
                                                                                <SheetDescription>
                                                                                    <div className=" w-full py-6 px-2 flex flex-col gap-8">
                                                                                        <div className=" w-full flex justify-center">
                                                                                            <Avatar
                                                                                                src={`${baseURL}/${item?.__tbl_ecom_produit?.image}`}
                                                                                                className=" w-20 h-20"
                                                                                            />
                                                                                        </div>
                                                                                        <div>
                                                                                            <div className="overflow h-10">
                                                                                                <div className="border-t border-gray-200  py-5 sm:p-0">
                                                                                                    <dl className="sm:divide-y sm:divide-gray-200">
                                                                                                        <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                                                                                            <dt className="text-sm font-medium text-gray-500">
                                                                                                                Produit
                                                                                                            </dt>
                                                                                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                                                                                <strong>
                                                                                                                    {`${item?.__tbl_ecom_produit?.produit}`}
                                                                                                                </strong>
                                                                                                            </dd>
                                                                                                        </div>
                                                                                                        <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                                                                                            <dt className="text-sm font-medium text-gray-500">
                                                                                                                Qte Commander
                                                                                                            </dt>
                                                                                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                                                                                {item?.qte}
                                                                                                            </dd>
                                                                                                        </div>
                                                                                                        <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                                                                                            <dt className="text-sm font-medium text-gray-500">
                                                                                                                P.U
                                                                                                            </dt>
                                                                                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                                                                                {item?.prix_unit} {item?.currency}
                                                                                                            </dd>
                                                                                                        </div>
                                                                                                        <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                                                                                            <dt className="text-sm font-medium text-gray-500">
                                                                                                                P.T
                                                                                                            </dt>
                                                                                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                                                                                {item?.prix_total} {item?.currency}
                                                                                                            </dd>
                                                                                                        </div>
                                                                                                        <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                                                                                            <dt className="text-sm font-medium text-gray-500">
                                                                                                                Date de création
                                                                                                            </dt>
                                                                                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                                                                                {item?.createdAt}
                                                                                                            </dd>
                                                                                                        </div>
                                                                                                        <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                                                                                            <dt className="text-sm font-medium text-gray-500">
                                                                                                                Mode Payement
                                                                                                            </dt>
                                                                                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                                                                                {item?.payament_phone}
                                                                                                            </dd>
                                                                                                        </div>
                                                                                                        <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                                                                                            <dt className="text-sm font-medium text-gray-500">
                                                                                                                Status
                                                                                                            </dt>
                                                                                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                                                                                {(() => {
                                                                                                                    let statusText = "";
                                                                                                                    let statusColor = "";

                                                                                                                    switch (item?.state) {
                                                                                                                        case 0:
                                                                                                                            statusText = "Non payée";
                                                                                                                            statusColor = "red"; // Couleur pour non payée
                                                                                                                            break;
                                                                                                                        case 1:
                                                                                                                            statusText = "Annulée";
                                                                                                                            statusColor = "grey"; // Couleur pour annulée
                                                                                                                            break;
                                                                                                                        case 2:
                                                                                                                            statusText = "En cours de livraison";
                                                                                                                            statusColor = "orange"; // Couleur pour en cours de livraison
                                                                                                                            break;
                                                                                                                        case 3:
                                                                                                                            statusText = "Possibilité de livraison";
                                                                                                                            statusColor = "cyan"; // Couleur pour possibilité de livraison
                                                                                                                            break;
                                                                                                                        case 4:
                                                                                                                            statusText = "Livrée";
                                                                                                                            statusColor = "green"; // Couleur pour livrée
                                                                                                                            break;
                                                                                                                        default:
                                                                                                                            statusText = "État inconnu";
                                                                                                                            statusColor = "default"; // Couleur par défaut
                                                                                                                    }

                                                                                                                    return (
                                                                                                                        <Tag color={statusColor} className="p-2">
                                                                                                                            {statusText}
                                                                                                                        </Tag>
                                                                                                                    );
                                                                                                                })()}
                                                                                                            </dd>
                                                                                                        </div>

                                                                                                        <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                                                                                            <dt className="text-sm font-medium text-gray-500">
                                                                                                                Type Livraison
                                                                                                            </dt>
                                                                                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                                                                                {item?.__tbl_ecom_typelivraison?.type}
                                                                                                            </dd>
                                                                                                        </div>
                                                                                                        <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                                                                                            <dt className="text-sm font-medium text-gray-500">
                                                                                                            Description
                                                                                                            </dt>
                                                                                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                                                                                {item?.__tbl_ecom_typelivraison?.description}
                                                                                                            </dd>
                                                                                                        </div>
                                                                                                        <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                                                                                            <dt className="text-sm font-medium text-gray-500">
                                                                                                                Qte Livraison
                                                                                                            </dt>
                                                                                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                                                                                {item?.__tbl_ecom_typelivraison?.quantite}
                                                                                                            </dd>
                                                                                                        </div>
                                                                                                        <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                                                                                            <dt className="text-sm font-medium text-gray-500">
                                                                                                            Commandée par
                                                                                                            </dt>
                                                                                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                                                                                {
                                                                                                                  `${item?.__tbl_ecom_user?.nom} ${item?.__tbl_ecom_user?.postnom}`
                                                                                                                }<br />
                                                                                                                {
                                                                                                                  `${item?.__tbl_ecom_user?.phone}`
                                                                                                                }
                                                                                                            </dd>
                                                                                                        </div>

                                                                                                        <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
                                                                                                            <dt className="text-sm font-medium text-gray-500">
                                                                                                                Cooperative
                                                                                                            </dt>
                                                                                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                                                                                {
                                                                                                                    dataCooperative?.data?.rows?.find(
                                                                                                                        (el) => (el.id = item?.id_cooperative)
                                                                                                                    )?.cooperative
                                                                                                                }<br />
                                                                                                                {
                                                                                                                    dataCooperative?.data?.rows?.find(
                                                                                                                        (el) => (el.id = item?.id_cooperative)
                                                                                                                    )?.phone
                                                                                                                }
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
                                            ),
                                            defaultExpandAllRows: true,
                                        }}
                                        columns={[
                                            {
                                                title: "",
                                                dataIndex: "produit",
                                                key: "produit",
                                                render: (produit, record) => (
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <Avatar src={`${baseURL}/${record.commandes[0].__tbl_ecom_produit.image}`} />
                                                        <strong style={{ marginLeft: 10 }}>{produit}</strong>
                                                    </div>
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
        </div >
    )
}

export default CommaTraiter