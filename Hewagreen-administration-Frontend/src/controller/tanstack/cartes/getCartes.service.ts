

import apiRequest from "@/controller/api/config/config";
import { auth, banks } from "@/controller/api/constant/apiLink";
import { BankCredentials, ResponseAddBank, ResponseAddRole, ResponseBanques} from "@/types";
import axios from "axios";

export const _cartes = async (
  itemToke: string,
  idCoop: number | undefined
): Promise<ResponseBanques | undefined> => {
  try {
    const response = await apiRequest<ResponseBanques | undefined>({
      method: "GET",
      endpoint: `${auth?.getMembresByCoop(idCoop!)}`,
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
