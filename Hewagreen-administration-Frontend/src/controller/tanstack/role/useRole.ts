import { RoleCredentials } from "@/types";
import { useMutation } from "react-query";
import { useToast } from "@/components/ui/use-toast";
import { _addRole } from "./getRole.service";

const useRole = () => {
  const { toast } = useToast();

  return useMutation(
    (data: { credentials: RoleCredentials; token: string }) =>
      _addRole(data.credentials, data.token),

    {
      onSuccess: (data) => {
        toast({
          description: `enregistré avec succes`,
        });
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

export default useRole;
