"use client";
import useAuth from "@/controller/hooks/useAuth";
import { _agriculteurById } from "@/controller/tanstack/agriculteurs/getAgriculteur.service";
import { _commandes } from "@/controller/tanstack/commande/getCommande.service";
import { _cooperative } from "@/controller/tanstack/cooperative/getCooperative.service";
import LayoutCompWithTable from "@/view/model/LayoutCompWithTable";
import { Tabs, TabsProps } from "antd";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { Avatar, Input, List, Table, Tag, Select } from "antd";
import { _loadStatistiqueByMember } from "@/controller/tanstack/statistiquebanque/statistiquebanque.service";

const { Option } = Select;


const VenteParMembre = () => {
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
    
        const { data: dataAgricultureById, isLoading: dataAgriculteurLoard, refetch: refetchAgri } = useQuery(
            "auth-categby22",
            () => {
                if (activeCooperative1) {
                    return _agriculteurById(token!, activeCooperative1);
                }
                return Promise.resolve(null); // Ou gérez-le comme bon vous semble
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
                        return _loadStatistiqueByMember(token!, activeMember1);
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
            setActiveCooperative1(value)
        };

    return <div>
        <div>
            <main>
                <h2 className="font-semibold text-xl">Hsitorique de vente par membre</h2>
                <div
                    className="mt-3"

                >
                    <LayoutCompWithTable
                        title={<></>}
                        btn={
                            <div className="w-full md:w-auto md:mr-4 flex gap-4 items-center">
        
                                <div className="w-full sm:w-auto sm:ml-5">
                                    <Select
                                        showSearch
                                        style={{ width: "100%" }}
                                        placeholder="Listes des Cooperatives"
                                        optionFilterProp="children"
                                        filterOption={(input: string, option: any) =>
                                            option.children
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0
                                        }
                                        onChange={handleCoopChange}
                                        loading={isLoadingCooperative}
                                    >
                                        <Option value="">Listes...</Option>
                                        {dataCooperativeSelect?.data?.rows.map((item) => (
                                            <Option key={item.id} value={item.id}>
                                                {item.cooperative}
                                            </Option>
                                        ))}
                                    </Select>
                                </div>
        
                                <div className="w-full sm:w-auto sm:ml-5" style={{ width: "100%" }}>
                                    <Select
                                        showSearch
                                        style={{ width: "100%" }}
                                        placeholder="Listes des membres"
                                        optionFilterProp="children"
                                        filterOption={(input: string, option: any) =>
                                            option.children
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0
                                        }
                                        onChange={handleCoopChange}
                                        loading={dataAgriculteurLoard}
                                    >
                                        <Option value="">Listes des membres...</Option>
                                        {dataAgricultureById?.data?.rows.map((item) => (
                                            <Option key={item.__tbl_ecom_user.id} value={item.__tbl_ecom_user.id}>
                                                {item.__tbl_ecom_user.nom + ' ' + item.__tbl_ecom_user.postnom + ' ' + item.__tbl_ecom_user.prenom}
                                            </Option>
                                        ))}
                                    </Select>
                                </div>
        
        
                                {/* <Input.Search
                                    placeholder="Rechercher un utilisateur"
                                    className="placeholder:!text-xs"
                                    onSearch={(v) => setSearchedText(v)}
                                    onChange={(e) => setSearchedText(e.target.value)}
                                /> */}
        
        
                                {/* <Button onClick={() => generateCreditsPdf('Liste des credits', filteredData)}><FiPrinter />Imprimer</Button> */}
                            </div>
                        }
                        content={<></>}
                    />
                </div>
            </main>
        </div>

    </div>;
};

export default VenteParMembre;
