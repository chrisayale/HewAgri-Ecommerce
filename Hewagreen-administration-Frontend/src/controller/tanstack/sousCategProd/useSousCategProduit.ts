import { useToast } from '@/components/ui/use-toast'
import { SousCategorieCredentials } from '@/types';
import { useMutation } from 'react-query';
import { _addSousCategorieProduit } from './getSousCategProduit.service';
import axios from 'axios';

const useSousCategorieProduit = () => {
    const {toast} = useToast();
  return useMutation(
    (data: {credentials: SousCategorieCredentials; token: string})=>
        _addSousCategorieProduit(data.credentials, data.token),
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

export default useSousCategorieProduit