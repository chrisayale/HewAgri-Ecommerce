import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "react-query";
import {_addRoleToUser, _updateIdentification } from "./getIdentification.service";
import { AddorDeleteRoleUser } from "@/types";
import axios from "axios";

const useAddRoleTouser = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation(
    (data: { credentials: AddorDeleteRoleUser,token: string }) =>
      _addRoleToUser(data.credentials, data.token),

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
      },
    }
  );
};

export default useAddRoleTouser;
