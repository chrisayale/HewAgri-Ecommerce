import { useToast } from '@/components/ui/use-toast'
import { SousCategorieCredentials, UniteMesureCrendentials } from '@/types';
import { useMutation } from 'react-query';
import { _addUniteMesure } from './getUniteMesure.service';

const useUniteMesure = () => {
    const {toast} = useToast();
  return useMutation(
    (data: {credentials: UniteMesureCrendentials; token: string})=>
        _addUniteMesure(data.credentials, data.token),
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
  )
}

export default useUniteMesure