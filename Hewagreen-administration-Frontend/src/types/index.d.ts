export interface LoginCredentials {
  phone: string;
  password: string;
}
// Identification

export interface IdentificationCredentials {
  nom: string;
  postnom: string;
  phone: string;
  idroles?: number[] | undefined;
  genre?: string;
  password?: string;
  date_naiss?: string;
  email?: string;
  idprovince: number;
  idterritoire: number,
  idvillage: number;
  adresse: string;
}

export interface AddorDeleteRoleUser {
  id_user: number;
  id_roles: number[] | undefined;
}

export interface ResponseIdentification {
  status: number;
  message: string;
  data: DataIdentification;
}

export interface DataIdentification {
  count: number;
  rows: RowIdentification[];
}

export interface RowIdentification {
  id: number;
  nom: string;
  avatar: string;
  postnom: string;
  prenom: string;
  phone: string;
  email: string;
  date_naiss?: string;
  sexe?: string;
  hectare_cultive: any;
  uuid: string;
  createdAt: string;
  updatedAt: string;
  __tbl_ecom_roles: TblEcomRoleIdentification[];
  __tbl_ecom_province?: TblEcomProvince;
  __tbl_ecom_territoire?: TblEcomTerritoire;
  __tbl_ecom_village: any;
}

export interface TblEcomRoleIdentification {
  id: number;
  role: string;
  __tbl_ecom_hasroles: TblEcomHasroles;
}

export interface TblEcomHasroles {
  id: number;
  TblEcomUserId: number;
  TblEcomRoleId: number;
  createdAt: string;
  updatedAt: string;
}

export interface TblEcomProvince {
  id: number;
  province: string;
}

export interface TblEcomTerritoire {
  id: number;
  territoire: string;
}

//role

export interface RoleCredentials {
  role: string;
}

export interface RoleCredentialsUpdated {
  role: string;
  description: string;
}

export interface ResponseRole {
  status: number;
  message: string;
  data: DataRole;
}
export interface DataRole {
  count: number;
  rows: RowRole[];
}
export interface RowRole {
  id: number;
  role: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
}

// Produit

export interface ResponseProvince {
  status: number;
  message: string;
  data: DataProvince;
}

export interface DataProduit {
  count: number;
  rows: RowProvince[];
}

export interface RowProduit {
  id: number;
  tva: number;
  produit: string;
  image: string;
  id_unity: number;
  id_category: number;
  id_souscategory: number;
  description: string;
  createdby: number;
  __tbl_ecom_unitesmesure: TblEcomUnitesmesure;
  __tbl_ecom_category: TblEcomCategory;
  __tbl_ecom_souscategory: TblEcomSouscategory;
}

export interface TblEcomUnitesmesure {
  id: number;
  unity: string;
  description: any;
  equival_kgs: any;
}

export interface TblEcomCategory {
  id: number;
  category: string;
  description: string;
}

export interface TblEcomSouscategory {
  id: number;
  souscategory: string;
  id_category: number;
  description: string;
}

//province
export interface ResponseProvince {
  status: number;
  message: string;
  data: DataProvince;
}

export interface DataProvince {
  count: number;
  rows: RowProvince[];
}

export interface RowProvince {
  id: number;
  province: string;
  createdon: string;
  status: number;
}

// Territoire
export interface ResponseTerritoire {
  status: number;
  message: string;
  data: DataTerritoire;
}

export interface DataTerritoire {
  count: number;
  rows: RowDataTerritoire[];
}

export interface RowDataTerritoire {
  id: number;
  idprovince: number;
  territoire: string;
  __tbl_ecom_province: TblEcomProvince;
}

export interface TblEcomProvince {
  id: number;
  province: string;
  createdon: string;
  status: number;
}

//village
export interface ResponseVillage {
  status: number;
  message: string;
  data: DataVillage;
}

export interface DataVillage {
  count: number;
  rows: RowVillage[];
}

