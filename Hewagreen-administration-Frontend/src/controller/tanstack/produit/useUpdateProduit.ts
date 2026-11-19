import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "react-query";
import { IdentificationCredentials, ProduitCredentials } from "@/types";
import { _updateProduit } from "./getProduit.service";
import axios from "axios";

const useUpdateProduit = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation(
    (data: { credentials: ProduitCredentials, useid: number; token: string }) =>
      _updateProduit(data.credentials, data.useid, data.token),

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

export default useUpdateProduit;
