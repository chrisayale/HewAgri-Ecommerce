import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "react-query";
import { _validateCommande } from "./getCommande.service";

const useValidateCommande = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation(
    (data: { cmdid: number; token: string }) =>
      _validateCommande(data.cmdid, data.token),

    {
      onSuccess: (data) => {
        toast({
          description: `Valider avec succes`,
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

export default useValidateCommande;
