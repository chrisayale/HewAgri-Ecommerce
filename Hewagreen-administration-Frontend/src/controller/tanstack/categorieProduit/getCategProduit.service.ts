import apiRequest from "@/controller/api/config/config";
import { auth, categorieProduit } from "@/controller/api/constant/apiLink";
import { CategorieProduitCredentials, ResponseAddCategorieCooperative, ResponseCategoriProduit } from "@/types";

import axios from "axios";

export const _categorieProduit = async (
  itemToke: string
): Promise<ResponseCategoriProduit | undefined> => {
  try {
    const response = await apiRequest<ResponseCategoriProduit | undefined>({
      method: "GET",
      endpoint: `${auth?.getCategProduit()}`,
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

export const _addCategorieProduit = async (
  itemData: CategorieProduitCredentials,
  itemToke: string
): Promise<ResponseAddCategorieCooperative> => {
  console.log(itemData);
  try {
    const response = await apiRequest<ResponseAddCategorieCooperative>({
      method: "POST",
      endpoint: `${categorieProduit?.addCategorieProduit}`,
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

export const _updateCategoryProduit = async (
  itemData: CategorieProduitCredentials,
  itemId: number,
  itemToke: string
): Promise<any> => {
  try {
    const response = await apiRequest<any>({
      method: "PUT",
      endpoint: `${categorieProduit?.updateCategProduit(itemId)}`,
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

export const _deleteCategoryProduit = async (
  itemId: number,
  itemToke: string
): Promise<any> => {
  try {
    const response = await apiRequest<any>({
      method: "DELETE",
      endpoint: `${categorieProduit?.deleteCategProduit(itemId)}`,
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