export interface RowVillage {
  id: number;
  idterritoire: number;
  village: string;
  latitude: string;
  longitude: string;
  groupement: string;
  provincecode: any;
}

export interface ResponseLogin {
  status: number;
  message: string;
  data: DataLogin;
}

export interface DataLogin {
  token: string;
  user: UserLogin;
}

export interface UserLogin {
  id: number;
  nom: string;
  avatar: string;
  postnom: string;
  prenom: string;
  phone: string;
  email: string;
  date_naiss: any;
  sexe: string;
  idprovince: string;
  idterritoire: string;
  idvillage: string;
  hectare_cultive: any;
  isvalidated: number;
  uuid: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  __tbl_ecom_roles: TblEcomRoleLogin[];
  __tbl_ecom_province: TblEcomProvince;
  __tbl_ecom_territoire: TblEcomTerritoireLogin;
  __tbl_ecom_village: any;
}

export interface TblEcomRoleLogin {
  id: number;
  role: string;
  __tbl_ecom_hasroles: TblEcomHasrolesLogin;
}

export interface TblEcomHasrolesLogin {
  id: number;
  TblEcomUserId: number;
  TblEcomRoleId: number;
  createdAt: string;
  updatedAt: string;
}

export interface TblEcomProvinceLogin {
  id: number;
  province: string;
}

export interface TblEcomTerritoireLogin {
  id: number;
  territoire: string;
}
export interface ResponseAddRole {
  status: number;
  message: string;
  data: DataResponseAddRole;
}



export interface DataResponseAddRole {
  description: string;
  id: number;
  role: string;
  updatedAt: string;
  createdAt: string;
}

// Type Livraison
export interface ResponseTypeLivraison {
  status: number;
  message: string;
  data: DataTypeLivraison;
}

export interface DataTypeLivraison {
  count: number;
  rows: RowTypeLivraison[];
}

export interface RowTypeLivraison {
  id: number;
  type: string;
  description: string;
  lieux: string;
  quantite: number;
  frais_livraison: number;
}

// Uniter de mesure
export interface ResponseUniteMesure {
  status: number;
  message: string;
  data: DataUniteMesure;
}

export interface DataUniteMesure {
  count: number;
  rows: RowUniteMesure[];
}

export interface RowUniteMesure {
  id: number;
  unity: string;
  description?: string;
  equival_kgs?: number;
}

//sous categorie
export interface ResponseSousCategoriProduit {
  status: number;
  message: string;
  data: DataSousCategoriProduit;
}

export interface DataSousCategoriProduit {
  count: number;
  rows: RowSousCategoriProduit[];
}

export interface RowSousCategoriProduit {
  id: number;
  souscategory: string;
  id_category: number;
  description: string;
}

// Categori produit
export interface ResponseCategoriProduit {
  status: number;
  message: string;
  data: DataCategoriProduit;
}

export interface DataCategoriProduit {
  count: number;
  rows: RowCategoriProduit[];
}

export interface RowCategoriProduit {
  id: number;
  category: string;
  description?: string;
}

//Cooperative

export interface ResponseCooperative {
  status: number;
  message: string;
  data: DataCooperative;
}

export interface DataCooperative {
  count: number;
  rows: RowCooperative[];
}

export interface RowCooperative {
  id: number;
  logo: string;
  id_territoire: number;
  id_province: number;
  coordonnees_gps: any;
  adresse: string;
  phone: string;
  email: any;
  num_enregistrement: string;
  file?: string;
  isformel: number;
  sigle: string;
  cooperative: string;
  id_adjoint: number;
  id_responsable: number;
  description: string;
  id_category: number;
  __tbl_ecom_users: any[];
}

// Carousel
export interface ResponseCarousel {
  status: number
  message: string
  data: DataCarousel
}

export interface DataCarousel {
  count: number
  rows: RowCarousel[]
}

export interface RowCarousel {
  id: number
  title: string
  createdBy: number
  sub_title: string
  carousel: string
  status: number
  description: string
  createdAt: string
  updatedAt: string
  deletedAt: any
}

