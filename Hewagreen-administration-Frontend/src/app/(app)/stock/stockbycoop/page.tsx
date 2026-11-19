"use client";
import useAuth from '@/controller/hooks/useAuth';
import { _cooperative } from '@/controller/tanstack/cooperative/getCooperative.service';
import { _historystocks, _stocks, _stocksByCoop } from '@/controller/tanstack/stocks/getStocks.service';
import { frenchFormattedDate } from '@/lib/dates';
import LayoutCompWithTable from '@/view/model/LayoutCompWithTable';
import { List, Table, Select, TabsProps, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { generateFicheStockPdf } from '@/components/docs/fichestockpdf';
import { generateHistoriqueStocksPdf } from '@/components/docs/historiqueStockpdf';
import SpinLoader from '@/components/global/lazy/SpinLoader';
const { Option } = Select;

const HomeStockByCoop = () => {
    const { token } = useAuth();

    const [activeCooperative, setActiveCooperative] = useState<string | null>(null);
    const [mappedRows, setMappedRows] = useState<any[]>([]);
    const { data: dataCooperativeSelect, isLoading: isLoadingCooperative } = useQuery(
        "auth-coop1",
        () => _cooperative(token!),
        {
            enabled: !!token, // Fetch data only if token is available
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            onSuccess: (data) => {
                // Vérifiez si data et ses propriétés existent
                if (activeCooperative === null && data?.data?.rows?.length) {
                    setActiveCooperative(String(data.data.rows[0].id)); // Convertir l'id en chaîne
                }
            }
        }
    );

    const { data: dataStock, isLoading: dataStockLoad, refetch: refetchDataStock } = useQuery(
        ["auth-stocksby", activeCooperative],
        () => {
            if (activeCooperative) {
                return _stocksByCoop(token!, activeCooperative)
            }
            return Promise.resolve(null);
        },
        {
            enabled: !!activeCooperative,

        }
    );


    const [idstoch, setIdstock] = useState('')

    const { data: dataHistory, isLoading: dataStockHistory, refetch } = useQuery(
        ["auth-historystock", idstoch],
        async () => {
            if (idstoch) {
                const response = await _historystocks(token!, idstoch);
                return response?.data; // Assurez-vous que response.data contient les données attendues
            }
            return undefined;
        }
    );

    useEffect(() => {
        if (activeCooperative) {
            refetchDataStock(); // Déclencher manuellement la requête lorsque activeCooperative change
        }
        if (idstoch) {
            refetch()
        }

    }, [activeCooperative, idstoch, refetchDataStock, refetch]);
    const filteredRows = dataStock?.data?.rows?.filter(
        (item) => item.id_cooperative.toString() === activeCooperative
    );


    // const mappedRows = filteredRows?.flatMap((row) => {
    //     const tblEcomProduits = row.__tbl_ecom_produits;

    //     return tblEcomProduits;
    // }) as any[];


    const [searchedText, setSearchedText] = useState<string>("");

    const filteredData = dataHistory?.mouvements?.filter(
        (item: any): boolean => {
            return Object.keys(item).some((key: string) =>
                item[key]?.toString().toLowerCase().includes(searchedText.toLowerCase())
            );
        }
    );

    const coopName = dataCooperativeSelect?.data.rows.find(
        (coop: any) => coop.id === activeCooperative
    )?.cooperative || "";



    useEffect(() => {
        if (dataStock?.data?.rows) {

            const filteredRows = dataStock.data.rows.filter(
                (item) => item.id_cooperative === Number(activeCooperative) // Assurez-vous que les types correspondent
            );
            const newMappedRows = filteredRows.flatMap((row) => row.__tbl_ecom_produits);
            setMappedRows(newMappedRows);
        }
    }, [dataStock, activeCooperative]);

    useEffect(() => {
        if (activeCooperative) {
            refetchDataStock();
        }
    }, [activeCooperative, refetchDataStock]);

    const handleCoopChange = (value: string) => {
        setActiveCooperative(value);
    };

    const handleGeneratePdf = () => {
        if (dataStockLoad) {
            return;
        }

        if (mappedRows.length > 0) {
            generateFicheStockPdf('FICHES DES STOCKS', coopName, mappedRows);
        }
    };
    return (
        <div>
            <main>
                <div
                    className="mt-0"

                >
                    {/* <Tabs type="card" items={tabsItems} activeKey={activeCooperative} onTabClick={handleTabClick} ></Tabs> */}
                </div>
                {activeCooperative && (
                    <div className='mb-1'>
                        <LayoutCompWithTable
                            title=""
                            btn={<>
                                <div className="w-full md:w-auto md:mr-4 flex gap-4 items-center mb-[-50px]">
                                    <Select
                                        showSearch
                                        style={{ width: "100%" }}
                                        placeholder="Cooperative"
                                        optionFilterProp="children"
                                        filterOption={(input: string, option: any) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }

                                        onChange={handleCoopChange}
                                        loading={isLoadingCooperative}
                                    >
                                        <Option value="">Listes...</Option>
                                        {dataCooperativeSelect?.data?.rows.map((item: any) => (
                                            <Option key={item.id} value={item.id}>
                                                {item.cooperative}
                                            </Option>
                                        ))}
                                    </Select>

                                    <Button onClick={handleGeneratePdf}>Imprimer Fiche Stock</Button>
                                </div>

                            </>}
                            content={
                                <>
                                    {
                                        activeCooperative &&
                                        dataStock?.data?.rows?.map((row) => (
                                            <>

                                                {
                                                    dataStockLoad ? (
                                                        <SpinLoader />
                                                    ) : (
                                                        <>
                                                            <div className='mb-2 mt-10 font-bold'><Tag color="green"><h3>Date Approvisionnement  : {frenchFormattedDate(row.createdAt)}</h3></Tag></div>

                                                            <Table

                                                                key={row.id}
                                                                dataSource={row.__tbl_ecom_produits}
                                                                loading={dataStockLoad}
                                                                className="h-[22vh] overflow-auto"
                                                                columns={[
                                                                    {
                                                                        title: "N°",
                                                                        dataIndex: "index",
                                                                        key: "index",
                                                                        render: (_, __, index) => index + 1,
                                                                        width: "1rem",
                                                                    },

                                                                    {
                                                                        title: "Produit",
                                                                        dataIndex: "name",
                                                                        key: "name",
                                                                        render: (_, item) => (
                                                                            <>
                                                                                <List.Item.Meta
                                                                                    className=" flex items-center gap-4"
                                                                                    title={
                                                                                        <strong>
                                                                                            {item.produit}
                                                                                        </strong>
                                                                                    }
                                                                                    description={`Categorie: ${item?.__tbl_ecom_categories?.category}`}
                                                                                />
                                                                            </>
                                                                        ),
                                                                    },

                                                                    {
                                                                        title: "Qte",
                                                                        dataIndex: "qte",
                                                                        key: "qte",

                                                                        render: (_, item) => (
                                                                            <a>{item.__tbl_ecom_hasproducts.qte}</a>
                                                                        ),

                                                                    },
                                                                    {
                                                                        title: "P.U",
                                                                        dataIndex: "pu",
                                                                        key: "pu",

                                                                        render: (_, item) => (
                                                                            <a>{item.__tbl_ecom_hasproducts.prix_unitaire} {item.__tbl_ecom_hasproducts.currency}</a>
                                                                        ),
                                                                        width: "10rem",
                                                                    },
                                                                    {
                                                                        title: "Commission",
                                                                        dataIndex: "pt1",
                                                                        key: "pt1",

                                                                        render: (_, item) => (
                                                                            <a>{item.__tbl_ecom_hasproducts.prix_plus_commission} {item.__tbl_ecom_hasproducts.currency}</a>
                                                                        ),
                                                                    },
                                                                    {
                                                                        title: "Unite Mesure",
                                                                        dataIndex: "pt",
                                                                        key: "pt",

                                                                        render: (_, item) => (
                                                                            <a>{item.__tbl_ecom_unitesmesures.unity}</a>
                                                                        ),
                                                                    },
                                                                    {
                                                                        title: "Date de création",
                                                                        dataIndex: "date",
                                                                        key: "date",

                                                                        render: (_, item) => (
                                                                            <a>{frenchFormattedDate(item?.__tbl_ecom_hasproducts?.createdAt)}</a>
                                                                        ),
                                                                    },
                                                                    {
                                                                        title: "Historique Vente",
                                                                        key: "hist",
                                                                        align: "center",
                                                                        render: (_,) => (
                                                                            <>
                                                                                <Sheet >
                                                                                    <SheetTrigger>
                                                                                        <Tag onClick={() => setIdstock(row?.id.toString())} color="green" className=" p-1 cursor-pointer">
                                                                                            Mouvements Stock
                                                                                        </Tag>
                                                                                    </SheetTrigger>
                                                                                    <SheetContent className="w-[900vh] md:w-full md:max-w-2xl lg:max-w-3xl">
                                                                                        <SheetHeader>
                                                                                            <SheetTitle>Historique de stock</SheetTitle>
                                                                                            <SheetDescription>
                                                                                                {
                                                                                                    idstoch && (
                                                                                                        <>
                                                                                                            <div className=" w-full py-6 px-2 flex flex-col gap-8">

                                                                                                                <div className='bg-[#BACFCD] p-5 rounded color-black'>
                                                                                                                    <div className='font-bold'>Nom coop. : {dataHistory?.__tbl_ecom_cooperative?.cooperative}</div>
                                                                                                                    <p>Sigle : {dataHistory?.__tbl_ecom_cooperative?.sigle}</p>
                                                                                                                    <p>Téléphone : {dataHistory?.__tbl_ecom_cooperative?.phone}</p>
                                                                                                                    <p>Email : {dataHistory?.__tbl_ecom_cooperative?.email}</p>

                                                                                                                    <p>Description : {dataHistory?.__tbl_ecom_cooperative?.description}</p>
                                                                                                                </div>
                                                                                                                <div>
                                                                                                                    <div className="overflow h-10">
                                                                                                                        <div className="border-t border-gray-200   sm:p-0">

                                                                                                                            <dl className="sm:divide-y sm:divide-gray-200">
                                                                                                                                <LayoutCompWithTable

                                                                                                                                    title="Détails"
                                                                                                                                    btn={
                                                                                                                                        <>
                                                                                                                                            <div className='flex justify-between mb=[-20px]'>

                                                                                                                                                <div>
                                                                                                                                                    <Button onClick={() => generateHistoriqueStocksPdf('MOUVEMENT DE STOCKS', filteredData, filteredData)}>Imprimer Fiche Stock</Button>
                                                                                                                                                </div>
                                                                                                                                            </div>
                                                                                                                                        </>
                                                                                                                                    }
                                                                                                                                    content={
                                                                                                                                        <div>
                                                                                                                                            {
                                                                                                                                                dataStockHistory ? (
                                                                                                                                                    <SpinLoader />
                                                                                                                                                ) : (
                                                                                                                                                    <>
                                                                                                                                                        <Table
                                                                                                                                                            dataSource={filteredData}
                                                                                                                                                            loading={dataStockHistory}
                                                                                                                                                            className="h-[70vh] overflow-auto"
                                                                                                                                                            columns={[
                                                                                                                                                                {
                                                                                                                                                                    title: "N°",
                                                                                                                                                                    dataIndex: "index",
                                                                                                                                                                    key: "index",
                                                                                                                                                                    render: (_, __, index) => index + 1,
                                                                                                                                                                    width: "1rem",
                                                                                                                                                                },
                                                                                                                                                                {
                                                                                                                                                                    title: "Produit",
                                                                                                                                                                    dataIndex: "role",
                                                                                                                                                                    key: "role",
                                                                                                                                                                    render: (_, item, _index) => (
                                                                                                                                                                        <>
                                                                                                                                                                            <List.Item.Meta
                                                                                                                                                                                className="flex items-center gap-4"
                                                                                                                                                                                // avatar={<Avatar src={`${baseURL}/${item?.avatar}`} />}
                                                                                                                                                                                title={<strong>{`${item?.[0].produit}`}</strong>}
                                                                                                                                                                            // description={item?.description}
                                                                                                                                                                            />
                                                                                                                                                                        </>
                                                                                                                                                                    ),
                                                                                                                                                                },
                                                                                                                                                                {
                                                                                                                                                                    title: "ENTRÉE",
                                                                                                                                                                    children: [
                                                                                                                                                                        {
                                                                                                                                                                            title: "Q.e",
                                                                                                                                                                            dataIndex: "role",
                                                                                                                                                                            key: "role",
                                                                                                                                                                            render: (_, item, _index) => (
                                                                                                                                                                                <>
                                                                                                                                                                                    <List.Item.Meta
                                                                                                                                                                                        className="flex items-center gap-4"
                                                                                                                                                                                        // avatar={<Avatar src={`${baseURL}/${item?.avatar}`} />}
                                                                                                                                                                                        title={<strong>{`${item?.[0]?.__tbl_ecom_hasproducts?.qte}`}</strong>}
                                                                                                                                                                                    // description={item?.description}
                                                                                                                                                                                    />
                                                                                                                                                                                </>
                                                                                                                                                                            ),
                                                                                                                                                                        },
                                                                                                                                                                        {
                                                                                                                                                                            title: "Prix",
                                                                                                                                                                            dataIndex: "role",
                                                                                                                                                                            key: "role",
                                                                                                                                                                            render: (_, item, _index) => (
                                                                                                                                                                                <>
                                                                                                                                                                                    <List.Item.Meta
                                                                                                                                                                                        className="flex items-center gap-4"
                                                                                                                                                                                        // avatar={<Avatar src={`${baseURL}/${item?.avatar}`} />}
                                                                                                                                                                                        title={<strong>{`${item?.[0]?.__tbl_ecom_hasproducts?.prix_unitaire}.${item?.[0]?.__tbl_ecom_hasproducts?.currency}`}</strong>}
                                                                                                                                                                                    // description={item?.description}
                                                                                                                                                                                    />
                                                                                                                                                                                </>
                                                                                                                                                                            ),
                                                                                                                                                                        },
                                                                                                                                                                        {
                                                                                                                                                                            title: "P.commission",
                                                                                                                                                                            dataIndex: "role",
                                                                                                                                                                            key: "role",
                                                                                                                                                                            render: (_, item, _index) => (
                                                                                                                                                                                <>
                                                                                                                                                                                    <List.Item.Meta
                                                                                                                                                                                        className="flex items-center gap-4"
                                                                                                                                                                                        // avatar={<Avatar src={`${baseURL}/${item?.avatar}`} />}
                                                                                                                                                                                        title={<strong>{`${item?.[0]?.__tbl_ecom_hasproducts?.prix_plus_commission}.${item?.[0]?.__tbl_ecom_hasproducts?.currency}`}</strong>}
                                                                                                                                                                                    // description={item?.description}
                                                                                                                                                                                    />
                                                                                                                                                                                </>
                                                                                                                                                                            ),
                                                                                                                                                                        },
                                                                                                                                                                    ],
                                                                                                                                                                },
                                                                                                                                                                {
                                                                                                                                                                    title: "MOUVEMENTS",
                                                                                                                                                                    children: [
                                                                                                                                                                        {
                                                                                                                                                                            title: "Q.i",
                                                                                                                                                                            dataIndex: "role",
                                                                                                                                                                            key: "role",
                                                                                                                                                                            render: (_, item, _index) => (
                                                                                                                                                                                <>
                                                                                                                                                                                    <List.Item.Meta
                                                                                                                                                                                        className="flex items-center gap-4"
                                                                                                                                                                                        // avatar={<Avatar src={`${baseURL}/${item?.avatar}`} />}
                                                                                                                                                                                        title={<strong>{`${item?.mouvements?.qte}`}</strong>}
                                                                                                                                                                                    // description={item?.description}
                                                                                                                                                                                    />
                                                                                                                                                                                </>
                                                                                                                                                                            ),
                                                                                                                                                                        },
                                                                                                                                                                        {
                                                                                                                                                                            title: "Q.critique",
                                                                                                                                                                            dataIndex: "role",
                                                                                                                                                                            key: "role",
                                                                                                                                                                            render: (_, item, _index) => (
                                                                                                                                                                                <>
                                                                                                                                                                                    <List.Item.Meta
                                                                                                                                                                                        className="flex items-center gap-4"
                                                                                                                                                                                        // avatar={<Avatar src={`${baseURL}/${item?.avatar}`} />}
                                                                                                                                                                                        title={<strong>{`${item?.mouvements?.qte_critique}`}</strong>}
                                                                                                                                                                                    // description={item?.description}
                                                                                                                                                                                    />
                                                                                                                                                                                </>
                                                                                                                                                                            ),
                                                                                                                                                                        },
                                                                                                                                                                        {
                                                                                                                                                                            title: "Prix",
                                                                                                                                                                            dataIndex: "role",
                                                                                                                                                                            key: "role",
                                                                                                                                                                            render: (_, item, _index) => (
                                                                                                                                                                                <>
                                                                                                                                                                                    <List.Item.Meta
                                                                                                                                                                                        className="flex items-center gap-4"
                                                                                                                                                                                        // avatar={<Avatar src={`${baseURL}/${item?.avatar}`} />}
                                                                                                                                                                                        title={<strong>{`${item?.mouvements?.prix_unitaire}.${item?.mouvements?.currency}`}</strong>}
                                                                                                                                                                                    // description={item?.description}
                                                                                                                                                                                    />
                                                                                                                                                                                </>
                                                                                                                                                                            ),
                                                                                                                                                                        },
                                                                                                                                                                        {
                                                                                                                                                                            title: "P.commission",
                                                                                                                                                                            dataIndex: "role",
                                                                                                                                                                            key: "role",
                                                                                                                                                                            render: (_, item, _index) => (
                                                                                                                                                                                <>
                                                                                                                                                                                    <List.Item.Meta
                                                                                                                                                                                        className="flex items-center gap-4"
                                                                                                                                                                                        // avatar={<Avatar src={`${baseURL}/${item?.avatar}`} />}
                                                                                                                                                                                        title={<strong>{`${item?.mouvements?.prix_plus_commission}.${item?.mouvements?.currency}`}</strong>}
                                                                                                                                                                                    // description={item?.description}
                                                                                                                                                                                    />
                                                                                                                                                                                </>
                                                                                                                                                                            ),

                                                                                                                                                                        },
                                                                                                                                                                        {
                                                                                                                                                                            title: "Date",
                                                                                                                                                                            dataIndex: "role",
                                                                                                                                                                            key: "role",
                                                                                                                                                                            render: (_, item, _index) => (
                                                                                                                                                                                <>
                                                                                                                                                                                    <List.Item.Meta
                                                                                                                                                                                        className="flex items-center gap-4"
                                                                                                                                                                                        // avatar={<Avatar src={`${baseURL}/${item?.avatar}`} />}
                                                                                                                                                                                        title={<strong>{`${frenchFormattedDate(item?.mouvements?.createdAt)}`}</strong>}
                                                                                                                                                                                    // description={item?.description}
                                                                                                                                                                                    />
                                                                                                                                                                                </>
                                                                                                                                                                            ),

                                                                                                                                                                        },
                                                                                                                                                                    ],
                                                                                                                                                                },
                                                                                                                                                            ]}
                                                                                                                                                        />
                                                                                                                                                    </>
                                                                                                                                                )
                                                                                                                                            }
                                                                                                                                        </div>
                                                                                                                                    }
                                                                                                                                />

                                                                                                                            </dl>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </>
                                                                                                    )
                                                                                                }

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

                                        ))}



                                </>
                            }

                        />
                    </div>
                )}
            </main>

        </div>
    )
}

export default HomeStockByCoop