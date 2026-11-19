import { useToast } from '@/components/ui/use-toast'
import { CategorieProduitCredentials } from '@/types';
import { useMutation } from 'react-query';
import { _addCategorieProduit } from './getCategProduit.service';
import axios from 'axios';

const useCategorieProduit = () => {
    const {toast} = useToast();
  return useMutation(
    (data: {credentials: CategorieProduitCredentials; token: string})=>
        _addCategorieProduit(data.credentials, data.token),
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

export default useCategorieProduit