//Membres
export interface ResponseAgriculteur {
  status: number;
  message: string;
  data: DataAgriculteur;
}

export interface DataAgriculteur {
  count: number;
  rows: RowAgriculteur[];
}

export interface RowAgriculteur {
  id: number;
  nom: string;
  avatar: string;
  postnom: string;
  prenom: string;
  phone: string;
  email: string;
  date_naiss: string;
  sexe: string;
  hectare_cultive: string;
  carte: string;
  date_expiration: string;
  date_expiration_unix: number;
  TblEcomUserId: number;
  TblEcomCooperativeId: number;
  createdAt: string;
  updatedAt: string;
  __tbl_ecom_user: TblEcomUserAgriculteur;
  __tbl_ecom_cooperative: TblEcomCooperativeAgriculteur;
}

export interface TblEcomUserAgriculteur {
  id: number;
  nom: string;
  postnom: string;
  prenom: string;
  phone: string;
  email: string;
}

export interface TblEcomCooperativeAgriculteur {
  id: number;
  logo: string;
  id_territoire: number;
  id_province: number;
  coordonnees_gps: any;
  adresse: string;
  phone: string;
  email: any;
  num_enregistrement: string;
  file: string;
  isformel: number;
  sigle: string;
  cooperative: string;
  id_adjoint: number;
  id_responsable: number;
  description: string;
  id_category: number;
}

//produit
export interface ResponseProduit_ {
  status: number;
  message: string;
  data: DataProduit_;
}

export interface DataProduit_ {
  count: number;
  rows: RowProduit_[];
}

export interface RowProduit_ {
  id: number;
  tva: number;
  produit: string;
  image: string;
  id_unity: number;
  id_category: number;
  id_souscategory: number;
  description: string;
  createdby: number;
  __tbl_ecom_unitesmesure: TblEcomUnitesmesureProduit_;
  __tbl_ecom_category: TblEcomCategoryProduit_;
  __tbl_ecom_souscategory: TblEcomSouscategoryProduit_;
}

export interface TblEcomUnitesmesureProduit_ {
  id: number;
  unity: string;
  description: any;
  equival_kgs: any;
}

export interface TblEcomCategoryProduit_ {
  id: number;
  category: string;
  description: string;
}

export interface TblEcomSouscategoryProduit_ {
  id: number;
  souscategory: string;
  id_category: number;
  description: string;
}

// Stocks

export interface ResponseStock {
  status: number;
  message: string;
  data: DataStock;
}

export interface DataStock {
  count: number;
  rows: RowStock[];
}

export interface RowStock {
  id: number;
  id_cooperative: number;
  transaction: string;
  description: string;
  createdby: number;
  date_expiration: string;
  date_production: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  __tbl_ecom_produits: TblEcomProduitStock[];
  __tbl_ecom_cooperative: TblEcomCooperativeStock;
}

export interface TblEcomProduitStock {
  id: number;
  produit: string;
  __tbl_ecom_hasproducts: TblEcomHasproductsStock;
  __tbl_ecom_categories: TblEcomCategoriesStock;
  __tbl_ecom_unitesmesures: TblEcomUnitesmesuresStock;
}

export interface TblEcomHasproductsStock {
  id: number;
  tva: number;
  id_membre: any;
  date_production: any;
  qte: number;
  prix_unitaire: number;
  prix_plus_commission: number;
  currency: string;
  TblEcomProduitId: number;
  TblEcomUnitesmesureId: number;
  TblEcomStockId: number;
  TblEcomCategoryId: number;
  TblEcomCooperativeId: number;
  createdAt: string;
  updatedAt: string;
}

export interface TblEcomCategoriesStock {
  id: number;
  category: string;
  description: string;
}

export interface TblEcomUnitesmesuresStock {
  id: number;
  unity: string;
  description: any;
  equival_kgs: any;
}

export interface TblEcomCooperativeStock {
  id: number;
  coordonnees_gps: any;
  phone: string;
  num_enregistrement: string;
  email: any;
  sigle: string;
  cooperative: string;
  description: string;
}

