import { CooperativeCredentials } from "@/types";
import { useMutation } from "react-query";
import { useToast } from "@/components/ui/use-toast";
import { _addCooperative } from "./getCooperative.service";
import axios from "axios";

const useCooperative = () => {
  const { toast } = useToast();

  return useMutation(
    (data: { credentials: CooperativeCredentials; token: string }) =>
      _addCooperative(data.credentials, data.token),

    {
      onSuccess: (data) => {
        toast({
          description: data.message,
        });
      },
      onError: (error: any) => {
        let errorMessage = "Erreur de la suppression !!";

        if (axios.isAxiosError(error)) {
          if (error.response && error.response.data) {
            const responseData = error.response.data as {
              message?: string;
              data?: { type?: string; value?: string; msg?: string; path?: string; location?: string }[];
            };
            if (responseData.message) {
              errorMessage = responseData.message;
            } else if (responseData.data && responseData.data.length > 0) {
              const firstError = responseData.data[0];
              errorMessage = firstError.msg || errorMessage;
            }
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

export default useCooperative;

