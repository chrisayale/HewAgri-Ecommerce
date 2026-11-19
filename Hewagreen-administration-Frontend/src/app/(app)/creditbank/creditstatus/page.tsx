"use client"
import { Button } from '@/components/ui/button';
import useAuth from '@/controller/hooks/useAuth';
import { _loadCreditByStatus } from '@/controller/tanstack/credibank/getCreditBank.service';
import LayoutCompWithTable from '@/view/model/LayoutCompWithTable';
import { Avatar, Input, List, Table, Tag, Select } from "antd";
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query';
import { ListCollapse } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import SpinLoader from '@/components/global/lazy/SpinLoader';
import { baseURL } from '@/controller/api/config/baseUrl';
import CreditStatusButtons from '../component/CreditStatusButton';
import { CrediAgricole } from '@/types';
import useValidateCredit from '@/controller/tanstack/credits/useValidateCredit';
import { _province } from '@/controller/tanstack/province/getProvince.service';
import { _territoire } from '@/controller/tanstack/territoire/getTerritoire.service';
import { _identification } from '@/controller/tanstack/identification/getIdentification.service';
import { _categorieCooperative } from '@/controller/tanstack/categorieCooperative/getCategCooperative.service';
import { generateCreditsPdf } from '@/components/docs/creditspdf';
import { FiPrinter } from 'react-icons/fi';
const { Option } = Select;