// Hystorique des stocks

export interface ResponseHistoryStock {
  status: number
  message: string
  data: DataHistoryStock
}

export interface DataHistoryStock {
  id: number
  id_cooperative: number
  transaction: string
  description: string
  createdby: number
  date_expiration: string
  date_production: string
  createdAt: string
  updatedAt: string
  deletedAt: any
  __tbl_ecom_produits: TblEcomProduitHistoryStock[]
  __tbl_ecom_cooperative: TblEcomCooperativeHistoryStock
  mouvements: MouvementHistoryStock[]
}

export interface TblEcomProduitHistoryStock {
  id: number
  produit: string
  __tbl_ecom_hasproducts: TblEcomHasproductsHistoryStock
}

export interface TblEcomHasproductsHistoryStock {
  id: number
  qte_critique: number
  tva: number
  id_membre: string
  date_production: string
  qte: number
  prix_unitaire: number
  prix_plus_commission: number
  currency: string
  TblEcomProduitId: number
  TblEcomUnitesmesureId: number
  TblEcomStockId: number
  TblEcomCategoryId: number
  TblEcomCooperativeId: number
  createdAt: string
  updatedAt: string
}

export interface TblEcomCooperativeHistoryStock {
  id: number
  coordonnees_gps: any
  phone: string
  num_enregistrement: string
  email: any
  sigle: string
  cooperative: string
  description: string
}

export interface MouvementHistoryStock {
  "0": N0HistoryStock
  mouvements: MouvementsHistoryStock
}

export interface N0HistoryStock {
  id: number
  produit: string
  __tbl_ecom_hasproducts: TblEcomHasproducts2HistoryStock
}

export interface TblEcomHasproducts2HistoryStock {
  id: number
  qte_critique: number
  tva: number
  id_membre: string
  date_production: string
  qte: number
  prix_unitaire: number
  prix_plus_commission: number
  currency: string
  TblEcomProduitId: number
  TblEcomUnitesmesureId: number
  TblEcomStockId: number
  TblEcomCategoryId: number
  TblEcomCooperativeId: number
  createdAt: string
  updatedAt: string
}

export interface MouvementsHistoryStock {
  id: number
  qte_critique: number
  tva: number
  id_membre: string
  date_production: string
  qte: number
  prix_unitaire: number
  prix_plus_commission: number
  currency: string
  TblEcomProduitId: number
  TblEcomUnitesmesureId: number
  TblEcomStockId: number
  TblEcomCategoryId: number
  TblEcomCooperativeId: number
  createdAt: string
  updatedAt: string
}

// commandes

export interface ResponseCommandes {
  status: number;
  message: string;
  data: DataCommandes;
}

export interface DataCommandes {
  count: number;
  rows: RowCommandes[];
  valorisation:{
    USD: string;
    CDF: string;
  }
}

export interface RowCommandes {
  id: number;
  transaction: string;
  id_produit: number;
  qte: number;
  id_unity: number,
  id_cooperative: number,
  prix_total: number;
  prix_unit: number;
  currency: string;
  payament_phone: string;
  type_livraison: number;
  description: any;
  is_pending: number;
  state: number;
  createdby: number;
  shipped_to: string;
  createdAt: string;
  __tbl_ecom_produit: TblEcomProduitCommandes;
  __tbl_ecom_typelivraison: TblEcomTypelivraisonCommandes;
  __tbl_ecom_unitesmesure: {
    id: number,
    unity: string,

  }
  __tbl_ecom_user: {
    id: number;
    nom: string;
    postnom: string;
    phone: string;
  }
}

export interface TblEcomProduitCommandes {
  id: number;
  tva: number;
  produit: string;
  image: string;
  id_unity: number;
  id_category: number;
  id_souscategory: number;
  description: string;
  createdby: number;
}

export interface TblEcomTypelivraisonCommandes {
  id: number;
  type: string;
  description: string;
  lieux: string;
  quantite: number;
  frais_livraison: number;
}

