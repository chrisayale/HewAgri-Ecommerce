import axios, { AxiosRequestConfig, Method } from "axios";
import { formatDistanceStrict } from "date-fns";
import { fr } from 'date-fns/locale';
// Définir un type générique pour la réponse attendue
interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: AxiosRequestConfig;
  request?: any;
}

const apiUrlProd = process.env.NEXT_PUBLIC_BASE_URL;
// const urlTest = process.env.NEXT_PUBLIC_BASE_URL_TEST;
// Configuration initiale d'Axios
const api = axios.create({
  baseURL: apiUrlProd, // Base URL de votre API production
  // baseURL: urlTest, // Base URL de votre API Developement

  headers: {
    "Content-Type": "application/json",
  },
});

// Interface pour les paramètres de requête
interface ApiRequestParams<T> {
  method: Method;
  endpoint: string;
  data?: any;
  params?: any;
  id?: string | number;
  token?: string;
}

// Fonction générique pour exécuter toutes les requêtes HTTP
const apiRequest = async <T>({
  method,
  endpoint,
  data,
  params,
  id,
  token,
}: ApiRequestParams<T>): Promise<ApiResponse<T>> => {
  const url = id ? `${endpoint}/${id}` : endpoint; // Gère les endpoints avec ou sans ID
  const headers: any = {};

  if (token) {
    headers["x-ecommerce-kgreen-api"] = `Bearer ${token}`; // Gère l'authentification via token
  }

  const config: AxiosRequestConfig = {
    method,
    url,
    headers,
    data,
    params,
  };

  try {
    const response = await api(config);
    return response as ApiResponse<T>;
  } catch (error) {
    throw error;
  }
};

export function geDateFormat(dateString: string): string {
	const date = new Date(dateString);
	if (isNaN(date.getTime())) {
	  return 'Invalid date';
	}
	const now = new Date();
	const relativeDate = formatDistanceStrict(date, now, { addSuffix: true, locale: fr });
	return relativeDate;
  }

export function formatDate(dateString: string): string {
	const date = new Date(dateString);
	const options: any = {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
	};
	const formattedDate = `${date.toLocaleDateString('en-US', options)}`;
	return formattedDate;
}

export default apiRequest;