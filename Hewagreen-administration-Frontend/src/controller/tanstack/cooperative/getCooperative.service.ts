import apiRequest from "@/controller/api/config/config";
import { auth, cooperative } from "@/controller/api/constant/apiLink";
import {
  CooperativeCredentials,
  ResponseCooperative,
  ResponseCooperativeCredentials,
} from "@/types";

import axios from "axios";

export const _cooperative = async (
  itemToke: string
): Promise<ResponseCooperative | undefined> => {
  try {
    const response = await apiRequest<ResponseCooperative | undefined>({
      method: "GET",
      endpoint: `${auth?.getCooperative()}`,
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

export const _addCooperative = async (
  itemData: CooperativeCredentials,
  itemToke: string
): Promise<ResponseCooperativeCredentials> => {
  console.log(itemData, "cop");
  try {
    
    const response = await apiRequest<ResponseCooperativeCredentials>({
      method: "POST",
      endpoint: `${cooperative?.addCooperative}`,
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

export const _updateCooperative = async (
  itemData: CooperativeCredentials,
  itemId: number,
  itemToke: string
): Promise<any> => {
  try {
    const response = await apiRequest<any>({
      method: "PUT",
      endpoint: `${cooperative?.updateCooperative(itemId)}`,
      data: itemData,
      token: itemToke,
    });
    return response?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(
          error.response.data.message || "Erreur lors de la modification"
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


export const _deleteCooperative = async (
  itemId: number,
  itemToke: string
): Promise<any> => {
  try {
    const response = await apiRequest<any>({
      method: "DELETE",
      endpoint: `${cooperative?.deleteCooperative(itemId)}`,
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
