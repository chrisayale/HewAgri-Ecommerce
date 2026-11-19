import apiRequest from "@/controller/api/config/config";
import { creditsBanque } from "@/controller/api/constant/apiLink";
import {  ResponseCredits } from "@/types";

import axios from "axios";


export const _loadCreditByStatus = async (
    itemToke: string,
    status: string
): Promise<ResponseCredits | undefined> => {
    try {
        const response = await apiRequest<ResponseCredits | undefined>({
            method: "GET",
            endpoint: `${creditsBanque?.loadCreditByStatus(status)}`,
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

export const _loadCreditByCoopAndStatus = async (
    itemToke: string,
    idCoop: string,
    status: string
): Promise<ResponseCredits | undefined> => {
    try {
        const response = await apiRequest<ResponseCredits | undefined>({
            method: "GET",
            endpoint: `${creditsBanque?.loadCreditByCoopAndStatus(idCoop, status)}`,
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

export const _loadCreditByMemberAndStatus = async (
    itemToke: string,
    idmember: string,
    status: string
): Promise<ResponseCredits | undefined> => {
    try {
        const response = await apiRequest<ResponseCredits | undefined>({
            method: "GET",
            endpoint: `${creditsBanque?.loadCreditByMemberAndStatus(idmember, status)}`,
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