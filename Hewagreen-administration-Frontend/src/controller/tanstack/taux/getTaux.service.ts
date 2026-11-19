
import apiRequest from "@/controller/api/config/config";
import { auth } from "@/controller/api/constant/apiLink";
import {ResponseTaux } from "@/types";
import axios from "axios";

export const _taux = async (itemToke: string): Promise<ResponseTaux | undefined> => {
  try {
    const response = await apiRequest<ResponseTaux | undefined>({
      method: "GET",
      endpoint: `${auth?.getTaux()}`,
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

