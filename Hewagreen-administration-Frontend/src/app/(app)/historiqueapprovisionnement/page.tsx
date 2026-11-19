"use client"
import React, { useState } from "react";
import { useQuery } from "react-query";
import { List, Select, Table } from "antd";
import useAuth from "@/controller/hooks/useAuth";
import { _agriculteurById } from "@/controller/tanstack/agriculteurs/getAgriculteur.service";
import { _loadApprovisionnementByMember } from "@/controller/tanstack/statistiquebanque/statistiquebanque.service";
import SpinLoader from "@/components/global/lazy/SpinLoader";
import LayoutCompWithTable from "@/view/model/LayoutCompWithTable";
import { _cooperative } from "@/controller/tanstack/cooperative/getCooperative.service";
import { formatDate, geDateFormat } from "@/controller/api/config/config";
import { Button } from "@/components/ui/button";
import { generateFicheHistoriqueApproPdf } from "@/components/docs/ficheapprovisionnement";
import { FiPrinter } from "react-icons/fi";
import { UIApprovisionnement } from "@/types";

const { Option } = Select;

const Home = () => {
    const { token } = useAuth();
    const [activeCooperative1, setActiveCooperative1] = useState<string | null>(null);
    const [activeMember1, setActiveMember1] = useState<string | null>(null);

    const { data: dataCooperativeSelect, isLoading: isLoadingCooperative } = useQuery(
        "auth-2",
        () => _cooperative(token!),
        {
            enabled: !!token,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            onSuccess: (data) => {
                if (activeCooperative1 === null && data?.data?.rows?.length) {
                    setActiveCooperative1(String(data.data.rows[0].id));
                }
            }
        }
    );

    const { data: dataAgricultureById, isLoading: dataAgriculteurLoard } = useQuery(
        ["auth-categby22", activeCooperative1],
        () => {
            if (activeCooperative1) {
                return _agriculteurById(token!, activeCooperative1);
            }
            return Promise.resolve(null);
        },
        {
            enabled: !!activeCooperative1,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            onSuccess: (data) => {
                if (activeMember1 === null && data?.data?.rows?.length) {
                    setActiveMember1(String(data.data.rows[0].__tbl_ecom_user.id));
                }
            }
        }
    );

    const { data: dataApprovisionnement, isLoading: dataCreditsLoad } = useQuery(
        ["auth-credits-status8", activeMember1],
        () => {
            if (activeMember1) {
                return _loadApprovisionnementByMember(token!, activeMember1);
            }
            return Promise.resolve(null); // Gérer le cas où activeMember1 est nul
        },
        {
            enabled: !!activeMember1,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
        }
    );

    const handleCoopChange = (value: string) => {
        setActiveCooperative1(value);
        setActiveMember1(null); // Réinitialiser activeMember1 lorsque la coopérative change
    };

    const handleMemberChange = (value: string) => {
        setActiveMember1(value); // Mettre à jour activeMember1 directement
    };

    const uniqueUser = dataApprovisionnement?.data.rows[0]?.__tbl_ecom_user;

    return (
        <div>
            <main>
                <h2 className="font-semibold text-xl">Historique Approvisionnement</h2>
                <LayoutCompWithTable
                    title={<></>}
                    btn={
                        <div className="flex gap-4 items-center">
                            <Select
                                showSearch
                                style={{ width: "100%" }}
                                placeholder="Listes des Cooperatives"
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
                            <Select
                                showSearch
                                style={{ width: "100%" }}
                                placeholder="Listes des membres"
                                onChange={handleMemberChange}
                                loading={dataAgriculteurLoard}
                            >
                                <Option value="">Listes des membres...</Option>
                                {dataAgricultureById?.data?.rows.map((item) => (
                                    <Option key={item.__tbl_ecom_user.id} value={item.__tbl_ecom_user.id}>
                                        {item.__tbl_ecom_user.nom} {item.__tbl_ecom_user.postnom} {item.__tbl_ecom_user.prenom}
                                    </Option>
                                ))}
                            </Select>
                            <Button
                                onClick={() => {
                                    const rows = dataApprovisionnement?.data?.rows || [];

                                    const approvisionnement: UIApprovisionnement = {
                                        status: 200, // ou un autre code de statut approprié
                                        message: "Données récupérées avec succès", // ou un autre message
                                        data: {
                                            count: rows.length,
                                            rows: rows,
                                        },
                                    };

                                    generateFicheHistoriqueApproPdf(
                                        'Liste historique approvisionnement',
                                        `POUR ${uniqueUser?.nom ?? ""} ${uniqueUser?.postnom ?? ""}`,
                                        approvisionnement // Passer l'objet UIApprovisionnement
                                    );
                                }}
                            >
                                <FiPrinter /> Imprimer
                            </Button>
                        </div>
                    }
                    content={
                        <>
                            {dataCreditsLoad ? (
                                <SpinLoader />
                            ) : (
                                <div>
                                    {uniqueUser && (
                                        <div className="card p-4 shadow-lg rounded-lg">
                                            <h3 className="text-xl font-semibold mb-4">Information de l&apos;agriculteur</h3>
                                            <div className="flex justify-between">
                                                <div className="flex-1 pr-4">
                                                    <p className="text-gray-700">Nom complet : <strong>{uniqueUser.nom} {uniqueUser.postnom}</strong></p>
                                                </div>
                                                <div className="flex-1 pl-4 border-l border-gray-300">
                                                    <p className="text-gray-700">Numéro de Téléphone : <strong>{uniqueUser.phone}</strong></p>
                                                    <p className="text-gray-700">Adresse Email : <strong>{uniqueUser.email}</strong></p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <p className="p-2 "><strong className="text-2xl text-[#3D843C]">Détails d&apos;Approvisionnement</strong></p>
                                    <Table
                                        dataSource={dataApprovisionnement?.data?.rows}
                                        loading={dataCreditsLoad}
                                        rowKey={(record) => record.id}
                                        columns={[
                                            {
                                                title: "Produit",
                                                dataIndex: "__tbl_ecom_produit.produit",
                                                key: "Designation produit",
                                                render: (_, item) => (
                                                    <>
                                                        <List.Item.Meta
                                                            className=" flex items-center gap-4"
                                                            avatar={<></>}
                                                            title={
                                                                <strong>
                                                                    {`${item?.__tbl_ecom_produit?.produit}`}
                                                                </strong>
                                                            }
                                                            description={item?.__tbl_ecom_category?.category}
                                                        />
                                                    </>
                                                ),
                                            },
                                            {
                                                title: "Quantité",
                                                dataIndex: "qte",
                                                key: "qte",
                                                render: (qte, record) => (
                                                    <div>
                                                        <strong>{qte}</strong> <span>{record.__tbl_ecom_unitesmesure.unity}</span>
                                                    </div>
                                                ),
                                            },
                                            {
                                                title: "Date de Production",
                                                dataIndex: "date_production",
                                                key: "date_production",
                                                render: (date) => <div>{date}</div>,
                                            },
                                            {
                                                title: "Date Approvisionnement",
                                                dataIndex: "date_reception",
                                                key: "date_reception",
                                                render: (_, item) => (
                                                    <div>{formatDate(item?.createdAt)} <br />
                                                        {geDateFormat(item?.createdAt)}

                                                    </div>
                                                ),
                                            },
                                            {
                                                title: "Coopérative",
                                                dataIndex: "coop",
                                                key: "coop",
                                                render: (_, item) => (
                                                    <>
                                                        <List.Item.Meta
                                                            className=" flex items-center gap-4"
                                                            avatar={<></>}
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
                                        ]}
                                    />
                                </div>
                            )}
                        </>
                    }
                />
            </main>
        </div>
    );
};

export default Home;