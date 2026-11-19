"use client";
import useAuth from '@/controller/hooks/useAuth';
import { _commandesParIdTrans, _commandesParTransaction } from '@/controller/tanstack/commande/getCommande.service';
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query';
import { baseURL } from "@/controller/api/config/baseUrl";
import { _commandes } from "@/controller/tanstack/commande/getCommande.service";
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
import { Button } from '@/components/ui/button';
import { FiPrinter } from 'react-icons/fi';
import { generateCommandePdf } from '@/components/docs/commandepdf';
import SpinLoader from '@/components/global/lazy/SpinLoader';
const { Option } = Select;

const CommaParTransaction = () => {
    const { token } = useAuth();
    const [idTranstion, setIdTransaction] = useState(1122406394054);

    useEffect(() => {

    }, [idTranstion])

    const { data: dataCommandeParTrans } = useQuery("auth-trans", () =>
        _commandesParTransaction(token!)
    );

    const handleTransactionChange = (value: number) => {
        setIdTransaction(value)
    }
    const { data: dataCommandeIdrans, isLoading: dataCommandeIdLoad } = useQuery("auth-idtrans", () =>
        _commandesParIdTrans(token!, idTranstion)
    );

    const [searchedText, setSearchedText] = useState<string>("");
    const filteredData = dataCommandeIdrans?.data?.rows?.filter(
        (item: any): boolean => {
            return Object.keys(item).some((key: string) =>
                item?.__tbl_ecom_produit[key]?.toString().toLowerCase().includes(searchedText.toLowerCase())
            );
        }
    );

    return (
        <div>
            <LayoutCompWithTable
                title="Liste de commades par transaction"
                btn={
                    <div className="w-full md:w-auto md:mr-4 flex gap-4 items-center">
                        <Input.Search
                            placeholder="Rechercher une commande"
                            className="placeholder:!text-xs"
                            onSearch={(v) => setSearchedText(v)}
                            onChange={(e) => setSearchedText(e.target.value)}
                        />

                        <Select
                            placeholder="Entrez le territoire"
                            onChange={handleTransactionChange}
                            showSearch
                            filterOption={(input: string, option: any) =>
                                option.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            <Option selected value="">Listes...
                            </Option>
                            {
                                dataCommandeParTrans?.data?.rows?.map((item, i) => (
                                    <Option key={i} value={item.transaction}>{item.transaction}</Option>
                                ))}
                        </Select>

                        <Button onClick={() => generateCommandePdf('Liste des commandes par transaction', filteredData)}><FiPrinter />Imprimer</Button>
                    </div>

                }

                content={
                    <>
                        {
                            dataCommandeIdLoad ? (
                                <SpinLoader />
                            ) : (
                                <>
                                    < Table
                                        dataSource={filteredData}
                                        loading={dataCommandeIdLoad}
                                        className=" h-[70vh] overflow-auto"

                                        columns={
                                            [
                                                {
                                                    title: "N°",
                                                    dataIndex: "index",
                                                    key: "index",
                                                    render: (_, __, index) => index + 1,
                                                    width: "3rem",
                                                },
                                                {
                                                    title: "Produit Commander",
                                                    dataIndex: "pro",
                                                    key: "pro",
                                                    render: (_, item) => (
                                                        <>
                                                            <List.Item.Meta
                                                                className=" flex items-center gap-4"
                                                                avatar={<Avatar src={`${baseURL}/${item?.__tbl_ecom_produit?.image}`} />}
                                                                title={
                                                                    <strong>
                                                                        {`${item?.__tbl_ecom_produit?.produit}`}
                                                                    </strong>
                                                                }
                                                                description={item?.__tbl_ecom_produit?.description}
                                                            />
                                                        </>
                                                    ),
                                                },
                                                {
                                                    title: "Qte",
                                                    dataIndex: "tel",
                                                    key: "tel",
                                                    render: (_, item) => <strong>{item?.qte}</strong>,
                                                },
                                                {
                                                    title: "Type Livraison",
                                                    dataIndex: "tel",
                                                    key: "tel",
                                                    render: (_, item) => <a>{item?.__tbl_ecom_typelivraison?.type}</a>,
                                                },
                                                {
                                                    title: "Date de création",
                                                    dataIndex: "date",
                                                    key: "date",

                                                    render: (_, item) => (
                                                        <a>{item?.createdAt}</a>
                                                    ),
                                                },
                                                {
                                                    title: "Status",
                                                    key: "update",
                                                    dataIndex: "update",
                                                    align: "center",
                                                    render: (_, item) => (
                                                        <>
                                                            <Tag color="green" className=" p-2">
                                                                {item?.is_pending == 1 ? 'Est en attente' : 'Validé'}
                                                            </Tag>
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
                                                                                                        <Tag color="green" className=" p-2">
                                                                                                            {item?.is_pending == 1 ? 'Est en attente' : 'Validé'}
                                                                                                        </Tag>
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
                                                                                                        Type Livraison
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
        </div >
    )
}

export default CommaParTransaction