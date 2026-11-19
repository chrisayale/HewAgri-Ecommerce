import apiRequest from "@/controller/api/config/config";
import { auth } from "@/controller/api/constant/apiLink";
import {ResponseDashboard } from "@/types";

import axios from "axios";

export const _dashboard = async (
  itemToke: string
): Promise<ResponseDashboard | undefined> => {
  try {
    const response = await apiRequest<ResponseDashboard | undefined>({
      method: "GET",
      endpoint: `${auth?.getDashboard}`,
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

