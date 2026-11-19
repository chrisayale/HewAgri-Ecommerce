import { useToast } from '@/components/ui/use-toast'
import { CatergorieCooperativeCredentials } from '@/types';
import { useMutation } from 'react-query';
import { _addCategorieCooperative } from './getCategCooperative.service';
import axios from 'axios';

const useCategorieCooperative = () => {
    const {toast} = useToast();
  return useMutation(
    (data: {credentials: CatergorieCooperativeCredentials; token: string})=>
        _addCategorieCooperative(data.credentials, data.token),
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
  )
}

export default useCategorieCooperative