// credits

export interface ResponseCredits {
  status: number;
  message: string;
  data: DataCredits;
}

export interface DataCredits {
  count: number;
  rows: RowCredits[];
}

export interface RowCredits {
  id: number;
  id_cooperative: number;
  id_user: any;
  montant: number;
  currency: string;
  motif: string;
  status: number;
  periode_remboursement: number;
  __tbl_ecom_cooperative: TblEcomCooperativeCredits;
  __tbl_ecom_user: any;
  __tbl_ecom_bank: {
    id: number;
    bank: string;
    email: string;
    phone: string;
  },
}

export interface TblEcomCooperativeCredits {
  id: number;
  logo: string;
  id_territoire: number;
  id_province: number;
  coordonnees_gps: any;
  adresse: string;
  phone: string;
  email: any;
  num_enregistrement: string;
  file: string;
  isformel: number;
  sigle: string;
  cooperative: string;
  id_adjoint: number;
  id_responsable: number;
  description: string;
  id_category: number;
}

// Banques

export interface ResponseBanques {
  status: number;
  message: string;
  data: DataBanques;
}

export interface DataBanques {
  count: number;
  rows: RowBanques[];
}

export interface RowBanques {
  id: number;
  id_responsable: number;
  email: string;
  description: string;
  createdby: any;
  phone: string;
  bank: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  __tbl_ecom_user: TblEcomUserBanques;
}

export interface TblEcomUserBanques {
  id: number;
  nom: string;
  postnom: string;
  prenom: string;
  phone: string;
  email: string;
}

// Catergorie Cooperative

export interface CatergorieCooperativeCredentials {
  category?: string;
  description: string;
}

export interface ResponseCatergorieCooperative {
  status: number;
  message: string;
  data: DataCatergorieCooperative;
}

export interface DataCatergorieCooperative {
  count: number;
  rows: Row[];
}

export interface RowCatergorieCooperative {
  id: number;
  category?: string;
  description: string;
}

export interface ResponseAddCategorieCooperative {
  status: number;
  message: string;
  data: DataAddCategorieCooperative;
}

export interface DataAddCategorieCooperative {
  id: number;
  category?: string;
  description: string;
}

export interface ResponseCmdTransaction {
  status: number
  message: string
  data: DataCmdTransaction
}

export interface DataCmdTransaction {
  count: number
  rows: RowCmdTransaction[]
}

export interface RowCmdTransaction {
  transaction: string
}

export interface ResponseTaux {
  status: number
  message: string
  data: DataTaux
}

export interface DataTaux {
  id: number
  taux_change: number
  commission_price: number
}

export interface ResponseProfile {
  status: number
  message: string
  data: DataProfile
}

export interface DataProfile {
  id: number
  nom: string
  avatar: string
  postnom: string
  prenom: string
  phone: string
  email: string
  date_naiss: any
  sexe: string
  category?:string
  hectare_cultive: any
  uuid: string
  createdAt: string
  updatedAt: string
  __tbl_ecom_roles: TblEcomRoleProfile[]
  __tbl_ecom_province: TblEcomProvinceProfile
  __tbl_ecom_territoire: TblEcomTerritoireProfile
  __tbl_ecom_village: any
  adresse?: string
}

export interface TblEcomRoleProfile {
  id: number
  role: string
  __tbl_ecom_hasroles: TblEcomHasrolesProfile
}

export interface TblEcomHasrolesProfile {
  id: number
  TblEcomUserId: number
  TblEcomRoleId: number
  createdAt: string
  updatedAt: string
}

export interface TblEcomProvinceProfile {
  id: number
  province: string
}

export interface TblEcomTerritoireProfile {
  id: number
  territoire: string
}


//////dashborad ///////////////////////

export interface ResponseDashboard {
  status: number
  message: string
  data: DataDashboard
}

export interface DataDashboard {
  stats: StatsDashboard
  details: DetailsDashboard
}

