import apiRequest from "@/controller/api/config/config";
import { auth } from "@/controller/api/constant/apiLink";
import { LoginCredentials, ResponseLogin } from "@/types";
import axios from "axios";

export const _signIn = async (
  itemData: LoginCredentials
): Promise<ResponseLogin | undefined> => {
  try {
    const response = await apiRequest<ResponseLogin | undefined>({
      method: "POST",
      endpoint: `${auth?.signIn}`,
      data: itemData,
    });
    localStorage.setItem('xxx','ok');
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

export const _signInBanque = async (
  itemData: LoginCredentials
): Promise<ResponseLogin | undefined> => {
  try {
    const response = await apiRequest<ResponseLogin | undefined>({
      method: "POST",
      endpoint: `${auth?.signInBanque}`,
      data: itemData,
    });
    localStorage.setItem('xxx','yes');
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
