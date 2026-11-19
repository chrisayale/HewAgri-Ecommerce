import { ProduitCredentials, RoleCredentials } from "@/types";
import { useMutation } from "react-query";
import { useToast } from "@/components/ui/use-toast";
import { _addProduits } from "./getProduit.service";
import axios from "axios";

const useProduit = () => {
  const { toast } = useToast();

  return useMutation(
    (data: { credentials: ProduitCredentials; token: string }) =>
      _addProduits(data.credentials, data.token),

    {
      onSuccess: (data) => {
        toast({
          description: `enregistré avec succes`,
        });
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

export default useProduit;
