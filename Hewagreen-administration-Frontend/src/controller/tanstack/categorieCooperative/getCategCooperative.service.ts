import apiRequest from "@/controller/api/config/config";
import { auth, categorieCooperative } from "@/controller/api/constant/apiLink";
import {CatergorieCooperativeCredentials, ResponseAddCategorieCooperative, ResponseCatergorieCooperative } from "@/types";

import axios from "axios";

export const _categorieCooperative = async (
  itemToke: string
): Promise<ResponseCatergorieCooperative | undefined> => {
  try {
    const response = await apiRequest<ResponseCatergorieCooperative | undefined>({
      method: "GET",
      endpoint: `${auth?.getCategCooperative()}`,
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

export const _addCategorieCooperative = async (
  itemData: CatergorieCooperativeCredentials,
  itemToke: string
): Promise<ResponseAddCategorieCooperative> => {
  console.log(itemData);
  try {
    const response = await apiRequest<ResponseAddCategorieCooperative>({
      method: "POST",
      endpoint: `${categorieCooperative?.addCategorieCooperative}`,
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

export const _updateCategorieCooperative = async (
  itemData: CatergorieCooperativeCredentials,
  itemId: number,
  itemToke: string
): Promise<any> => {
  try {
    const response = await apiRequest<any>({
      method: "PUT",
      endpoint: `${categorieCooperative?.updateCoop(itemId)}`,
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


export const _deleteCategCooperative = async (
  itemId: number,
  itemToke: string
): Promise<any> => {
  try {
    const response = await apiRequest<any>({
      method: "DELETE",
      endpoint: `${categorieCooperative?.deleteCategCoop(itemId)}`,
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