export interface StatsDashboard {
  users: number
  customers: number
  cooperatives: number
  banks: number
  products: number
  commandes: number
}

export interface DetailsDashboard {
  users: UsersDashboard
  customers: CustomersDashboard
}

export interface UsersDashboard {
  length: number
  xAxis: string[]
  yAxis: number[]
}

export interface CustomersDashboard {
  length: number
  xAxis: string[]
  yAxis: number[]
}


//Payement

export interface ResponsePaiement {
  status: number
  message: string
  data: DaumPaiement[]
}

export interface DaumPaiement {
  id: number
  status: number
  customer_phone: string
  realref: string
  reference: string
  phone: string
  amount: number
  currency: string
  category: number
  description: string
  createdby: number
  __tbl_ecom_user: TblEcomUserPaiement
  __tbl_ecom_commandes: TblEcomCommandePaiement[]
}

export interface TblEcomUserPaiement {
  id: number
  nom: string
  postnom: string
  prenom: string
  phone: string
  email: string
}

export interface TblEcomCommandePaiement {
  id: number
  id_unity: number
  id_cooperative: number
  transaction: string
  real_transaction: any
  id_produit: number
  qte: number
  prix_total: number
  prix_unit: number
  currency: string
  payament_phone: string
  type_livraison: number
  description: any
  is_pending: number
  state: number
  createdby: number
  updatedby: number
  shipped_to: string
  createdAt: string
}


// All credentials

export interface CategorieProduitCredentials {
  category: "";
  description: "";
}
export interface TerritoireCredentials {
  id: string;
  name?: string;
  role: string;
  province?: string;
  territoire: string;
  idterritoire: string;
  village: string;
}

export interface SousCategorieCredentials {
  id_categorie: number;
  souscategory: string;
  description: string;
}
export interface UniteMesureCrendentials {
  unity: string;
  equival_kgs: number;
  description: string;
}
export interface TypeLivraisonCredentials {
  type: string;
  frais_livraison: number;
  quantite: number;
  description: string;
  lieux: number[];
}

export interface ResponseCooperativeCredentials {
  status: number;
  message: string;
  data: DataResponseCooperativeCredentials;
}

export interface DataResponseCooperativeCredentials {
  id: number,
  sigle: string,
  cooperative: string,
  description: string,
  phone: string,
  email: string,
  isformel: boolean,
  id_category: number,
  id_responsable: number,
  id_adjoint: number,
  id_province: number,
  id_territoire: number,
  file: string,
  adresse: string,
  num_enregistrement: string,
  logo: string
}
export interface CooperativeCredentials {
  sigle?: string;
  cooperative?: string;
  description?: string;
  phone?: string;
  email?: string;
  isformel?: number;
  id_category?: string;
  id_responsable?: string;
  id_adjoint?: string;
  id_province?: number;
  id_territoire?: number;
  id_village?: number;
  file?: File | null;
  adresse?: string;
  logo?: string;
  editMode: boolean
}

export interface AgriculteurCredentials {
  ids_members: number[];
  id_cooperative: string;
}
export interface CrediAgricole {
  state: number;
}

export interface ProduitCredentials {
  produit: string;
  image: file;
  description: string;
  id_unity: string;
  id_category: number;
  id_souscategory: number;
  tva: string;
}

export interface BankCredentials {
  phone: string;
  email: string;
  bank: string;
  description: string;
  adresse: string;
  id_responsable: number;
}

export interface StockCredentials {
  id_ccoperative: number;
  description: string;
  date_production: string;
  date_expiration: string;
  items: ProduitPanier[];
}

export interface ProduitPanier {
  id_produit: number;
  qte: number;
  prix_unitaire: number;
  currency: string;
}

export interface ResponseAddBank {
  status: number;
  message: string;
  data: DataddBank;
}

export interface DataddBank {
  id: number;
  phone: string;
  email: string;
  bank: string;
  description: string;
  id_responsable: number;
  updatedAt: string;
  createdAt: string;
}

export interface ResponseProvince {
  message: string;
  status: number;
  data: Daum[];
}

