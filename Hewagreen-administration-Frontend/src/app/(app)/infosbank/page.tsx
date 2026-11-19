"use client"
import { FaUniversity, FaCreditCard, FaMoneyCheck, FaBuilding } from "react-icons/fa";
import { useEffect, useState } from "react";
import { frenchFormattedDate } from "@/lib/dates";

const InfosBank = () => {
    const [userInfo, setUserInfo] = useState<any>(null);
    const [activeMenu, setActiveMenu] = useState<string>("Bank Account"); // Par défaut, l'onglet "Bank Account" est actif

    useEffect(() => {
        const userSession = localStorage.getItem("user-session");
        if (userSession) {
            const parsedSession = JSON.parse(userSession);
            setUserInfo(parsedSession?.data?.user || null);
        }
    }, []);

    // Fonction pour rendre conditionnellement le contenu en fonction de l'onglet actif
    const renderContent = () => {
        switch (activeMenu) {
            case "Bank Account":
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold">Bank Name</h3>
                            <input
                                type="text"
                                className="border border-gray-300 rounded-lg p-3 w-full mt-2"
                                value={userInfo?.__tbl_ecom_bank?.bank || 'N/A'}
                                disabled
                            />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Account Number</h3>
                            <input
                                type="text"
                                className="border border-gray-300 rounded-lg p-3 w-full mt-2"
                                value={userInfo?.__tbl_ecom_bank?.account_number || 'N/A'}
                                disabled
                            />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">E-mail</h3>
                            <input
                                type="text"
                                className="border border-gray-300 rounded-lg p-3 w-full mt-2"
                                value={userInfo?.__tbl_ecom_bank?.email || 'N/A'}
                                disabled
                            />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Telephone</h3>
                            <input
                                type="text"
                                className="border border-gray-300 rounded-lg p-3 w-full mt-2"
                                value={userInfo?.__tbl_ecom_bank?.phone || 'N/A'}
                                disabled
                            />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Description</h3>
                            <input
                                type="text"
                                className="border border-gray-300 rounded-lg p-3 w-full mt-2"
                                value={userInfo?.__tbl_ecom_bank?.description || 'N/A'}
                                disabled
                            />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Date creation</h3>
                            <input
                                type="text"
                                className="border border-gray-300 rounded-lg p-3 w-full mt-2"
                                value={frenchFormattedDate(userInfo?.__tbl_ecom_bank?.createdAt)}
                                disabled
                            />
                        </div>

                    </div>
                );
            case "Info du responsable":
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold">Nom du responsable</h3>
                            <input
                                type="text"
                                className="border border-gray-300 rounded-lg p-3 w-full mt-2"
                                value={`${userInfo?.nom} ${userInfo?.postnom} ${userInfo?.prenom}`}
                                disabled
                            />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Genre</h3>
                            <input
                                type="text"
                                className="border border-gray-300 rounded-lg p-3 w-full mt-2"
                                value={userInfo?.sexe || 'N/A'}
                                disabled
                            />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">E-mail</h3>
                            <input
                                type="text"
                                className="border border-gray-300 rounded-lg p-3 w-full mt-2"
                                value={userInfo?.email || 'N/A'}
                                disabled
                            />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Telephone</h3>
                            <input
                                type="text"
                                className="border border-gray-300 rounded-lg p-3 w-full mt-2"
                                value={userInfo?.phone || 'N/A'}
                                disabled
                            />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Date de naissance</h3>
                            <input
                                type="text"
                                className="border border-gray-300 rounded-lg p-3 w-full mt-2"
                                value={frenchFormattedDate(userInfo?.date_naiss) || 'N/A'}
                                disabled
                            />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Role</h3>
                            {userInfo.__tbl_ecom_roles?.map((role: any) => (
                                        <span key={role.id} className="inline-block bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-sm font-medium">
                                            {role.role}
                                        </span>
                                    ))}
                        </div>

                    </div>
                );

                case "Adresse":
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold">Province</h3>
                            <input
                                type="text"
                                className="border border-gray-300 rounded-lg p-3 w-full mt-2"
                                value={`${userInfo?.__tbl_ecom_province?.province || 'N/A'}`}
                                disabled
                            />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Territoire</h3>
                            <input
                                type="text"
                                className="border border-gray-300 rounded-lg p-3 w-full mt-2"
                                value={userInfo?.__tbl_ecom_territoire?.territoire || 'N/A'}
                                disabled
                            />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Village</h3>
                            <input
                                type="text"
                                className="border border-gray-300 rounded-lg p-3 w-full mt-2"
                                value={userInfo?.__tbl_ecom_village?.village || 'N/A'}
                                disabled
                            />
                        </div>
                        

                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-semibold">Bank Information</h2>
                </div>
                <nav className="flex flex-col p-4 space-y-4">
                    <SidebarLink
                        icon={FaUniversity}
                        label="Bank Account"
                        active={activeMenu === "Bank Account"}
                        onClick={() => setActiveMenu("Bank Account")}
                    />
                    <SidebarLink
                        icon={FaCreditCard}
                        label="Info du responsable"
                        active={activeMenu === "Info du responsable"}
                        onClick={() => setActiveMenu("Info du responsable")}
                    />
                    <SidebarLink
                        icon={FaCreditCard}
                        label="Adresse"
                        active={activeMenu === "Adresse"}
                        onClick={() => setActiveMenu("Adresse")}
                    />

                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
                    <h2 className="text-2xl font-semibold border-b pb-4 mb-6">{activeMenu}</h2>

                    {/* Content Section */}
                    {userInfo ? renderContent() : (
                        <div className="flex justify-center items-center h-64">
                            <p className="text-gray-500">Chargement des informations...</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

// SidebarLink Component
const SidebarLink = ({ icon: Icon, label, active, onClick }: { icon: React.ComponentType; label: string; active?: boolean; onClick: () => void }) => (
    <button
        className={`flex items-center space-x-4 p-2 rounded-lg text-gray-700 w-full text-left ${active ? 'bg-green-100 font-bold' : 'hover:bg-gray-200'}`}
        onClick={onClick}
    >
        <Icon />
        <span>{label}</span>
    </button>
);

export default InfosBank;
