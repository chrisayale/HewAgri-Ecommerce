import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "react-query";
import { _deleteCommande } from "./getCommande.service";

const useDeleteCommande = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation(
    (data: { useid: number; token: string }) =>
        _deleteCommande(data.useid, data.token),

    {
      onSuccess: (data) => {
        toast({
          description: `Supprimer avec succes`,
        });

        queryClient.invalidateQueries("data-identification");
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          description: `${error}`,
        });
      },
    }
  );
};

export default useDeleteCommande;
