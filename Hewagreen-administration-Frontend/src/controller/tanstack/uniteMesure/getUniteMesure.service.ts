import apiRequest from "@/controller/api/config/config";
import { auth, uniteMesure } from "@/controller/api/constant/apiLink";
import { ResponseAddCategorieCooperative, ResponseUniteMesure, UniteMesureCrendentials } from "@/types";

import axios from "axios";

export const _uniteMesure = async (
  itemToke: string
): Promise<ResponseUniteMesure | undefined> => {
  try {
    const response = await apiRequest<ResponseUniteMesure | undefined>({
      method: "GET",
      endpoint: `${auth?.getUniteMesure()}`,
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

export const _addUniteMesure = async (
  itemData: UniteMesureCrendentials,
  itemToke: string
): Promise<ResponseAddCategorieCooperative> => {
  try {
    const response = await apiRequest<ResponseAddCategorieCooperative>({
      method: "POST",
      endpoint: `${uniteMesure?.addUniteMesure}`,
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

export const _updateUniteMEsure = async (
  itemData: UniteMesureCrendentials,
  itemId: number,
  itemToke: string
): Promise<any> => {
  try {
    const response = await apiRequest<any>({
      method: "PUT",
      endpoint: `${uniteMesure?.updateUniteMesure(itemId)}`,
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

export const _deleteUniteMEsure = async (
  itemId: number,
  itemToke: string
): Promise<any> => {
  try {
    const response = await apiRequest<any>({
      method: "DELETE",
      endpoint: `${uniteMesure?.deleteUniteMesure(itemId)}`,
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
