import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "react-query";
import { profileCredentials } from "@/types";
import axios from "axios";
import { _updateProfile } from "./getProfil.service";

const _useUpdateProfile = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    return useMutation(
        (data: { credentials1: profileCredentials, roleid: number; token: string }) =>
            _updateProfile(data.credentials1, data.roleid, data.token),

        {
            onSuccess: (data) => {
                toast({
                    description: `Modifier avec succes`,
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

export default _useUpdateProfile;
