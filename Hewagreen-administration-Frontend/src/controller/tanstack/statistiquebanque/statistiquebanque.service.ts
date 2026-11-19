
import apiRequest from "@/controller/api/config/config";
import { statistiqueBanque } from "@/controller/api/constant/apiLink";
import { ResponseAgriculteur ,ResponseCommandes,UIApprovisionnement} from "@/types";
import axios from "axios";


export const _loadStatistiqueByCoop = async (
    itemToke: string,
    idCoop: string
): Promise<ResponseCommandes | undefined> => {
    try {
        const response = await apiRequest<ResponseCommandes | undefined>({
            method: "GET",
            endpoint: `${statistiqueBanque?.loadstatByCoop(idCoop)}`,
            token: itemToke,
        });
        return response?.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                throw new Error(
                    error.response.data.message || "Erreur des chargements"
                );
            } else if (error.request) {
                throw new Error(
                    "Le serveur n'a pas répondu. Veuillez réessayer plus tard."
                );
            }
        }
        throw new Error("Une erreur est survenue. Veuillez réessayer.");
    }
};

export const _loadStatistiqueByMember = async (
    itemToke: string,
    idMember: string
): Promise<ResponseAgriculteur | undefined> => {
    try {
        const response = await apiRequest<ResponseAgriculteur | undefined>({
            method: "GET",
            endpoint: `${statistiqueBanque?.loadstatByMember(idMember)}`,
            token: itemToke,
        });
        return response?.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                throw new Error(
                    error.response.data.message || "Erreur des chargements"
                );
            } else if (error.request) {
                throw new Error(
                    "Le serveur n'a pas répondu. Veuillez réessayer plus tard."
                );
            }
        }
        throw new Error("Une erreur est survenue. Veuillez réessayer.");
    }
};

export const _loadApprovisionnementByMember = async (
    itemToke: string,
    idMember: string,
): Promise<UIApprovisionnement | undefined> => {
    try {
        const response = await apiRequest<UIApprovisionnement | undefined>({
            method: "GET",
            endpoint: `${statistiqueBanque?.loadstatApprovByMember(idMember)}`,
            token: itemToke,
        });
        return response?.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                throw new Error(
                    error.response.data.message || "Erreur des chargements"
                );
            } else if (error.request) {
                throw new Error(
                    "Le serveur n'a pas répondu. Veuillez réessayer plus tard."
                );
            }
        }
        throw new Error("Une erreur est survenue. Veuillez réessayer.");
    }
};