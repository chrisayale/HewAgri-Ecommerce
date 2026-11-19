import apiRequest from "@/controller/api/config/config";
import { carousels } from "@/controller/api/constant/apiLink";
import { CarouselCredentials, ResponseCarousel } from "@/types";
import axios from "axios";

export const _carousels = async (
  itemToke: string
): Promise<ResponseCarousel | undefined> => {
  try {
    const response = await apiRequest<ResponseCarousel | undefined>({
      method: "GET",
      endpoint: `${carousels?.loadCarousel}`,
      token: itemToke,
    });
    return response?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(
          error.response.data.message || "Erreur lors de l'affichage"
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

export const _deleteCarousel = async (
    itemId: number,
    itemToke: string
  ): Promise<any> => {
    try {
      const response = await apiRequest<any>({
        method: "DELETE",
        endpoint: `${carousels?.deleteCarousel(itemId)}`,
        token: itemToke,
      });
      return response?.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(
            error.response.data.message || "Erreur lors de la suppression"
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