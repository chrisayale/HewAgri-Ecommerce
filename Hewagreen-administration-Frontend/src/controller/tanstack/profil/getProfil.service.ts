import apiRequest from "@/controller/api/config/config";
import { profile } from "@/controller/api/constant/apiLink";
import { ChangepasswordCredentials, profileCredentials, ResponseAddRole, ResponseProfile } from "@/types";

import axios from "axios";

// export const _profil = async (itemToke: string, id: string) => {
//   try {
//     const response = await apiRequest({
//       method: "GET",
//       endpoint: `${auth?.getProfil(id)}`,
//       token: itemToke,
//     });
//     console.log("Authentic:", response);
//     return response;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       if (error.response) {
//         throw new Error(
//           error.response.data.message || "Erreur lors de l'authentification"
//         );
//       } else if (error.request) {
//         throw new Error(
//           "Le serveur n'a pas répondu. Veuillez réessayer plus tard."
//         );
//       }
//     }
//     throw new Error("Une erreur est survenue. Veuillez réessayer.");
//   }
// };
export const _profil = async (
  itemToke: string,
  id: string
): Promise<ResponseProfile | undefined> => {
  try {
    const response = await apiRequest<ResponseProfile | undefined>({
      method: "GET",
      endpoint: `${profile?.getProfil(id)}`,
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

export const _updateProfile = async (
  itemData: profileCredentials,
  itemId: number,
  itemToke: string
): Promise<any> => {
  try {
    const response = await apiRequest<any>({
      method: "PUT",
      endpoint: `${profile?.updateUserProfil(itemId)}`,
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

export const _changePassword  = async (
  itemData: ChangepasswordCredentials,
  itemToke: string
): Promise<ResponseAddRole> => {
  console.log(itemData);
  try {
    const response = await apiRequest<ResponseAddRole>({
      method: "POST",
      endpoint: `${profile?.cnhagePassword}`,
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