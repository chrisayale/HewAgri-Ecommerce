import { useToast } from '@/components/ui/use-toast'
import {TypeLivraisonCredentials } from '@/types';
import { useMutation } from 'react-query';
import { _addTypeLivraison } from './getTypeLivraison.service';
import axios from 'axios';

const useTypeLivraison = () => {
    const {toast} = useToast();
  return useMutation(
    (data: {credentials: TypeLivraisonCredentials; token: string})=>
        _addTypeLivraison(data.credentials, data.token),
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

export default useTypeLivraison