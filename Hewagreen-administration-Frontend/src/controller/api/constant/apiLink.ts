export const auth = {
  signIn: `api/users/user/auth`,
  signInBanque: `api/users/user/auth/bank`,

  getUseIdentification: (page: number = 1) => `api/users/list?page=${page}`,
  getCategCooperative: (page: number = 1) =>
    `api/coopeccategs/list?page=${page}`,

  getCategProduit: (page: number = 1) => `api/categories/list?page=${page}`,
  getSousCategProduit: (page: number = 1) =>
    `api/souscategories/list?page=${page}`,
  getRole: (page: number = 1) => `api/roles/list?page=${page}`,
  getUniteMesure: (page: number = 1) => `api/unities/list?page=${page}`,
  getTypeLivraison: (page: number = 1) =>
    `api/typeslivraisons/list?page=${page}`,
  getCooperative: (page: number = 1) => `api/cooperatives/list?page=${page}`,
  getAgriculteur: (page: number = 1) => `api/members/list?page=${page}`,

  getProduit: (page: number = 1) => `api/produits/list?page=${page}`,
  getStock: (page: number = 1) => `api/stocks/list?page=${page}`,
  gestStockByCoop: (idCoop: string) => `api/stocks/stock/${idCoop}`,
  getHistoryStock: (idstock: string) => `api/stocks/stock/histories/${idstock}`,

  getProvince: (page: number = 1) => `api/provinces/list?page=${page}`,
  getTerritoire: (id: string, page: number = 1) => `api/territoires/list?page=${page}/${id}`,
  getVillage: (id: string , page: number = 1) => `api/villages/list?page=${page}/${id}`,
  getCredits: (page: number = 1) =>   `api/credits/list?page=${page}`,
  getCreditsbyStatus: (page: number = 1) => `api/credits/bystatus/:status`,
  
  getbanks: (page: number = 1) =>   `api/banks/list?page=${page}`,
  getCommandes: (page: number = 1, limit: number = 100000) => `api/commandes/list?page_size=${page}&page_number=${limit}`,
  getCommandesParTransaction: (page: number = 1, limit: number = 100000) => `api/commandes/list/transactions/byowner?page_size=${page}&page_number=${limit}`,
  getCommandeIdtransaction: (id: number) => `api/commandes/list/bytransaction/${id}`,
  getCommandeByCooperative : (id: number) =>  `api/commandes/list/bycooperative/${id}`,
  getCommandeByEtatEtCooperative: (idcoop: number, state: number) => `api/commandes/list/bycooperativeandstate/${idcoop}/${state}`,
  getCommandeByState :  `api/commandes/list/bystate/2?page_size=1&page_number=10000000`,
  getCommandeByState2 : `api/commandes/list/bystate/3?page_size=1&page_number=10000000`,
  getCommandeByState3 : `api/commandes/list/bystate/4?page_size=1&page_number=10000000`,
  getCommandeByState4 : `api/commandes/list/bystate/1?page_size=1&page_number=10000000`,
  getCommandeByState5 : `api/commandes/list/bystate/0?page_size=1&page_number=10000000`,

  getMembresByCoop : (id: number) => `api/members/list/bycooperative/${id}`,

  getTaux : (page: number = 1) => `api/configurations/get?page=${page}`,
  getPayment: (page: number = 1) => `api/payements/list?page=${page}`,

  getDashboard: `api/statistiques/stat/dashboard`

};

export const profile = {
  getProfil: (id: string) => `api/users/user/${id}`,
  updateUserProfil: (userId: number) => `/api/users/user/${userId}`,
  cnhagePassword: `/api/users/user/changepassword`,
  updateAvatar: `/api/users/user/avatar`
}

export const role = {
  addRole: `api/roles/role/add`,
  attributeRoleToUser: `api/roles/role/addtouser`,
  updateRole : (idcategry : number) => `api/roles/role/${idcategry}`,
  deleteRole : (idcategry : number) => `api/roles/role/${idcategry}`
};

export const typeLivraison = {
  addTypeLivraison: `api/typeslivraisons/typeslivraison/add`,
  updateTypeLivraison: (idtypeLi: number) => `api/typeslivraisons/typeslivraison/${idtypeLi}`,
  deleteTypeLivraison: (idtypeLi: number) =>  `api/typeslivraisons/typeslivraison/${idtypeLi}`
};

