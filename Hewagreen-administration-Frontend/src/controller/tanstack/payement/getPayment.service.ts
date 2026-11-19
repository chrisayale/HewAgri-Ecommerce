
import apiRequest from "@/controller/api/config/config";
import { auth } from "@/controller/api/constant/apiLink";
import {ResponsePaiement } from "@/types";
import axios from "axios";

export const _payement = async (itemToke: string): Promise<ResponsePaiement | undefined> => {
  try {
    const response = await apiRequest<ResponsePaiement | undefined>({
      method: "GET",
      endpoint: `${auth?.getPayment()}`,
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