const statusMap = {
    1: "Validé",
    2: "En examen",
    3: "Rejetée",
    0: "En attente"
};
const CreditByStatus = () => {
    const { token } = useAuth();
    const [idTerritoire, _setIdTerritoire] = useState('');
    const [nameStatus, setNameStatus] = useState(Object.keys(statusMap)[0]); // Initialiser avec la première clé
    const [isModalOpen1, setIsModalOpen1] = useState(false);
    const [file, setFile] = useState('');
    const [title, setTitle] = useState("")

    const { data: dataCredits, isLoading: dataCreditsLoad } = useQuery(
        ["auth-credits-status1", nameStatus],
        () => _loadCreditByStatus(token!, nameStatus),
        {
            enabled: !!nameStatus,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
        }
    );
    const {
        mutateAsync: _validateCredit,
    } = useValidateCredit();

    const { data: dataProvince } = useQuery(
        "auth-province1",
        () => _province(token!)
    );
    const { data: dataTerritoire } = useQuery(
        "auth-territoire1",
        () => _territoire(token!, idTerritoire)
    );

    const { data: dataIdentification } =
        useQuery("auth-profil12", () => _identification(token!));

    const { data: dataCategCooperative } = useQuery("auth-categ", () =>
        _categorieCooperative(token!)
    );

    const handleStatusChange = (value: any) => {
        setNameStatus(value);
    };

    const [searchedText, setSearchedText] = useState<string>("");
    const filteredData = dataCredits?.data.rows?.filter(
        // (item: any): boolean => {
        //     return Object.keys(item).some((key: string) =>
        //         item?.__tbl_ecom_user[key]?.toString().toLowerCase().includes(searchedText.toLowerCase())
        //     );
        // }

        (item: any): boolean => {
            return Object.keys(item).some((key: string) =>
                item?.__tbl_ecom_cooperative && // Vérification ajoutée ici
                item?.__tbl_ecom_cooperative[key]?.toString().toLowerCase().includes(searchedText.toLowerCase())
            );
        }
    );

    const [credentials, setCredentials] = useState<CrediAgricole>({
        state: 0,  // Initialiser avec une valeur numérique par défaut
    });
    const [_dataCreditsLoad1, setDataCreditsLoad] = useState(false);
    const [currentCreditId, setCurrentCreditId] = useState<number | null>(null);
    useEffect(() => {
        if (currentCreditId !== null && credentials.state !== null) {
            handleValidateCredit(currentCreditId);
        }
    }, [credentials.state]);  // Exécute le hook quand l'état change

    const handleValidateCredit = async (creditId: number) => {
        try {
            setDataCreditsLoad(true); // Début du chargement
            await _validateCredit({
                credentials: {
                    state: credentials.state,  // Utiliser l'état en tant que nombre
                },
                creditid: creditId,
                token: token!, // Assurez-vous que le token est défini
            });
            console.log("Crédit validé avec succès pour l'ID:", creditId);
        } catch (error) {
            console.error("Erreur lors de la validation du crédit:", error);
        } finally {
            setDataCreditsLoad(false); // Fin du chargement
        }
    };

    const handleUpdateStatus = (creditId: number, newState: number) => {
        setCredentials({ state: newState });  // Assurez-vous que newState est un nombre
        setCurrentCreditId(creditId);  // Stocke l'ID du crédit pour la validation
    };
    const handleOpenFile = (file: any, item: any) => {
        setIsModalOpen1(true);
        setFile(file)
        setTitle(item)
    }

    return (
        <div>
            <LayoutCompWithTable
                title="Liste des Crédits par Statut"
                btn={
                    <div className="w-full md:w-auto md:mr-4 flex gap-4 items-center">
                        <Input.Search
                            placeholder="Rechercher un utilisateur"
                            className="placeholder:!text-xs"
                            onSearch={(v) => setSearchedText(v)}
                            onChange={(e) => setSearchedText(e.target.value)}
                        />
                        <Select
                            showSearch
                            style={{ width: "100%" }}
                            placeholder="Sélectionner un statut"
                            optionFilterProp="children"
                            onChange={handleStatusChange}
                            value={nameStatus}
                        >
                            {Object.entries(statusMap).map(([key, value]) => (
                                <Option key={key} value={key}>
                                    {value} ({key}) {/* Affiche le chiffre à côté du nom */}
                                </Option>
                            ))}
                        </Select>
                        <Button onClick={() => generateCreditsPdf('Liste des credits', filteredData)}><FiPrinter />Imprimer</Button>
                    </div>
                }
                content={
                    <>
                        {
                            dataCreditsLoad ? (
                                <div className="absolute top-10 left-0 right-0 z-10 flex justify-center items-center" style={{ height: '100%' }}>
                                    <SpinLoader />
                                </div>
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
                                                render: (_, item, index) => {
                                                    // Vérifiez si __tbl_ecom_user existe
                                                    if (!item?.__tbl_ecom_user) {
                                                        return null; // Ne rien afficher si __tbl_ecom_user est null
                                                    }

                                                    return (
                                                        <List.Item.Meta
                                                            className="flex items-center gap-4"
                                                            avatar={<Avatar src={item.__tbl_ecom_user.avatar} />}
                                                            title={
                                                                <strong>
                                                                    {`${item.__tbl_ecom_user.nom || ""} ${item.__tbl_ecom_user.postnom || ""} ${item.__tbl_ecom_user.prenom || ""}`}
                                                                </strong>
                                                            }
                                                            description={`Téléphone : ${item.__tbl_ecom_user.phone}`}
                                                        />
                                                    );
                                                },
                                            },
                                            {
                                                title: "Credits",
                                                dataIndex: "credit",
                                                key: "credit",
                                                render: (_, item, index) => (
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
                                                render: (_, item, index) => <a>{item?.periode_remboursement} mois</a>,
                                            },
                                            {
                                                title: "Coopérative",
                                                dataIndex: "coop",
                                                key: "coop",
                                                render: (_, item, index) => (
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
                                                render: (_, item, index) => (
                                                    <>
                                                        {item?.status === 0 && (
                                                            <Tag color="green" className="p-1">
                                                                En attente
                                                            </Tag>
                                                        )}
                                                        {item?.status === 1 && (
                                                            <Tag color="blue" className="p-1">
                                                                Validé
                                                            </Tag>
                                                        )}
                                                        {item?.status === 2 && (
                                                            <Tag color="red" className="p-1">
                                                                Rejeté
                                                            </Tag>
                                                        )}
                                                        {item?.status === 3 && (
                                                            <Tag color="orange" className="p-1">
                                                                En cours
                                                            </Tag>
                                                        )}
                                                    </>
                                                ),
                                            },

                                            {
                                                title: "Banque",
                                                dataIndex: "bank",
                                                key: "bank",
                                                render: (_, item, index) => (
                                                    <>
                                                        <List.Item.Meta
                                                            className=" flex items-center gap-4"
                                                            // avatar={<Avatar />}
                                                            title={
                                                                <strong>
                                                                    {`${item?.__tbl_ecom_bank?.bank || ''}`}
                                                                </strong>
                                                            }
                                                            description={item?.__tbl_ecom_bank?.phone || ""}
                                                        />
                                                    </>
                                                ),
                                            },

                                            {
                                                title: "Détail",
                                                key: "datail",
                                                align: "center",
                                                render: (_, item, index) => (
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
                                                                                {/* <Popconfirm
                                                                                    placement="bottom"
                                                                                    title="Validation Crédits"
                                                                                    description="Voulez-vous vraiment valider ce Crédit ?"
                                                                                    okText="Validé le Crédit"
                                                                                    cancelText="Abandonner"
                                                                                    onConfirm={() => handleValidateCredit(item?.id)}
                                                                                >
                                                                                    <Button disabled={item?.status !== 0}>
                                                                                        Validation du crédit
                                                                                    </Button>
                                                                                </Popconfirm> */}
                                                                                {/* <Button disabled={item?.status !== 0}
                                                                                    onClick={() => handleValidateCredit(item?.id)}
                                                                                >
                                                                                    {dataCreditsLoad ? (
                                                                                        <Loader />
                                                                                    ) : (
                                                                                        "Validation du crédit"
                                                                                    )}
    
                                                                                </Button> */}

                                                                                <CreditStatusButtons
                                                                                    item={{ id: item?.id, status: credentials.state }}  // Crédit en attente avec l'ID 123
                                                                                    dataCreditsLoad={dataCreditsLoad}  // Passer l'indicateur de chargement
                                                                                    handleUpdateStatus={handleUpdateStatus}  // Fonction de changement de statut
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
                                                                                                        {`${item?.__tbl_ecom_user?.nom} ${item?.__tbl_ecom_user?.postnom} ${item?.__tbl_ecom_user?.prenom}`}
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
                                                                                            {
                                                                                                item?.__tbl_ecom_cooperative?.isformel === 1 && (
                                                                                                    <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4">
                                                                                                        <dt className="text-sm font-medium text-gray-500">Document</dt>
                                                                                                        <dd
                                                                                                            onClick={() => handleOpenFile(item?.__tbl_ecom_cooperative?.file, item?.__tbl_ecom_cooperative?.cooperative)}
                                                                                                            className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 cursor-pointer"
                                                                                                        >
                                                                                                            <Tag color="green" className="p-1 w-[50%] flex justify-center">
                                                                                                                Fichier PDF
                                                                                                            </Tag>
                                                                                                        </dd>
                                                                                                    </div>
                                                                                                )
                                                                                            }


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

                                                                                            {/* <div className="py-3 sm:py-2 sm:grid sm:grid-cols-3 sm:gap-4 ">
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
                                                                                            </div> */}
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
        </div>
    )
}

export default CreditByStatus