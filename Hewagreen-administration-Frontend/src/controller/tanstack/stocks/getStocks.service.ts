import apiRequest from "@/controller/api/config/config";
import { auth, historiqueStock, stocks } from "@/controller/api/constant/apiLink";
import { historiqueApprovCredentials, ResponseAddRole, ResponseHistoryStock, ResponseStock, StockCredentials } from "@/types";

import axios from "axios";

export const _stocks = async (itemToke: string): Promise<ResponseStock | undefined> => {
  try {
    const response = await apiRequest<ResponseStock | undefined>({
      method: "GET",
      endpoint: `${auth?.getStock()}`,
      token: itemToke,
    });
    return response?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(
          error.response.data.message || "Erreur lors de l'authentification"
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

export const _stocksByCoop = async (itemToke: string, id: string): Promise<ResponseStock | undefined> => {
  try {
    const response = await apiRequest<ResponseStock | undefined>({
      method: "GET",
      endpoint: `${auth?.gestStockByCoop(id)}`,
      token: itemToke,
    });
    return response?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(
          error.response.data.message || "Erreur lors du chargement"
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


export const _historystocks= async (itemToke: string, id: string): Promise<ResponseHistoryStock | undefined> => {
  try {
    const response = await apiRequest<ResponseHistoryStock | undefined>({
      method: "GET",
      endpoint: `${auth?.getHistoryStock(id)}`,
      token: itemToke,
    });
    return response?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(
          error.response.data.message || "Erreur lors du chargement"
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


export const _addStocks = async (
  itemData: StockCredentials,
  itemToke: string
): Promise<ResponseAddRole> => {
  try {
    const response = await apiRequest<ResponseAddRole>({
      method: "POST",
      endpoint: `${stocks?.addStocks}`,
      data: itemData,
      token: itemToke,
    });
    return response?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(
          error.response.data.message || "Erreur lors de l'enregistrement"
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

export const _stocksByUser= async (itemToke: string, id: number): Promise<ResponseHistoryStock | undefined> => {
  try {
    const response = await apiRequest<ResponseHistoryStock | undefined>({
      method: "GET",
      endpoint: `${stocks?.stockUser(id)}`,
      token: itemToke,
    });
    return response?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(
          error.response.data.message || "Erreur lors du chargement"
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


export const _historByIdCooperative = async (itemToke: string, idCoop: number): Promise<historiqueApprovCredentials | undefined> => {
  try {
    const response = await apiRequest<historiqueApprovCredentials | undefined>({
      method: "GET",
      endpoint: `${historiqueStock?.historiByIdCoop(idCoop)}`,
      token: itemToke,
    });
    return response?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(
          error.response.data.message || "Erreur lors de l'authentification"
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

export const _historByIdUser = async (itemToke: string, idUser: number): Promise<historiqueApprovCredentials | undefined> => {
  try {
    const response = await apiRequest<historiqueApprovCredentials | undefined>({
      method: "GET",
      endpoint: `${historiqueStock?.historiByIdUser(idUser)}`,
      token: itemToke,
    });
    return response?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(
          error.response.data.message || "Erreur lors de l'authentification"
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

