import { useToast } from "@/components/ui/use-toast";
import { saveAuthToken } from "@/controller/hooks/authToken";
import { useRouter } from "next/navigation";
import { useMutation } from "react-query";
import { _signIn, _signInBanque } from "./auth.service";
import Cookies from "js-cookie";
import { LoginCredentials } from "@/types";
import axios from "axios";

export const useLogin = () => {
  const router = useRouter();
  const { toast } = useToast();

  return useMutation(
    (credentials: LoginCredentials) => _signIn(credentials),

    {
      onSuccess: (data) => {
        saveAuthToken(data?.data?.token!);
        localStorage.setItem("user-session", JSON.stringify(data));
        Cookies.set("user-session", JSON.stringify(data), { expires: 7 });
        toast({
          description: `connecté(e) en tant que ${data?.data?.user?.email}`,
        });

        router.push("/dashboard");
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


export const useLoginBanque = () => {
  const router = useRouter();
  const { toast } = useToast();

  return useMutation(
    (credentials: LoginCredentials) => _signInBanque(credentials),

    {
      onSuccess: (data) => {
        saveAuthToken(data?.data?.token!);
        localStorage.setItem("user-session", JSON.stringify(data));
        Cookies.set("user-session", JSON.stringify(data), { expires: 7 });
        toast({
          description: `connecté(e) en tant que ${data?.data?.user?.email}`,
        });

        router.push("/infosbank");
      },
      onError: (error: any) => {
        let errorMessage = "Erreur login !!";

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
