import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "react-query";
import { CooperativeCredentials } from "@/types";
import { _updateCooperative } from "./getCooperative.service";
import axios from "axios";

const useUpdateCooperative = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation(
    (data: { credentials: CooperativeCredentials, useid: number; token: string }) =>
      _updateCooperative(data.credentials, data.useid, data.token),

    {
      onSuccess: (data) => {
        toast({
          description: data.message,
        });

        queryClient.invalidateQueries("data-identification");
      },
      onError: (error: any) => {
        let errorMessage = "Erreur d'enregistrement !!";

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
      }
    }
  );
};

export default useUpdateCooperative;
