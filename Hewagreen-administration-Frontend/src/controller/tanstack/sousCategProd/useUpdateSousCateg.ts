import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "react-query";
import { SousCategorieCredentials } from "@/types";
import { _updateSousCategoryProduit } from "./getSousCategProduit.service";
import axios from "axios";

const useUpdatesousCateg = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation(
    (data: { credentials: SousCategorieCredentials, useid: number; token: string }) =>
        _updateSousCategoryProduit(data.credentials, data.useid, data.token),

    {
      onSuccess: (data) => {
        toast({
          description: `Modifier avec succes`,
        });

        queryClient.invalidateQueries("data-identification");
      },
      onError: (error: any) => {
        let errorMessage = "Erreur de la suppression !!";

        if (axios.isAxiosError(error)) {
          if (error.response && error.response.data) {
            const responseData = error.response.data as { message?: string };
            errorMessage = responseData.message || errorMessage;
          } else if (error.message) {
            errorMessage = error.message;
          }
        } else if (typeof error === 'object' && error !== null && 'message' in error) {
          errorMessage = error.message;
        }

        toast({
          variant: "destructive",
          description: errorMessage
        });
      },
    }
  );
};

export default useUpdatesousCateg;