export interface Daum {
  id: string;
  name: string;
  description?: string;
  longitude: any;
  latitude: any;
  createdAt: string;
  updatedAt: string;
}

// Password

export interface ChangepasswordCredentials {
  oldpassword: string,
  newpassword: string,
  confirmpassword: string,
}

export interface profileCredentials {
  nom: string,
  postnom: string,
  prenom: string,
  email: string,
  phone: string,
  adresse: string,
  sexe: string,
  idprovince: number,
  idterritoire: number,
  idvillage: number  // not required
  role?: number[] | undefined;

  // date_naiss:string; //
}

// historique 


export interface historiqueApprovCredentials {
  status: number
  message: string
  data: DataApp
}

export interface DataApp {
  count: number
  rows: RowApprov[]
}

export interface RowApprov {
  id: number
  date_production: string
  qte: number
  TblEcomUserId: number
  TblEcomProduitId: number
  TblEcomCategoryId: number
  TblEcomUnitesmesureId: number
  TblEcomCooperativeId: number
  TblEcomStockId: number
  createdAt: string
  updatedAt: string
  __tbl_ecom_cooperative: TblEcomCooperativeApprov
  __tbl_ecom_user: TblEcomUserApprov
  __tbl_ecom_produit: TblEcomProduitApprov
  __tbl_ecom_category: TblEcomCategoryApprov
  __tbl_ecom_unitesmesure: TblEcomUnitesmesureApprov
}

export interface TblEcomCooperativeApprov {
  id: number
  adresse: string
  phone: string
  num_enregistrement: string
}

export interface TblEcomUserApprov {
  id: number
  nom: string
  postnom: string
  prenom: string
  phone: string
  email: string
}

export interface TblEcomProduitApprov {
  id: number
  produit: string
}

export interface TblEcomCategoryApprov {
  id: number
  category: string
}

export interface TblEcomUnitesmesureApprov {
  id: number
  unity: string
  equival_kgs: any
}

interface Produit_ {
  produit: string;
  image: string;
  description: string;
  [key: string]: any; // Ajout d'une index signature
}

interface Commande {
  id: number;
  qte: number;
  state: number;
  payament_phone: string;
  transaction: string;
  createdAt: string;
  prix_unit: number;
  prix_total: number;
  is_pending: number;
  currency: string;

  __tbl_ecom_unitesmesure: {
    unity: string;
  };
  __tbl_ecom_typelivraison: {
    type: string;
    description: string;
    quantite: number;
  };
  id_cooperative: number;
  __tbl_ecom_produit: Produit_;
}

export interface CarouselCredentials {
  carousel?: string;
  title?: string;
  sub_title?: string;
  description?: string;
}



//Approvisionnement

export interface UIApprovisionnement {
  status: number
  message: string
  data: Data
}

export interface Data {
  count: number
  rows: RowData[]
}

export interface RowData {
  id: number
  date_production: string
  qte: number
  TblEcomUserId: number
  TblEcomProduitId: number
  TblEcomCategoryId: number
  TblEcomUnitesmesureId: number
  TblEcomCooperativeId: number
  TblEcomStockId: number
  createdAt: string
  updatedAt: string
  __tbl_ecom_cooperative: TblEcomCooperative
  __tbl_ecom_user: TblEcomUser
  __tbl_ecom_produit: TblEcomProduit
  __tbl_ecom_category: TblEcomCategory
  __tbl_ecom_unitesmesure: TblEcomUnitesmesure
}

export interface TblEcomCooperative {
  id: number
  adresse: string
  phone: string
  num_enregistrement: string
  cooperative: string
}

export interface TblEcomUser {
  id: number
  nom: string
  postnom: string
  prenom: string
  phone: string
  email: string
}

export interface TblEcomProduit {
  id: number
  produit: string
}

export interface TblEcomCategory {
  id: number
  category: string
}

export interface TblEcomUnitesmesure {
  id: number
  unity: string
  equival_kgs: number
}
