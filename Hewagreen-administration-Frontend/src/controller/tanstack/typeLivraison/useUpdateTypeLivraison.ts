import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "react-query";
import { TypeLivraisonCredentials } from "@/types";
import { _updateTypeLivraison } from "./getTypeLivraison.service";
import axios from "axios";

const useUpdateTypeLivraison = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation(
    (data: { credentials: TypeLivraisonCredentials, useid: number; token: string }) =>
      _updateTypeLivraison(data.credentials, data.useid, data.token),

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

export default useUpdateTypeLivraison;
