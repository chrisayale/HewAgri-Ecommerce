import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "react-query";
import { _deleteCategoryProduit } from "./getCategProduit.service";
import axios from "axios";

const useDeleteCategProduit = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation(
    (data: { useid: number; token: string }) =>
        _deleteCategoryProduit(data.useid, data.token),

    {
      onSuccess: (data) => {
        toast({
          description: `Supprimer avec succes`,
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

export default useDeleteCategProduit;
