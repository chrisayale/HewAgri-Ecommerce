import apiRequest from "@/controller/api/config/config";
import { agriculteur, auth } from "@/controller/api/constant/apiLink";
import { AgriculteurCredentials, ResponseAddRole, ResponseAgriculteur } from "@/types";

import axios from "axios";

export const _agriculteur = async (
  itemToke: string
): Promise<ResponseAgriculteur | undefined> => {
  try {
    const response = await apiRequest<ResponseAgriculteur | undefined>({
      method: "GET",
      endpoint: `${auth?.getAgriculteur()}`,
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

export const _agriculteurById = async (
  itemToke: string,
  id: string
): Promise<ResponseAgriculteur | undefined> => {
  try {
    const response = await apiRequest<ResponseAgriculteur | undefined>({
      method: "GET",
      endpoint: `${agriculteur?.loadAgriById(id)}`,
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

export const _addAgriculteur  = async (
  itemData: AgriculteurCredentials,
  itemToke: string
): Promise<ResponseAddRole> => {
  try {
    const response = await apiRequest<ResponseAddRole>({
      method: "PUT",
      endpoint: `${agriculteur?.addAgriculteur}`,
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