export const categorieCooperative = {
  addCategorieCooperative: `api/coopeccategs/coopeccateg/add`,
  updateCoop : (idcategry : number) => `api/coopeccategs/coopeccateg/${idcategry}`,
  deleteCategCoop : (idcategry : number) => `api/coopeccategs/coopeccateg/${idcategry}`
};

export const categorieProduit = {
  addCategorieProduit: `api/categories/categorie/add`,
  updateCategProduit : (idcategry : number) => `api/categories/categorie/${idcategry}`,
  deleteCategProduit : (idcategry : number) => `api/categories/categorie/${idcategry}`
};
export const sousCategorieProduit = {
  addSousCategorieProduit : `api/souscategories/souscategorie/add`,
  updateSubCategProduit : (idcategry : number) => `api/souscategories/souscategorie/${idcategry}`,
  deleteSubCategProduit : (idcategry : number) => `api/souscategories/souscategorie/${idcategry}`
}
export const uniteMesure = {
  addUniteMesure : `api/unities/unity/add`,
  updateUniteMesure : (idcategry : number) => `api/unities/unity/${idcategry}`,
  deleteUniteMesure : (idcategry : number) => `api/unities/unity/${idcategry}`
}
export const cooperative = {
  addCooperative : `/api/cooperatives/cooperative/add`,
  updateCooperative : (id:number) => `/api/cooperatives/cooperative/${id}`,
  deleteCooperative : (id: number) => `/api/cooperatives/cooperative/${id}`,
};

export const identification = {
  addIdentification: `api/users/user/register`,
  deleteIdentification: (id: number) => `api/users/user/${id}`,
  updateIdentiter: (id: number) => `api/users/user/${id}`,
  addroleUser:  `api/roles/role/addtouser`,
  deleteroleUser: `api/roles/role/removetouser`,
};

export const agriculteur = {
  addAgriculteur: `/api/cooperatives/cooperative/addmembers`,
  loadAgriById: (id: string) => `api/members/list/bycooperative/${id}`
}

export  const produit = {
  addProduit : `/api/produits/produit/add`,
  updateProduit: (id: number) => `/api/produits/produit/${id}`,
  deleteProduit : (id: number) => `/api/produits/produit/${id}`,
}

export const commandes = {
    deleteCommande : (id: number) => `api/marketplace/card/validate/${id}`,
    validateCommande : (id: number) => `api/commandes/commande/validate/${id}`,
}

export const credits = {
  deleteCredit : (id: number) => `api/credits/credit/${id}`,
  validateCredit : (id : number) => `api/credits/credit/validate/${id}`,
}

export const banks = {
  addBank : `api/banks/bank/add`,
  deleteBank : (id: number) => `api/banks/bank/${id}`
}

export const stocks = {
  addStocks : `api/stocks/stock/in`,
  stockUser : (id : number) => `api/stocks/byuser/historiques/${id}`,
}

export const cateCooperative = {
  updateCoop : `api/coopeccategs/coopeccateg/:idcategry`
}

const getCommandeByState = (page: number = 1, limit: number = 100000): string => {
  return `api/commandes/list/bystate/0?page_size=${limit}&page_number=${page}`;
};


export const historiqueStock = {
  historiByIdCoop : (id: number) => `api/stocks/historiques/${id}`,
   historiByIdUser : (id: number) => `api/stocks/byuser/historiques/${id}`
}

export const carousels = {
  loadCarousel: `/api/services/carousels`,
  addCarousel : `/api/services/carousel/add`,
  updateCarousel : (id:number) => `/api/services/carousel/${id}`,
  deleteCarousel : (id: number) => `/api/services/carousel/${id}`,
};

export const creditsBanque = {
  loadCreditByStatus: (status: string) => `/api/credits/bystatus/${status}`,
  loadCreditByMemberAndStatus: (idMember:string, status: string) => `/api/credits/bymember/${idMember}/${status}`,
  loadCreditByCoopAndStatus: (idCooperative:string, status: string) => `/api/credits/bycooperative/${idCooperative}/${status}`,
}

export const statistiqueBanque = {
  loadstatByCoop: (idcooperative: string) => `/api/statistiques/ventes/bycooperative/${idcooperative}`,
  loadstatByMember: (idmembre: string) => `/api/statistiques/ventes/bymember/${idmembre}`,
  loadstatApprovByMember: (idmembre: string) => `/api/statistiques/approvionnements/bymember/${idmembre}`,
}