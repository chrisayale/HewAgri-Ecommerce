import apiRequest from "@/controller/api/config/config";
import { auth, role, typeLivraison } from "@/controller/api/constant/apiLink";
import { ResponseAddRole, ResponseRole, ResponseTypeLivraison, RoleCredentials, TypeLivraisonCredentials } from "@/types";
import axios from "axios";

export const _typeLivraison = async (
  itemToke: string
): Promise<ResponseTypeLivraison | undefined> => {
  try {
    const response = await apiRequest<ResponseTypeLivraison | undefined>({
      method: "GET",
      endpoint: `${auth?.getTypeLivraison()}`,
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

export const _addTypeLivraison = async (
  itemData: TypeLivraisonCredentials,
  itemToke: string
): Promise<ResponseAddRole> => {
  console.log(itemData);
  try {
    const response = await apiRequest<ResponseAddRole>({
      method: "POST",
      endpoint: `${typeLivraison?.addTypeLivraison}`,
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

export const _updateTypeLivraison = async (
  itemData: TypeLivraisonCredentials,
  itemId: number,
  itemToke: string
): Promise<any> => {
  try {
    const response = await apiRequest<any>({
      method: "PUT",
      endpoint: `${typeLivraison?.updateTypeLivraison(itemId)}`,
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

export const _deleteTypeLivraison = async (
  itemId: number,
  itemToke: string
): Promise<any> => {
  try {
    const response = await apiRequest<any>({
      method: "DELETE",
      endpoint: `${typeLivraison?.deleteTypeLivraison(itemId)}`,
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