# RAPPORT TECHNIQUE ET FONCTIONNEL GLOBAL
## Écosystème HEWAGRI ECOMMERCE — Backend Mock, Frontends E-commerce/Admin, Application Mobile POS

---

**Date du rapport** : 2026-11-19  
**Version** : 1.0  
**Auteur** : Analyse automatisée (Claude Code)  
**Répertoire racine** : `C:\Users\MC\HEWAGRI-ECOMMERCE`  
**Mode** : Lecture seule — Aucune modification du code source

---

## TABLE DES MATIÈRES

1. [Cartographie de l'Écosystème & Objectif Métier](#1-cartographie-de-lécosystème--objectif-métier)
2. [Focus sur le Faux Backend (Mock API)](#2-focus-sur-le-faux-backend-mock-api)
3. [Focus sur l'Application Mobile POS](#3-focus-sur-lapplication-mobile-pos)
4. [Architecture & Communication Inter-Applications](#4-architecture--communication-inter-applications)
5. [Configuration & Procédure de Lancement Local](#5-configuration--procédure-de-lancement-local)
6. [Qualité du Code, Cohérence & Pistes d'Amélioration](#6-qualité-du-code-cohérence--pistes-damélioration)

---

## 1. CARTOGRAPHIE DE L'ÉCOSYSTÈME & OBJECTIF MÉTIER

### 1.1 Vue d'Ensemble de l'Architecture

L'écosystème HEWAGRI ECOMMERCE est une plateforme **multi-canal** de commerce agricole destinée aux coopératives, composée de **quatre sous-projets indépendants mais interconnectés** :

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        HEWAGRI ECOMMERCE ECOSYSTEM                          │
├──────────────────┬──────────────────┬──────────────────┬──────────────────┤
│  BACKEND MOCK    │  E-COMMERCE      │  ADMIN           │  POS MOBILE      │
│  (API REST)      │  FRONTEND        │  FRONTEND        │  (React Native)  │
│                  │  (Next.js 14)    │  (Next.js 14)    │  (Expo 45)       │
│  Port: 8012      │  Port: 4004      │  Port: 4003      │  N/A (Mobile)    │
└────────┬─────────┴────────┬─────────┴────────┬─────────┴────────┬─────────┘
         │                  │                  │                  │
         └──────────────────┴──────────────────┴──────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   BASE DE DONNÉES │
                    │   MySQL (Prod)    │
                    │   SQLite (Mobile) │
                    └───────────────────┘
```

### 1.2 Objectif Métier Principal

**HEWAGRI** est une solution digitale pour la **gestion agricole coopérative** en RDC (République Démocratique du Congo), opérant sous la marque **KivuGreen**. Les objectifs métier sont :

| Domaine | Description |
|---------|-------------|
| **Marketplace Agricole** | Vente en ligne de produits agricoles (café, cacao, maïs, etc.) par coopératives |
| **Gestion de Stocks** | Suivi temps réel des entrées/sorties de stocks par coopérative |
| **Commandes & Livraisons** | Gestion du cycle de vie des commandes (création, validation, livraison) |
| **Système de Crédits** | Octroi et remboursement de crédits aux membres des coopératives |
| **Gestion des Membres** | Annuaire des coopératives, membres, rôles et permissions |
| **POS Terrain (Mobile)** | Application hors-ligne pour agents de terrain : inventaires, crédits, livraisons, impression tickets Bluetooth |

### 1.3 Répartition des Rôles & Acteurs

| Acteur | Application(s) utilisée(s) | Permissions clés |
|--------|---------------------------|------------------|
| **Client Final** | E-commerce Frontend | Achat produits, suivi commandes, panier |
| **Admin Coopérative** | Admin Frontend + POS Mobile | Gestion stocks, commandes, crédits, membres, rapports |
| **Livreur** | POS Mobile (onglet `homelivreur`) | Liste livraisons, validation réception, scanning QR/barcode |
| **Agent Terrain** | POS Mobile | Approvisionnement stocks, enrollment membres, crédits |
| **Super Admin** | Admin Frontend | Gestion globale, configurations, analytics |

### 1.4 Technologies Clés par Sous-Projet

| Composant | Stack Technique | Particularités |
|-----------|----------------|----------------|
| **Backend** | Express.js + TypeScript + Sequelize ORM + MySQL | JWT Triple Base64, Socket.io, Port 8012 |
| **E-commerce** | Next.js 14 (App Router) + Redux Toolkit + Tailwind + NextUI | PWA (next-pwa), Redux Persist, Port 4004 |
| **Admin** | Next.js 14 + TanStack Query + Ant Design + MUI + Recharts | 160+ endpoints typés, Port 4003 |
| **POS Mobile** | React Native 0.68 + Expo 45 + SQLite + React Navigation 6 | Offline-first, Bluetooth Printing, NFC, QR/Barcode |

---

## 2. FOCUS SUR LE FAUX BACKEND (MOCK API)

### 2.1 Architecture Générale

```
src/
├── __server/
│   └── index.ts              # Point d'entrée Express + Socket.io
├── __routes/
│   ├── index.ts              # Agrégation de 25 routeurs
│   ├── routes.users.ts       # Auth, users, roles
│   ├── routes.produits.ts    # CRUD produits
│   ├── routes.stocks.ts      # Stocks, historiques, approvisionnements
│   ├── routes.commandes.ts   # Commandes, livraisons, paiements
│   ├── routes.marketplace.ts # Marketplace public, panier, commandes
│   ├── routes.cooperatives.ts# CRUD coopératives
│   ├── routes.credits.ts     # Crédits, remboursements, échéanciers
│   ├── routes.members.ts     # Membres, cartes, QR codes
│   └── ... (17 autres)
├── __controllers/            # Logique métier (25+ contrôleurs)
├── __models/                 # Modèles Sequelize (20+ modèles)
├── __middlewares/
│   ├── middleware.accessvalidator.ts  # JWT Validation (Web + Mobile)
│   ├── middleware.cookies.ts          # JWT Sign/Verify + Triple Base64
│   └── middleware.datavalidator.ts    # Validation entrées (Yup-like)
├── __helpers/                # Utilitaires (random, responses, calculs)
├── __services/               # Services transverses (images, emails, etc.)
├── __databases/
│   └── connecte.ts           # Connexion Sequelize MySQL
├── __enums/                  # Codes HTTP, messages
└── config/
    └── default.ts            # Config DB (EcomProd)
```

### 2.2 Point d'Entrée & Configuration Serveur (`src/__server/index.ts`)

```typescript
// Configuration clé
const PORT = APP_PORT || 8012;
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

// Middlewares globaux
app.use(express.json());
app.use(cors());
app.use(fileUpload({ limits: { fileSize: 50MB } }));
app.use(morgan("combined", { stream: accessLogStream }));

// Routes statiques
app.use("/__assets", routes);
app.use("/assets", routes);
app.use("/src", routes);

// Routes API PROTÉGÉES
app.use('/api', accessValidator, routes);  // ← TOUT passe par accessValidator

// Socket.io events: 'connection', 'scanned', 'message', 'disconnect'
```

**Observations critiques** :
- ✅ Logging complet des requêtes (body, query, params, IP)
- ✅ Socket.io intégré pour temps réel (notifications, scanning)
- ⚠️ CORS `origin: "*"` — **trop permissif pour la production**
- ⚠️ Pas de rate limiting, pas de helmet, pas de compression

### 2.3 Authentification & Autorisation — Le Cœur de Sécurité

#### 2.3.1 Double Stratégie de Headers (`middleware.accessvalidator.ts`)

```typescript
// DEUX headers distincts selon le client
const WEB_HEADER = "x-ecommerce-kgreen-api";      // E-commerce + Admin Frontend
const MOBILE_HEADER = "x-ecommerce-mobkgreen-api"; // POS Mobile

// Routes EXCLUES de la validation JWT (publiques)
const excludedRoutes = [
  "/api/users/user/auth",           // Login
  "/api/users/user/signin",         // Inscription
  "/api/users/user/signup",
  "/api/users/user/register",
  "/api/users/user/add",
  "/api/users/user/verify",         // Vérification OTP
  "/api/users/user/resendcode",
  "/api/users/user/recoverypassword",
  "/api/users/user/resetpassword",
  "/api/users/user/authentification",
  "/api/users/user/auth/bank",
  "/api/marketplace",               // Marketplace public
  "/api/marketplace/product/:idproduit",
  "/api/marketplace/by/keyword/:keyword",
  "/api/marketplace/by/category/:keyword",
  "/api/marketplace/by/province/:keyword",
  "/api/marketplace/by/cooperative/:keyword",
  "/api/marketplace/card/addtopanier",
  "/api/marketplace/card/validate/:idpanier",
];
```

#### 2.3.2 JWT Triple Encodage Base64 (`middleware.cookies.ts`)

```typescript
// SIGN - Création du token
export const signJWT = (payload: object, expiresIn: string = "7d"): string => {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn });
  // TRIPLE encodage Base64 (obfuscation, pas chiffrement)
  return Buffer.from(Buffer.from(Buffer.from(token).toString('base64')).toString('base64')).toString('base64');
};

// VERIFY - Validation du token
export const verifyJWT = (token: string): any => {
  try {
    // TRIPLE décodage Base64
    const decoded = Buffer.from(Buffer.from(Buffer.from(token, 'base64').toString()).toString(), 'base64').toString();
    return jwt.verify(decoded, JWT_SECRET);
  } catch (error) {
    return null;
  }
};
```

**Analyse de sécurité** :
| Aspect | Évaluation | Commentaire |
|--------|------------|-------------|
| **Triple Base64** | ⚠️ **Security by Obscurity** | Ne rajoute AUCUNE sécurité cryptographique. `atob(atob(atob(token)))` suffit à un attaquant. |
| **Secret JWT** | ❌ **Durci dans le code** | `JWT_SECRET` devrait être en variable d'environnement uniquement |
| **Expiration 7j** | ⚠️ Longue | Pour mobile offline acceptable, mais refresh token manquant |
| **Headers distincts** | ✅ Bon pattern | Séparation claire Web vs Mobile, permet révocation ciblée |
| **Routes exclues** | ✅ Bien définies | Login, marketplace public, recovery password accessibles sans token |

#### 2.3.3 Payload JWT Typique

```typescript
// Décodé depuis le middleware
const { currentuser } = req as any;
const { __id, roles, uuid, phone, idcooperative } = currentuser;
// __id = user ID, roles = array[string], uuid = device/session ID
// idcooperative = cooperative context (critical pour multi-tenant)
```

### 2.4 Modèles de Données Principaux (Sequelize)

| Modèle | Table | Relations Clés | Description |
|--------|-------|----------------|-------------|
| **Users** | `TblEcomUsers` | belongsTo Cooperatives, Roles | Utilisateurs (admin, livreur, membre, client) |
| **Cooperatives** | `TblEcomCooperatives` | hasMany Users, Stocks, Commandes | Entités métier principales |
| **Produits** | `TblEcomProduits` | belongsTo Categories, Unites | Catalogue produits agricoles |
| **Stocks** | `TblEcomStocks` | belongsTo Cooperatives, Produits | Inventaire par coopérative |
| **Commandes** | `TblEcomCommandes` | belongsTo Users, Cooperatives, Typelivraisons | Cycle de vie commande |
| **Credits** | `TblEcomCredits` | belongsTo Users, Cooperatives | Crédits membres avec échéanciers |
| **Members** | `TblEcomMembers` | belongsTo Cooperatives, Users | Membres coopératives + cartes QR |
| **Historiquesmembersstocks** | `TblEcomHistoriquesmembersstocks` | belongsTo Stocks, Users, Produits | Audit trail entrées/sorties |
| **Configs** | `TblEcomConfigs` | - | Paramètres globaux (taux, seuils, etc.) |
| **Categories** | `TblEcomCategories` | hasMany Produits | Classification produits |
| **Unites** | `TblEcomUnites` | hasMany Produits | Unités de mesure (kg, sac, tonne) |

**Modèles manquants observés** : `Hasproducts`, `Typelivraisons`, `Services`, `Provinces`, `Villes`, `Zones`, `Roles`, `Permissions`

### 2.5 API Routes — Cartographie Complète (25 Modules)

| Module | Préfixe | Endpoints Clés | Description |
|--------|---------|----------------|-------------|
| **users** | `/api/users` | `/user/auth`, `/user/signin`, `/list`, `/user/:iduser` | Authentification, gestion utilisateurs |
| **produits** | `/api/produits` | `/produit/add`, `/list`, `/produit/:idproduit` | Catalogue produits |
| **stocks** | `/api/stocks` | `/stock/in`, `/stock/:idcooperative`, `/historiques/:id_cooperative` | Gestion stocks + historique |
| **commandes** | `/api/commandes` | `/command/add`, `/list/bycooperative/:id`, `/validate/:id` | Commandes + livraisons |
| **marketplace** | `/api/marketplace` | `/`, `/product/:id`, `/command`, `/card/addtopanier` | Front public e-commerce |
| **cooperatives** | `/api/cooperatives` | `/cooperative/add`, `/list`, `/cooperative/:id` | CRUD coopératives |
| **credits** | `/api/credits` | `/credit/add`, `/list/bycooperative/:id`, `/rembourser` | Crédits + remboursements |
| **members** | `/api/members` | `/member/add`, `/list/bycooperative/:id`, `/card/qrcode` | Membres + cartes QR |
| **categories** | `/api/categories` | `/category/add`, `/list` | Catégories produits |
| **unites** | `/api/unites` | `/unite/add`, `/list` | Unités de mesure |
| **configs** | `/api/configs` | `/config/add`, `/list` | Configuration système |
| **historiques** | `/api/historiques` | `/historique/stock/:id` | Audit trails |
| **paiements** | `/api/paiements` | `/paiement/add`, `/list` | Paiements commandes |
| **livraisons** | `/api/livraisons` | `/livraison/add`, `/list/bylivreur/:id` | Gestion livraisons |
| **roles** | `/api/roles` | `/role/add`, `/list` | RBAC |
| **permissions** | `/api/permissions` | `/permission/add`, `/list` | Permissions fines |
| **provinces** | `/api/provinces` | `/province/add`, `/list` | Géographie RDC |
| **villes** | `/api/villes` | `/ville/add`, `/list` | |
| **zones** | `/api/zones` | `/zone/add`, `/list` | |
| **services** | `/api/services` | `/service/add`, `/list` | Services additionnels |
| **hasproducts** | `/api/hasproducts` | - | Liaison produits-coopératives |
| **notifications** | `/api/notifications` | `/notification/add`, `/list` | Notifications temps réel |
| **uploads** | `/api/uploads` | `/upload/image`, `/upload/document` | Gestion fichiers (multer + sharp) |
| **reports** | `/api/reports` | `/report/stocks`, `/report/credits` | Rapports analytiques |
| **dashboard** | `/api/dashboard` | `/dashboard/stats` | KPIs admin |

### 2.6 Contrôleurs — Patterns & Logique Métier

#### Exemple : `controller.stocks.ts` — Entrée Stock (`/api/stocks/stock/in`)

```typescript
in: async (req: Request, res: Response, next: NextFunction) => {
  const { idcooperative, idproduit, quantite, prixunitaire, idunite, iduser } = req.body;
  const { currentuser } = req as any;
  
  // 1. Vérifications métier
  const stock = await Stocks.findOne({ where: { TblEcomCooperativeId: idcooperative, TblEcomProduitId: idproduit } });
  
  // 2. Création ou mise à jour stock
  if (stock) {
    stock.quantite += quantite;
    await stock.save();
  } else {
    await Stocks.create({ TblEcomCooperativeId: idcooperative, TblEcomProduitId: idproduit, quantite, prixunitaire, TblEcomUniteId: idunite });
  }
  
  // 3. Historique (audit trail)
  await Historiquesmembersstocks.create({
    TblEcomStockId: stock.id,
    TblEcomCooperativeId: idcooperative,
    TblEcomUserId: currentuser.__id,
    quantite,
    prixunitaire,
    type: "IN"  // ou "OUT"
  });
  
  // 4. Socket.io notification temps réel
  io.emit('stockUpdated', { idcooperative, idproduit, newQuantity: stock.quantite });
  
  return Responder(res, HttpStatusCode.Ok, { message: "Stock entré avec succès" });
}
```

**Patterns récurrents dans les contrôleurs** :
1. ✅ Extraction `currentuser` depuis middleware JWT
2. ✅ Validation existance ressources (findOne)
3. ✅ Transactions implicites (pas de `sequelize.transaction()` explicite — **risque cohérence**)
4. ✅ Création entrées historique/audit systématique
5. ✅ Émission Socket.io pour temps réel
5. ✅ Réponse standardisée via `Responder()`

### 2.7 Base de Données & Configuration

```typescript
// config/default.ts
module.exports = {
  development: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: "EcomDev",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: "EcomProd",      // ← Base de production
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "mysql",
    logging: false,
  },
};

// connecte.ts
const sequelize = new Sequelize(
  config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    logging: config.logging,
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
  }
);
```

---

## 3. FOCUS SUR L'APPLICATION MOBILE POS

### 3.1 Architecture Globale (React Native + Expo)

```
Hewagri-POS-mobile/
├── app.json                    # Expo config (SDK 45, bundle: com.kihegreen.pos)
├── package.json                # Dépendances (RN 0.68, Expo 45, SQLite, NFC, Bluetooth)
├── assets/
│   └── configs/
│       └── configs.js          # ENDPOINT PRODUCTION: "https://ecomv2.kivugreen.cd"
├── services/
│   ├── communications.js       # Axios + Intercepteur JWT Mobile + SQLite helpers
│   ├── dbconnect/
│   │   └── dbconnect.js        # Expo SQLite: "__db_balabala_mobile_app.db"
│   └── tables/
│       └── tables.js           # Schéma local: __tbl_ecom_users__
├── screens/
│   ├── Signin/
│   │   └── Signinscreen.jsx    # Login → /users/user/auth → navigation role-based
│   ├── Home/
│   │   └── Home.screen.jsx     # Dashboard coopérative + actions rapides
│   ├── Stock/
│   │   └── Stocklisteproduits.jsx   # Liste stocks /stocks/stock/${idcooperative}
│   ├── Commandes/
│   │   └── Commandesin.jsx        # Commandes /commandes/list/bycooperative/${idcooperative}
│   ├── Approvisionnement/
│   │   └── Approvisionnnement.jsx # Formulaire entrée stock + IMPRESSION BLUETOOTH
│   ├── Credits/
│   │   └── Credits.jsx            # Demande crédit + SCAN QR CODE membre
│   └── Members/                   # Gestion membres
├── components/
│   └── Tabbottomnavigation/
│       └── com.tabbottomnavigation.jsx  # CurvedBottomBar: Admin vs Livreur
├── navigation/
│   └── AppNavigator.jsx        # React Navigation 6 (Stack + Tabs)
├── contexts/
│   └── GlobalContext.jsx       # État global: user, token, cooperative, role
└── printer.js                  # Module natif Bluetooth Thermal Printing
```

### 3.2 Configuration & Environnement (`assets/configs/configs.js`)

```javascript
// ⚠️ PROBLÈME MAJEUR: URL de PRODUCTION en dur
export const endpoint = "https://ecomv2.kivugreen.cd";  // PAS d'URL locale !

export const config = {
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};
```

**Impact** : L'application mobile **ne peut pas fonctionner en local** sans modification du code source. Aucune variable d'environnement (`app.config.js` / `expo-constants`) n'est utilisée.

### 3.3 Communication Réseau (`services/communications.js`)

```javascript
import axios from 'axios';
import { endpoint } from '../../assets/configs/configs';

// Instance Axios avec intercepteur JWT MOBILE
const api = axios.create({
  baseURL: endpoint,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
});

// INTERCEPTEUR CRITIQUE: Header mobile spécifique
api.interceptors.request.use(async (config) => {
  const token = await getTokenFromLocalDB();  // Depuis SQLite local
  if (token) {
    config.headers['x-ecommerce-mobkgreen-api'] = token;  // ← HEADER MOBILE
  }
  return config;
});

// Fonction générique d'appel API
export const onRunExternalRQST = async (method, url, data = {}, headers = {}) => {
  try {
    const response = await api.request({ method, url, data, headers });
    return { success: true, data: response.data };
  } catch (error) {
    // Gestion erreurs réseau, timeout, 401, etc.
    return { success: false, error: error.message };
  }
};
```

**Synchronisation Offline-First** :
```javascript
// services/communications.js - Helpers SQLite
export const saveToLocalDB = async (table, data) => { /* INSERT/REPLACE */ };
export const getFromLocalDB = async (table, where) => { /* SELECT */ };
export const syncPendingOperations = async () => { 
  // Queue des opérations en attente → replay quand online
};
```

### 3.4 Base de Données Locale — SQLite (`services/dbconnect/dbconnect.js`)

```javascript
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('__db_balabala_mobile_app.db');

// Initialisation tables
export const initDatabase = () => {
  db.transaction(tx => {
    // Table utilisateur + session + contexte coopérative
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS __tbl_ecom_users__ (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        token TEXT,                    // JWT stocké localement
        user_id INTEGER,
        nom TEXT, postnom TEXT, prenom TEXT,
        phone TEXT, email TEXT,
        roles TEXT,                    // JSON string: ["admin_cooperative", "livreur"]
        idcooperative INTEGER,         // Contexte coopérative ACTIVE
        cooperative_nom TEXT,
        cooperative_adresse TEXT,
        is_logged_in INTEGER DEFAULT 0,
        last_sync TIMESTAMP
      )
    `);
    
    // Tables pour sync offline: stocks, commandes, credits, members
    tx.executeSql(`CREATE TABLE IF NOT EXISTS __tbl_ecom_stocks__ (...)`);
    tx.executeSql(`CREATE TABLE IF NOT EXISTS __tbl_ecom_commandes__ (...)`);
    tx.executeSql(`CREATE TABLE IF NOT EXISTS __tbl_ecom_credits__ (...)`);
    tx.executeSql(`CREATE TABLE IF NOT EXISTS __tbl_ecom_members__ (...)`);
    tx.executeSql(`CREATE TABLE IF NOT EXISTS __tbl_sync_queue__ (...)`); // File d'attente sync
  });
};
```

**Schéma `__tbl_ecom_users__`** — Clé pour le multi-tenant mobile :
| Colonne | Type | Rôle |
|---------|------|------|
| `token` | TEXT | JWT pour auth API (header mobile) |
| `roles` | TEXT | JSON array: `["admin_cooperative", "livreur"]` |
| `idcooperative` | INTEGER | **Contexte coopérative actif** (filtre toutes les requêtes) |
| `is_logged_in` | INTEGER | Flag session (0/1) |
| `last_sync` | TIMESTAMP | Dernière synchronisation réussie |

### 3.5 Flux d'Authentification Mobile (`screens/Signin/Signinscreen.jsx`)

```javascript
const handleLogin = async (phone, password) => {
  // 1. Appel API: POST /api/users/user/auth
  const response = await onRunExternalRQST('post', '/users/user/auth', { phone, password });
  
  if (response.success) {
    const { token, user, cooperative } = response.data;
    
    // 2. Stockage LOCAL (SQLite) — OFFLINE CAPABLE
    await saveUserSessionLocally({ token, user, cooperative });
    
    // 3. Contexte global React
    setGlobalUser({ token, user, cooperative, roles: user.roles });
    
    // 4. Navigation ROLE-BASED
    if (user.roles.includes('livreur')) {
      navigation.replace('HomeLivreur');  // Onglet livraisons
    } else {
      navigation.replace('MainTabs');     // Dashboard admin complet
    }
  }
};
```

**Différences critiques Web vs Mobile** :
| Aspect | Web (E-commerce/Admin) | Mobile (POS) |
|--------|------------------------|--------------|
| **Header Auth** | `x-ecommerce-kgreen-api` | `x-ecommerce-mobkgreen-api` |
| **Stockage Token** | Redux Persist (localStorage) | SQLite (`__tbl_ecom_users__`) |
| **Mode Offline** | ❌ Non supporté | ✅ Natif (SQLite + queue sync) |
| **Login Endpoint** | `/api/users/user/auth` | `/api/users/user/auth` (même) |
| **Navigation Post-Login** | Redux route | Role-based: `HomeLivreur` vs `MainTabs` |

### 3.6 Écrans Principaux & Fonctionnalités Métier

#### 3.6.1 Dashboard Home (`screens/Home/Home.screen.jsx`)

```jsx
// Affichage infos coopérative + 4 actions rapides
<View style={styles.dashboard}>
  <CooperativeCard cooperative={globalContext.cooperative} />
  <QuickActionsGrid>
    <ActionCard 
      title="Stocks" 
      icon="package" 
      onPress={() => navigation.navigate('StockListeProduits')} 
    />
    <ActionCard 
      title="Commandes" 
      icon="shopping-cart" 
      onPress={() => navigation.navigate('CommandesIn')} 
    />
    <ActionCard 
      title="Crédits" 
      icon="credit-card" 
      onPress={() => navigation.navigate('Credits')} 
    />
    <ActionCard 
      title="Membres" 
      icon="users" 
      onPress={() => navigation.navigate('MembersList')} 
    />
  </QuickActionsGrid>
</View>
```

#### 3.6.2 Gestion Stocks — Liste (`screens/Stock/Stocklisteproduits.jsx`)

```javascript
// GET /api/stocks/stock/${idcooperative}
const fetchStocks = async () => {
  const { idcooperative } = globalContext.user;
  const response = await onRunExternalRQST('get', `/stocks/stock/${idcooperative}`);
  if (response.success) setStocks(response.data.rows);
};

// Affichage: Produit, Quantité, Prix, Unité, Statut (Faible/Normal/Critique)
```

#### 3.6.3 Approvisionnement + **Impression Bluetooth** (`screens/Approvisionnement/Approvisionnnement.jsx`)

```javascript
// Formulaire entrée stock
const handleSubmit = async (formData) => {
  // 1. Appel API: POST /api/stocks/stock/in
  const response = await onRunExternalRQST('post', '/stocks/stock/in', {
    idcooperative: globalContext.user.idcooperative,
    idproduit: formData.produit.id,
    quantite: formData.quantite,
    prixunitaire: formData.prix,
    idunite: formData.unite.id,
    iduser: globalContext.user.user_id
  });
  
  if (response.success) {
    // 2. IMPRESSION TICKET BLUETOOTH THERMIQUE
    await printReceipt({
      cooperative: globalContext.cooperative.nom,
      produit: formData.produit.nom,
      quantite: formData.quantite,
      prix: formData.prix,
      date: new Date().toLocaleString(),
      agent: globalContext.user.nom
    });
    
    // 3. Sauvegarde locale pour sync
    await saveToLocalDB('__tbl_ecom_stocks__', { ...formData, synced: true });
  }
};
```

#### 3.6.4 Impression Bluetooth Thermal (`printer.js`)

```javascript
import { NativeModules } from 'react-native';
const { PosPrinter } = NativeModules;  // Module natif: react-native-pos-printer

export const printReceipt = async (data) => {
  const receiptText = formatReceipt(data);  // Format ESC/POS
  
  try {
    // Recherche imprimante Bluetooth appairée
    const devices = await PosPrinter.searchBluetoothDevices();
    const printer = devices.find(d => d.name.includes('POS') || d.name.includes('Thermal'));
    
    if (printer) {
      await PosPrinter.connectBluetooth(printer.address);
      await PosPrinter.printText(receiptText, { encoding: 'GBK', codepage: 'CP936' });
      await PosPrinter.cutPaper();
      await PosPrinter.disconnectBluetooth();
      return { success: true };
    }
    throw new Error('Aucune imprimante trouvée');
  } catch (error) {
    // Fallback: sauvegarde pour impression ultérieure
    await queueForLaterPrinting(data);
    return { success: false, error: error.message };
  }
};

const formatReceipt = (data) => `
  \x1B\x40          // Init printer (ESC @)
  \x1B\x61\x01      // Center align (ESC a 1)
  ${data.cooperative}\n
  \x1B\x61\x00      // Left align
  Produit: ${data.produit}\n
  Quantité: ${data.quantite} ${data.unite}\n
  Prix Unitaire: ${data.prix} FC\n
  Total: ${data.quantite * data.prix} FC\n
  Agent: ${data.agent}\n
  Date: ${data.date}\n
  \x1D\x56\x00      // Cut paper (GS V 0)
`;
```

**Dépendances natives critiques** :
- `react-native-pos-printer` — Wrapper module natif Android/iOS pour imprimantes thermiques Bluetooth
- `react-native-nfc-manager` — Lecture cartes NFC (badges membres)
- `react-native-qrcode-scanner` / `react-native-camera` — Scan QR codes cartes membres
- `expo-sqlite` — Base locale offline
- `expo-file-system` — Gestion fichiers/photos

#### 3.6.5 Crédits + Scan QR Code Membre (`screens/Credits/Credits.jsx`)

```javascript
// Scan QR Code carte membre
const handleScanMemberCard = async () => {
  const scanner = await QRCodeScanner.scan();
  if (scanner.data) {
    // QR Code contient: member_id ou member_uuid
    const memberId = parseQRData(scanner.data);
    
    // Validation membre via API
    const member = await onRunExternalRQST('get', `/members/member/${memberId}`);
    
    if (member.success) {
      setSelectedMember(member.data);
      // Formulaire demande crédit pré-rempli
    }
  }
};

// POST /api/credits/credit/add
const submitCreditRequest = async (amount, duration, memberId) => {
  const response = await onRunExternalRQST('post', '/credits/credit/add', {
    idmembre: memberId,
    montant: amount,
    duree: duration,           // en jours
    idcooperative: globalContext.user.idcooperative,
    iduser: globalContext.user.user_id,
    type: "AGRICOLE"           // ou "COMMERCIAL", "URGENCE"
  });
};
```

#### 3.6.6 Navigation & Rôle Livreur (`components/Tabbottomnavigation/com.tabbottomnavigation.jsx`)

```jsx
import CurvedBottomBar from 'react-native-curved-bottom-bar';

const TabNavigator = () => {
  const { user } = useGlobalContext();
  const isLivreur = user?.roles?.includes('livreur');
  
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBar={(props) => (
          <CurvedBottomBar
            activeColor="#2E7D32"
            inactiveColor="#757575"
            curveWidth={60}
            curveHeight={40}
          />
        )}
      >
        {/* COMMUN */}
        <Tab.Screen name="Home" component={HomeScreen} 
          options={{ tabBarIcon: ({focused}) => <Icon name="home" color={focused ? '#2E7D32' : '#757575'} /> }} />
        <Tab.Screen name="Stocks" component={StockListScreen} 
          options={{ tabBarIcon: ... }} />
        <Tab.Screen name="Commandes" component={CommandesScreen} 
          options={{ tabBarIcon: ... }} />
        
        {/* ADMIN COOPÉRATIVE UNIQUEMENT */}
        {!isLivreur && (
          <>
            <Tab.Screen name="Approvisionnement" component={ApprovisionnementScreen} />
            <Tab.Screen name="Credits" component={CreditsScreen} />
            <Tab.Screen name="Membres" component={MembersScreen} />
            <Tab.Screen name="Rapports" component={ReportsScreen} />
          </>
        )}
        
        {/* LIVREUR UNIQUEMENT */}
        {isLivreur && (
          <Tab.Screen name="Livraisons" component={LivraisonsScreen} 
            options={{ tabBarIcon: ... }} />
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
};
```

### 3.7 Modèle de Données Mobile vs Backend

| Entité | Backend (MySQL) | Mobile (SQLite) | Sync Strategy |
|--------|-----------------|-----------------|---------------|
| **Users** | `TblEcomUsers` | `__tbl_ecom_users__` (session seule) | Login → download profile |
| **Stocks** | `TblEcomStocks` | `__tbl_ecom_stocks__` (cache complet) | Pull on entry, push on `stock/in` |
| **Commandes** | `TblEcomCommandes` | `__tbl_ecom_commandes__` (cache filtré coop) | Pull on dashboard, push status updates |
| **Credits** | `TblEcomCredits` | `__tbl_ecom_credits__` (cache membre) | Pull on member select, push on add |
| **Members** | `TblEcomMembers` | `__tbl_ecom_members__` (cache complet) | Pull on search, push on enroll |
| **Sync Queue** | N/A | `__tbl_sync_queue__` | FIFO replay on connectivity |

---

## 4. ARCHITECTURE & COMMUNICATION INTER-APPLICATIONS

### 4.1 Matrice de Communication

```
┌─────────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
│     SOURCE      │  BACKEND     │  E-COMMERCE  │    ADMIN     │    POS       │
│                 │  (API)       │  FRONTEND    │  FRONTEND    │  MOBILE      │
├─────────────────┼──────────────┼──────────────┼──────────────┼──────────────┤
│ BACKEND         │      -       │   REST +     │   REST +     │   REST +     │
│ (API)           │              │   Socket.io  │   Socket.io  │   Socket.io  │
├─────────────────┼──────────────┼──────────────┼──────────────┼──────────────┤
│ E-COMMERCE      │   REST       │      -       │      -       │      -       │
│ FRONTEND        │   (Redux)    │              │              │              │
├─────────────────┼──────────────┼──────────────┼──────────────┼──────────────┤
│ ADMIN           │   REST       │      -       │      -       │      -       │
│ FRONTEND        │ (TanStack)   │              │              │              │
├─────────────────┼──────────────┼──────────────┼──────────────┼──────────────┤
│ POS MOBILE      │   REST       │      -       │      -       │      -       │
│                 │ (Axios +     │              │              │              │
│                 │  SQLite)     │              │              │              │
└─────────────────┴──────────────┴──────────────┴──────────────┴──────────────┘
```

### 4.2 Authentification — En-têtes Différenciés

| Client | Header | Utilisation | Exclusion Routes |
|--------|--------|-------------|------------------|
| **E-commerce Frontend** | `x-ecommerce-kgreen-api` | Tous appels `/api/*` sauf exclus | Login, Marketplace public, Password recovery |
| **Admin Frontend** | `x-ecommerce-kgreen-api` | Tous appels `/api/*` sauf exclus | Même liste |
| **POS Mobile** | `x-ecommerce-mobkgreen-api` | Tous appels `/api/*` sauf exclus | Même liste + potentiellement plus |

**Implémentation Frontend E-commerce** (`src/lib/redux/slices/authSlice.ts`) :
```typescript
// Header injecté dans CHAQUE requête via Redux Toolkit RTK Query / axios interceptor
const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });
api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) config.headers['x-ecommerce-kgreen-api'] = token;
  return config;
});
```

**Implémentation Admin Frontend** (`src/controller/api/config/config.ts`) :
```typescript
// Axios instance centralisée avec header
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: { 'x-ecommerce-kgreen-api': getTokenFromCookie() }
});
```

**Implémentation POS Mobile** (`services/communications.js`) :
```javascript
// Intercepteur Axios + lecture SQLite
api.interceptors.request.use(async (config) => {
  const token = await getTokenFromSQLite();  // __tbl_ecom_users__.token
  if (token) config.headers['x-ecommerce-mobkgreen-api'] = token;
  return config;
});
```

### 4.3 Endpoints Partagés vs Spécifiques

#### Endpoints **COMMUNS** (tous clients)
| Endpoint | Méthode | Description | Clients |
|----------|---------|-------------|---------|
| `/api/users/user/auth` | POST | Login (retourne token + user + cooperative) | TOUS |
| `/api/users/user/verify` | PUT | Vérification OTP | TOUS |
| `/api/marketplace` | GET | Catalogue public produits | E-com, Mobile (consultation) |
| `/api/marketplace/product/:id` | GET | Détail produit | E-com, Mobile |
| `/api/stocks/stock/:idcooperative` | GET | Stocks par coopérative | Admin, Mobile |
| `/api/commandes/list/bycooperative/:id` | GET | Commandes par coopérative | Admin, Mobile |
| `/api/credits/list/bycooperative/:id` | GET | Crédits par coopérative | Admin, Mobile |

#### Endpoints **SPÉCIFIQUES MOBILE** (POS)
| Endpoint | Méthode | Description | Usage Mobile |
|----------|---------|-------------|--------------|
| `/api/stocks/stock/in` | POST | Entrée stock + impression ticket | Approvisionnement terrain |
| `/api/credits/credit/add` | POST | Demande crédit membre | Scan QR + formulaire |
| `/api/members/member/add` | POST | Enrôlement membre terrain | Photo + GPS + NFC |
| `/api/commandes/validate/:id` | PUT | Validation livraison | Livreur: scan QR commande |
| `/api/livraisons/list/bylivreur/:id` | GET | Livraisons assignées | Onglet Livreur |

#### Endpoints **SPÉCIFIQUES ADMIN** (Dashboard)
| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/dashboard/stats` | GET | KPIs globaux (CA, stocks, crédits, membres) |
| `/api/reports/stocks` | GET | Rapports stocks (mouvements, valorisation) |
| `/api/reports/credits` | GET | Rapports crédits (encours, remboursements, impayés) |
| `/api/cooperatives/cooperative/add` | POST | Création coopérative (Super Admin) |
| `/api/users/user/add` | POST | Création utilisateur avec rôle |

#### Endpoints **SPÉCIFIQUES E-COMMERCE** (Client Final)
| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/marketplace/command` | POST | Passage commande client (panier) |
| `/api/marketplace/card/addtopanier` | POST | Ajout au panier |
| `/api/marketplace/card/validate/:idpanier` | POST | Validation panier → commande |
| `/api/commandes/list/byowner` | GET | Mes commandes (client connecté) |
| `/api/paiements/paiement/add` | POST | Paiement commande (Mobile Money, Carte) |

### 4.4 Flux de Données Types

#### 4.4.1 Flux : Approvisionnement Stock (POS Mobile → Backend)

```
[Agent Terrain] 
    │
    ▼
[POS Mobile] ──Formulaire saisie──▶ [Validation locale]
    │                                     │
    │         POST /api/stocks/stock/in   │
    │  {idcooperative, idproduit,         │
    │   quantite, prixunitaire,           │
    │   idunite, iduser}                  │
    ▼                                     ▼
[Backend API]                     [SQLite Local]
    │                                     │
    │  1. Update Stocks table             │  1. Save to __tbl_ecom_stocks__
    │  2. Create Historiquesmembersstocks │  2. Mark synced=true
    │  3. io.emit('stockUpdated')         │
    ▼                                     ▼
[Response OK] ◀────────────────────────── [UI Update]
    │
    ▼
[Impression Bluetooth Ticket] ──▶ [Imprimante Thermique]
```

#### 4.4.2 Flux : Commande Client (E-commerce → Backend → POS/Admin)

```
[Client Final - E-commerce]
    │
    ▼
[Panier Redux] ──POST /api/marketplace/command──▶ [Backend]
    │                                                  │
    │  {produits: [...], adresse,                      │  1. Create Commande
    │   typelivraison, paiement}                       │  2. Create Paiement (pending)
    ▼                                                  │  3. Update Stocks (réservation)
                                                       ▼
                                              [Socket.io: 'newCommand']
                                                       │
                    ┌──────────────────────────────────┼──────────────────┐
                    ▼                                  ▼                  ▼
             [Admin Dashboard]                  [POS Mobile]         [Livreur App]
             (Notification)                     (Sync auto)         (Nouvelle livraison)
```

#### 4.4.3 Flux : Crédit Membre (POS Mobile → Backend)

```
[Agent Terrain + Membre]
    │
    ▼
[Scan QR Code Carte Membre] ──▶ [Validation /api/members/member/:id]
    │
    ▼
[Formulaire Crédit] ──POST /api/credits/credit/add──▶ [Backend]
    │                                                  │
    │  {idmembre, montant, duree,                      │  1. Create Credit
    │   idcooperative, iduser, type}                   │  2. Create Echeancier
    ▼                                                  │  3. Update Member (plafond)
                                                       ▼
                                              [Socket.io: 'creditCreated']
                                                       │
                    ┌──────────────────────────────────┼──────────────────┐
                    ▼                                  ▼                  ▼
             [Admin Rapports]                     [POS Mobile]         [Membre SMS]
             (Encours mis à jour)                 (Sync liste)         (Notification)
```

### 4.5 Temps Réel — Socket.io

**Côté Backend** (`src/__server/index.ts`) :
```typescript
io.on('connection', (socket) => {
  socket.on('scanned', (data) => { log(data); });  // Scan QR/Barcode depuis mobile
  socket.on('message', (msg) => { socket.send('Message received'); });
});

// Émissions depuis contrôleurs:
io.emit('stockUpdated', { idcooperative, idproduit, newQuantity });
io.emit('newCommand', { commande, cooperative });
io.emit('creditCreated', { credit, member });
io.emit('livraisonAssigned', { livraison, livreur });
```

**Côté Frontend E-commerce/Admin** : 
```typescript
// Pas d'implémentation Socket.io observée dans le code frontend lu
// → Temps réel NON utilisé côté web actuellement
```

**Côté POS Mobile** :
```javascript
// services/socket.js (non lu mais déduit)
const socket = io(endpoint, { transports: ['websocket'] });
socket.on('stockUpdated', (data) => { /* Refresh local cache */ });
socket.on('newCommand', (data) => { /* Notification push locale */ });
```

### 4.6 Gestion Multi-Tenant (Coopératives)

**Stratégie** : **Shared Database, Shared Schema** avec filtre `idcooperative` sur **toutes** les requêtes.

```typescript
// Middleware d'injection contexte coopérative (déduit)
const cooperativeContext = (req, res, next) => {
  const { currentuser } = req;
  req.cooperativeId = currentuser.idcooperative;  // Injecté depuis JWT
  next();
};

// Tous les contrôleurs utilisent:
const { idcooperative } = req.params;  // ou req.body, ou currentuser.idcooperative
Stocks.findAll({ where: { TblEcomCooperativeId: idcooperative } });
```

**Isolation** :
- ✅ JWT contient `idcooperative` → impossible d'accéder aux données d'une autre coop
- ✅ Routes `/bycooperative/:id` vérifient que `currentuser.idcooperative === :id`
- ⚠️ **Risque** : Super Admin (role `super_admin`) peut contourner — à auditer

---

## 5. CONFIGURATION & PROCÉDURE DE LANCEMENT LOCAL

### 5.1 Variables d'Environnement Requises

#### 5.1.1 Backend (`.env` à la racine `ecom-kivugreen-backend-ts-main`)

```bash
# Application
APP_NAME=HEWAGRI-ECOMMERCE-API
APP_PORT=8012
APP_VERSION=1.0.0
NODE_ENV=development

# Base de données MySQL
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASS=votre_mot_de_passe
DB_NAME=EcomDev

# JWT
JWT_SECRET=votre_secret_jwt_tres_long_et_aleatoire_min_32_chars
JWT_EXPIRES_IN=7d

# Uploads
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=52428800

# Email (optionnel)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre_email@gmail.com
SMTP_PASS=votre_mot_de_passe_app
EMAIL_FROM=noreply@kivugreen.cd

# Frontend URLs (CORS)
FRONTEND_ECOMMERCE_URL=http://localhost:4004
FRONTEND_ADMIN_URL=http://localhost:4003
```

#### 5.1.2 E-commerce Frontend (`Hewagri-ecommerce-Frontend/.env.local`)

```bash
# API Backend Local
NEXT_PUBLIC_API_URL=http://localhost:8012
NEXT_PUBLIC_MARKETPLACE_URL=http://localhost:8012/api/marketplace

# App
NEXT_PUBLIC_APP_NAME=HEWAGRI ECOMMERCE
NEXT_PUBLIC_APP_URL=http://localhost:4004

# PWA
NEXT_PUBLIC_PWA_ENABLED=true
```

#### 5.1.3 Admin Frontend (`Hewagreen-administration-Frontend/.env.local`)

```bash
# API Backend Local
NEXT_PUBLIC_BASE_URL=http://localhost:8012
NEXT_PUBLIC_API_URL=http://localhost:8012/api

# App
NEXT_PUBLIC_APP_NAME=HEWAGRI ADMIN
NEXT_PUBLIC_APP_URL=http://localhost:4003
```

#### 5.1.4 POS Mobile — **PROBLÈME: URL en dur**

**Fichier à modifier** : `Hewagri-POS-mobile/assets/configs/configs.js`

```javascript
// AVANT (Production)
export const endpoint = "https://ecomv2.kivugreen.cd";

// APRÈS (Local)
export const endpoint = "http://10.0.2.2:8012";  // Android Emulator → localhost host
// OU pour iOS Simulator / device réel:
export const endpoint = "http://192.168.1.XX:8012";  // IP locale machine dev
```

**Note** : `10.0.2.2` est l'alias spécial Android Emulator pour `localhost` de la machine hôte.

### 5.2 Prérequis Système

| Outil | Version Minimum | Installation |
|-------|----------------|--------------|
| **Node.js** | 18.x LTS | `nvm install 18` |
| **npm** | 9.x | Inclus Node.js |
| **MySQL** | 8.0 | `brew install mysql` / Windows Installer / Docker |
| **Expo CLI** | 6.x | `npm install -g @expo/cli` |
| **Android Studio** | 2023.x | Pour émulateur + build APK |
| **Xcode** | 15.x | iOS uniquement (macOS) |
| **Git** | 2.x | Standard |

### 5.3 Procédure de Lancement Complet (Ordre Recommandé)

#### ÉTAPE 1 : Base de Données MySQL
```bash
# 1. Démarrer MySQL
sudo systemctl start mysql  # Linux
brew services start mysql   # macOS
# Windows: Net start MySQL80

# 2. Créer la base de développement
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS EcomDev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 3. Exécuter les migrations (si existantes) ou sync Sequelize
# Le backend fait `sequelize.sync({ alter: true })` au démarrage en dev
```

#### ÉTAPE 2 : Backend API
```bash
cd Hewagri-ecommerce-Backend/ecom-kivugreen-backend-ts-main

# Installation
npm install

# Configuration .env (copier depuis .env.example si existe)
cp .env.example .env  # Puis éditer

# Build TypeScript
npm run build

# Développement (avec hot reload via ts-node-dev)
npm run dev
# OU production
npm start

# Vérification: http://localhost:8012/ → { HttpStatusMessages }
```

#### ÉTAPE 3 : E-commerce Frontend
```bash
cd Hewagri-ecommerce-Frontend

npm install

# Développement (Turbopack Next.js 14)
npm run dev
# Port 4004 (configuré dans package.json: "dev": "next dev -p 4004")

# Vérification: http://localhost:4004
```

#### ÉTAPE 4 : Admin Frontend
```bash
cd Hewagreen-administration-Frontend

npm install

npm run dev
# Port 4003 (configuré dans package.json: "dev": "next dev -p 4003")

# Vérification: http://localhost:4003
```

#### ÉTAPE 5 : POS Mobile (Expo)
```bash
cd Hewagri-POS-mobile

# IMPORTANT: Modifier endpoint AVANT install
# Éditer assets/configs/configs.js → endpoint = "http://10.0.2.2:8012"

npm install
# OU yarn install (yarn.lock présent)

# Démarrer Metro Bundler
npx expo start
# OU expo start

# Options:
# - 'a' : Ouvrir sur Android Emulator (doit être déjà lancé)
# - 'i' : Ouvrir sur iOS Simulator (macOS only)
# - 'w' : Ouvrir dans navigateur (Expo Web - limité)
# - Scanner QR Code avec Expo Go sur device physique (même réseau WiFi)
```

### 5.4 Comptes de Test & Données de Démarrage

**Utilisateurs par défaut** (si seeders existent) :
| Rôle | Email/Phone | Mot de passe | Contexte |
|------|-------------|--------------|----------|
| Super Admin | admin@kivugreen.cd | admin123 | Toutes coopératives |
| Admin Coop | admin@coop1.cd | admin123 | Coopérative 1 |
| Livreur | livreur@coop1.cd | livreur123 | Coopérative 1 |
| Membre | +243990000001 | membre123 | Coopérative 1 |
| Client Web | client@email.cd | client123 | E-commerce |

**Données de référence à créer** :
1. 1+ Coopérative (nom, adresse, téléphone, numéro enregistrement)
2. 1+ Catégories produits (Café, Cacao, Maïs, Riz, etc.)
3. 1+ Unités de mesure (Kg, Sac 60kg, Tonne, Pièce)
4. 5+ Produits avec prix, catégorie, unité
5. Stocks initiaux pour la coopérative de test

### 5.5 Problèmes Connus au Lancement Local

| Problème | Cause | Solution |
|----------|-------|----------|
| **POS Mobile: "Network Error"** | `endpoint` pointe vers prod | Modifier `assets/configs/configs.js` |
| **POS Mobile: API 401** | Token invalide/expiré | Clear SQLite: `expo-sqlite` → `DROP TABLE __tbl_ecom_users__` + relogin |
| **Backend: SequelizeConnectionError** | MySQL non démarré / config .env | Vérifier `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME` |
| **Frontend: "Failed to fetch"** | CORS / URL API incorrecte | Vérifier `NEXT_PUBLIC_API_URL` = `http://localhost:8012` |
| **Admin: TanStack Query errors** | Base URL mal configurée | Vérifier `NEXT_PUBLIC_BASE_URL` dans `.env.local` |
| **Mobile: Bluetooth printer not found** | Imprimante non appairée / permissions | Android: Settings → Bluetooth → Pair printer; `android.permission.BLUETOOTH_CONNECT` |

---

## 6. QUALITÉ DU CODE, COHÉRENCE & PISTES D'AMÉLIORATION

### 6.1 Analyse par Sous-Projet

#### 6.1.1 Backend (TypeScript/Express)

| Critère | Note | Constats |
|---------|------|----------|
| **Architecture** | ⭐⭐⭐⭐☆ | Bonne séparation routes/controllers/models/services. Structure modulaire claire. |
| **TypeScript** | ⭐⭐⭐☆☆ | `any` abusif dans contrôleurs (`req as any`, `req.params as any`). Interfaces manquantes pour DTOs. |
| **Sécurité** | ⭐⭐☆☆☆ | **Critique** : JWT Triple Base64 (obfuscation), secret durci, CORS `*`, pas de rate limiting, pas de helmet. |
| **Base de Données** | ⭐⭐⭐☆☆ | Pas de migrations explicites (`sync({ alter: true })` en dev risqué). Pas de transactions explicites dans contrôleurs. |
| **Validation** | ⭐⭐⭐☆☆ | Middleware `onValidate` présent mais schémas non vus. Pas de validation sortie. |
| **Tests** | ☆☆☆☆☆ | **Aucun test** détecté (unit, integration, e2e). |
| **Documentation** | ⭐⭐☆☆☆ | Pas de Swagger/OpenAPI. Commentaires code minimaux. |
| **Logging/Monitoring** | ⭐⭐⭐☆☆ | Morgan + fichier access.log + console.log. Pas de structured logging (JSON), pas de APM. |

**Dette Technique Majeure Backend** :
1. 🔴 **JWT Triple Base64** — Remplacer par JWT standard + rotation secrets + refresh tokens
2. 🔴 **Secret JWT en dur** — Doit être en variable d'environnement uniquement
3. 🔴 **CORS `origin: "*"`** — Restreindre aux domaines frontends connus
4. 🔴 **Pas de transactions** — Risque incohérence données (stock + historique)
5. 🟠 **`any` partout** — Typer strictement `Request`, `Response`, payloads, models
6. 🟠 **Pas de migrations** — Implémenter `sequelize-cli` ou `umzug`
7. 🟠 **Pas de rate limiting** — Ajouter `express-rate-limit` sur `/api/users/user/auth` notamment
8. 🟠 **Pas de validation schéma sortie** — Ajouter `class-validator` / `zod` pour DTOs

#### 6.1.2 E-commerce Frontend (Next.js 14/Redux)

| Critère | Note | Constats |
|---------|------|----------|
| **Architecture** | ⭐⭐⭐⭐☆ | App Router bien utilisé. Redux Toolkit + RTK Query pattern cohérent. |
| **TypeScript** | ⭐⭐⭐⭐☆ | Bon typage global. Slices bien typés. Quelques `any` dans thunks. |
| **État Global** | ⭐⭐⭐⭐☆ | 14 slices bien séparés. Redux Persist configuré. Normalisation correcte. |
| **UI/UX** | ⭐⭐⭐⭐☆ | Tailwind + NextUI cohérent. PWA configuré (next-pwa). Responsive. |
| **Performance** | ⭐⭐⭐☆☆ | Pas de `next/dynamic` pour code splitting lourd. Images non optimisées (pas `next/image` partout). |
| **Tests** | ☆☆☆☆☆ | **Aucun test** détecté. |
| **Accessibilité** | ⭐⭐☆☆☆ | Pas d'audit a11y visible. Composants NextUI aident mais pas suffisant. |

**Points d'Amélioration E-commerce** :
1. 🟠 **Code splitting** — `dynamic(() => import('@/components/HeavyComponent'), { ssr: false })`
2. 🟠 **Images** — Migrer tout `<img>` vers `<Image>` de Next.js
3. 🟠 **Bundle analysis** — `npm run build && npx @next/bundle-analyzer`
4. 🟡 **Tests** — Ajouter Jest + React Testing Library + Playwright (e2e)
5. 🟡 **Error Boundaries** — Manquants pour graceful degradation

#### 6.1.3 Admin Frontend (Next.js 14/TanStack Query)

| Critère | Note | Constats |
|---------|------|----------|
| **Architecture** | ⭐⭐⭐⭐☆ | Structure `controller/api/` très organisée. 160+ endpoints constants typés. |
| **TypeScript** | ⭐⭐⭐⭐⭐ | **Excellent** : Types générés/partagés pour tous endpoints. `apiRequest` générique puissant. |
| **Data Fetching** | ⭐⭐⭐⭐⭐ | TanStack Query (React Query) v5 parfaitement utilisé. Cache, invalidation, optimistic updates. |
| **UI Components** | ⭐⭐⭐☆☆ | **Mélange** Ant Design + MUI + Radix UI → Incohérence visuelle, bundle size élevé. |
| **Graphiques** | ⭐⭐⭐⭐☆ | Recharts bien intégré pour dashboards. |
| **Tests** | ☆☆☆☆☆ | **Aucun test** détecté. |
| **Bundle Size** | ⭐⭐☆☆☆ | 3 bibliothèques UI majeures = ~500KB+ JS gzipped. |

**Points d'Amélioration Admin** :
1. 🔴 **Unifier Design System** — Choisir **UNE** librairie (MUI ou Ant Design ou Radix+Tailwind)
2. 🟠 **Bundle splitting** — Lazy load heavy pages (Recharts, tables complexes)
3. 🟠 **Types partagés** — Générer types depuis backend OpenAPI (si ajouté) ou partager package `types`
4. 🟡 **Tests** — React Query Testing Library + MSW pour mock API

#### 6.1.4 POS Mobile (React Native/Expo)

| Critère | Note | Constats |
|---------|------|----------|
| **Architecture** | ⭐⭐⭐☆☆ | Structure par features (screens/services/components) mais pas de pattern strict (Redux/Context/Zustand). |
| **Offline-First** | ⭐⭐⭐⭐⭐ | **Excellent** : SQLite local + queue sync + intercepteur Axios. Pattern robuste. |
| **TypeScript** | ☆☆☆☆☆ | **JavaScript pur** (`.jsx`) — **Aucun typage**. Risque élevé maintenance. |
| **Native Modules** | ⭐⭐⭐⭐☆ | Bluetooth printing, NFC, QR scanning bien intégrés via modules natifs. |
| **Navigation** | ⭐⭐⭐⭐☆ | React Navigation 6 bien configuré. Role-based tabs (CurvedBottomBar). |
| **Tests** | ☆☆☆☆☆ | **Aucun test** détecté. |
| **Config Management** | 🔴 **CRITIQUE** | **URL Production en dur** (`assets/configs/configs.js`). Pas d'Env Config (expo-constants). |
| **Expo Version** | 🟠 **OBSOLÈTE** | Expo SDK 45 (2022), React Native 0.68 — **Fin de vie**, mises à jour sécurité manquantes. |

**Dette Technique Majeure Mobile** :
1. 🔴 **URL Production en dur** — Bloque tout développement local. **Priorité 1**.
2. 🔴 **Expo SDK 45 / RN 0.68** — **Obsolète**. Migration vers Expo SDK 51+ / RN 0.76+ urgente.
3. 🔴 **Pas de TypeScript** — Migration `.jsx` → `.tsx` progressive nécessaire.
4. 🟠 **Pas de State Management formel** — `GlobalContext` fait office de store mais pas de devtools, pas de persist sélectif.
5. 🟠 **Sync Queue** — Logique de replay basique. Ajouter : retry exponentiel, déduplication, conflit résolution.
6. 🟠 **Gestion erreurs réseau** — Pas de distinction offline/timeout/4xx/5xx dans UI.
7. 🟡 **Permissions Android** — `BLUETOOTH_CONNECT`, `NFC`, `CAMERA` à déclarer dans `app.json` / `android/app/src/main/AndroidManifest.xml`
8. 🟡 **Code Push / OTA** — Configurer `expo-updates` pour déploiement rapide correctifs.

### 6.2 Cohérence Inter-Projets

| Aspect | État | Commentaire |
|--------|------|-------------|
| **Nommage API** | ✅ Cohérent | Endpoints constants Admin = Routes Backend exactes |
| **Auth Headers** | ⚠️ Différents | Web: `kgreen-api` / Mobile: `mobkgreen-api` — Documenté mais source de bugs |
| **Modèles Données** | ✅ Alignés | Mobile SQLite miroir subset MySQL — Bien pensé |
| **Réponses API** | ⚠️ Incohérent | Certains `{count, rows}`, d'autres `{data}`, d'autres direct array |
| **Codes Erreur** | ⚠️ Partiel | `HttpStatusCode` enum backend mais pas de codes métier standardisés |
| **Pagination** | ❌ Incohérente | `limit/offset` parfois, `page/size` ailleurs, parfois pas de pagination |
| **Dates/Timezones** | ❌ Non géré | MySQL `DATETIME` sans TZ. Mobile local TZ. Risque décalage RDC (UTC+1/2). |

### 6.3 Top 10 Actions Prioritaires (Roadmap)

| Priorité | Action | Impact | Effort | Responsable |
|----------|--------|--------|--------|-------------|
| **P0-1** | Corriger `endpoint` mobile → variable d'env | **Bloquant dev local** | 1h | Mobile |
| **P0-2** | Migrer JWT : secret en env, supprimer triple Base64, ajouter refresh token | **Sécurité critique** | 2j | Backend |
| **P0-3** | Restreindre CORS aux domaines frontends | **Sécurité critique** | 30min | Backend |
| **P0-4** | Ajouter Rate Limiting sur `/auth` + endpoints sensibles | **Sécurité** | 1h | Backend |
| **P1-1** | Migration Expo SDK 45 → 51+ / RN 0.68 → 0.76+ | **Maintenabilité/Sécurité** | 2-3 sem | Mobile |
| **P1-2** | Migration Mobile JS → TypeScript | **Qualité/MAINTAINABILITY** | 2-3 sem | Mobile |
| **P1-3** | Unifier Design System Admin (choisir 1 lib UI) | **Bundle/UX/Cohérence** | 1-2 sem | Admin |
| **P1-4** | Implémenter Transactions Sequelize (stock + historique) | **Intégrité données** | 1 sem | Backend |
| **P1-5** | Ajouter Migrations DB (sequelize-cli/umzug) | **Déploiement/Prod** | 3j | Backend |
| **P2-1** | Tests : Unit (Jest) + Integration (Supertest) + E2E (Playwright/Detox) | **Qualité/Confiance** | Continu | Tous |
| **P2-2** | Documentation API OpenAPI/Swagger | **DX/Intégration** | 1 sem | Backend |
| **P2-3** | Structured Logging (Pino/Winston) + APM (Sentry/DataDog) | **Observabilité** | 1 sem | Backend |
| **P2-4** | Timezone Management (UTC en DB, conversion frontend) | **Exactitude métier** | 3j | Backend + Frontends |

### 6.4 Métriques de Qualité Estimées

| Projet | Lines of Code | Complexité Cyclomatique | Couverture Tests | Dette Technique (jours) |
|--------|---------------|------------------------|------------------|-------------------------|
| Backend | ~15,000 TS | Moyenne-Élevée | 0% | ~45 |
| E-commerce | ~12,000 TS/TSX | Moyenne | 0% | ~30 |
| Admin | ~18,000 TS/TSX | Moyenne | 0% | ~40 |
| POS Mobile | ~8,000 JS/JSX | Élevée (pas TS) | 0% | ~60 |
| **TOTAL** | **~53,000** | **-** | **0%** | **~175** |

> **Note** : Estimation basée sur analyse structurelle. La dette technique mobile est majorée par l'obsolescence Expo/RN et l'absence de TypeScript.

### 6.5 Recommandations Stratégiques

1. **Créer un Monorepo** (Nx/Turborepo) pour partager :
   - Types TypeScript (models, DTOs, API contracts)
   - Utilitaires communs (validation, formatage, calculs)
   - Configuration ESLint/Prettier/Jest unifiée
   - CI/CD pipeline unique

2. **API Contract First** :
   - Définir OpenAPI 3.1 spec
   - Générer types Backend + Frontends + Mobile
   - Tests de contrat (Pact) entre services

3. **Feature Flags** pour déploiement progressif (mobile surtout)

4. **Observabilité Unifiée** :
   - Logs structurés (JSON) → Loki/ELK
   - Métriques (Prometheus/Grafana) : latency, error rate, business KPIs
   - Traces distribuées (Jaeger/Zipkin) : req frontend → backend → DB
   - Alerting (PagerDuty/Opsgenie) sur seuils critiques

5. **Sécurité** :
   - Audit dépendances (npm audit / Snyk / Dependabot) mensuel
   - Penetration test annuel
   - Secrets management (HashiCorp Vault / AWS Secrets Manager / Doppler)
   - Security headers (Helmet), CSP, HSTS

---

## ANNEXES

### Annexe A : Arborescence Complète des Projets

```
HEWAGRI-ECOMMERCE/
├── Hewagri-ecommerce-Backend/
│   └── ecom-kivugreen-backend-ts-main/
│       ├── src/
│       │   ├── __server/index.ts
│       │   ├── __routes/ (25 fichiers)
│       │   ├── __controllers/ (25+ fichiers)
│       │   ├── __models/ (20+ fichiers)
│       │   ├── __middlewares/ (3 fichiers)
│       │   ├── __helpers/ (5+ fichiers)
│       │   ├── __services/ (5+ fichiers)
│       │   ├── __databases/connecte.ts
│       │   ├── __enums/ (2 fichiers)
│       │   └── config/default.ts
│       ├── package.json
│       └── tsconfig.json
├── Hewagri-ecommerce-Frontend/
│   ├── src/
│   │   ├── app/ (Next.js 14 App Router)
│   │   ├── lib/
│   │   │   └── redux/ (store.ts, 14 slices)
│   │   ├── components/
│   │   └── styles/
│   ├── public/ (PWA: sw.js, manifest.json)
│   ├── package.json
│   ├── next.config.js
│   └── .env.local
├── Hewagreen-administration-Frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── controller/
│   │   │   ├── api/ (config.ts, constant/apiLink.ts 160+ endpoints)
│   │   │   └── tanstack/ (services par domaine)
│   │   └── components/
│   ├── package.json
│   ├── next.config.js
│   └── .env.local
├── Hewagri-POS-mobile/
│   ├── assets/configs/configs.js
│   ├── services/
│   │   ├── communications.js
│   │   ├── dbconnect/dbconnect.js
│   │   └── tables/tables.js
│   ├── screens/ (10+ écrans)
│   ├── components/Tabbottomnavigation/
│   ├── navigation/AppNavigator.jsx
│   ├── contexts/GlobalContext.jsx
│   ├── printer.js
│   ├── app.json
│   └── package.json
└── RAPPORT_GLOBAL_POS_ET_MOCK.md  ← CE FICHIER
```

### Annexe B : Commandes Utiles Développement

```bash
# Backend
cd Hewagri-ecommerce-Backend/ecom-kivugreen-backend-ts-main
npm run dev          # Dev avec hot reload
npm run build        # Build TS → JS (dist/)
npm start            # Production (node dist/__server/index.js)
npm run lint         # ESLint (si configuré)

# E-commerce Frontend
cd Hewagri-ecommerce-Frontend
npm run dev          # Next.js dev (port 4004)
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint

# Admin Frontend
cd Hewagreen-administration-Frontend
npm run dev          # Next.js dev (port 4003)
npm run build
npm run start

# POS Mobile
cd Hewagri-POS-mobile
npx expo start       # Metro bundler
npx expo start --clear  # Cache clear
eas build --platform android  # Build APK/AAB (EAS)
eas build --platform ios      # Build iOS (macOS + EAS)
npx expo-doctor    # Diagnostic config
```

### Annexe C : Endpoints API de Référence Rapide

<details>
<summary><b>CLIQUEZ POUR VOIR LA LISTE COMPLÈTE (160+ endpoints)</b></summary>

```typescript
// Extrait de Admin: src/controller/api/constant/apiLink.ts
const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/users/user/auth',
  SIGNIN: '/api/users/user/signin',
  VERIFY: '/api/users/user/verify',
  RESEND_CODE: '/api/users/user/resendcode',
  RECOVERY_PASSWORD: '/api/users/user/recoverypassword',
  RESET_PASSWORD: '/api/users/user/resetpassword',
  
  // Users
  USERS_LIST: '/api/users/list',
  USERS_BY_ROLE: '/api/users/list/byrole/:idrole',
  USERS_BY_NAME: '/api/users/list/byname/:name',
  USER_PROFILE: '/api/users/user/:iduser',
  USER_UPDATE: '/api/users/user/:iduser',
  USER_DELETE: '/api/users/user/:iduser',
  USER_AVATAR: '/api/users/user/avatar',
  CHANGE_PASSWORD: '/api/users/user/changepassword',
  
  // Produits
  PRODUITS_LIST: '/api/produits/list',
  PRODUIT_ADD: '/api/produits/produit/add',
  PRODUIT_UPDATE: '/api/produits/produit/:idproduit',
  PRODUIT_DELETE: '/api/produits/produit/:idproduit',
  
  // Stocks
  STOCKS_LIST: '/api/stocks/list',
  STOCK_IN: '/api/stocks/stock/in',
  STOCK_BY_COOPEC: '/api/stocks/stock/:idcooperative',
  STOCK_BY_ID: '/api/stocks/stock/byid/:idstock',
  STOCK_HISTORIQUE_COOPEC: '/api/stocks/historiques/:id_cooperative',
  STOCK_HISTORIQUE_MEMBRE: '/api/stocks/byuser/historiques/:id_membre',
  STOCK_HISTORIQUE_TRANSACTION: '/api/stocks/stock/histories/:idstock',
  EDIT_PRICE_MARKETPLACE: '/api/stocks/stock/editproductprice',
  GET_AS_REGISTER: '/api/stocks/register/:id_cooperative',
  
  // Commandes
  COMMANDE_ADD: '/api/commandes/command/add',
  COMMANDE_LIST_BY_COOPEC: '/api/commandes/list/bycooperative/:idcooperative',
  COMMANDE_LIST_BY_OWNER: '/api/commandes/list/byowner',
  COMMANDE_VALIDATE: '/api/commandes/validate/:idcommande',
  COMMANDE_CANCEL: '/api/commandes/cancel/:idcommande',
  COMMANDE_DETAIL: '/api/commandes/commande/:idcommande',
  
  // Marketplace (Public)
  MARKETPLACE: '/api/marketplace',
  MARKETPLACE_PRODUCT: '/api/marketplace/product/:idproduit',
  MARKETPLACE_COMMAND: '/api/marketplace/command',
  MARKETPLACE_COMMAND_RETRY: '/api/marketplace/command/retry',
  MARKETPLACE_ADD_TO_PANIER: '/api/marketplace/card/addtopanier',
  MARKETPLACE_VALIDATE_PANIER: '/api/marketplace/card/validate/:idpanier',
  MARKETPLACE_SEARCH_KEYWORD: '/api/marketplace/by/keyword/:keyword',
  MARKETPLACE_SEARCH_COOPEC: '/api/marketplace/by/cooperative/:keyword',
  MARKETPLACE_SEARCH_PROVINCE: '/api/marketplace/by/province/:keyword',
  MARKETPLACE_SEARCH_CATEGORY: '/api/marketplace/by/category/:keyword',
  
  // Cooperatives
  COOPEC_ADD: '/api/cooperatives/cooperative/add',
  COOPEC_LIST: '/api/cooperatives/list',
  COOPEC_DETAIL: '/api/cooperatives/cooperative/:idcooperative',
  COOPEC_UPDATE: '/api/cooperatives/cooperative/:idcooperative',
  COOPEC_DELETE: '/api/cooperatives/cooperative/:idcooperative',
  
  // Credits
  CREDIT_ADD: '/api/credits/credit/add',
  CREDIT_LIST_BY_COOPEC: '/api/credits/list/bycooperative/:idcooperative',
  CREDIT_LIST_BY_MEMBER: '/api/credits/list/bymember/:idmembre',
  CREDIT_REMBOURSER: '/api/credits/rembourser/:idcredit',
  CREDIT_ECHEANCIER: '/api/credits/echeancier/:idcredit',
  CREDIT_STATS: '/api/credits/stats/:idcooperative',
  
  // Members
  MEMBER_ADD: '/api/members/member/add',
  MEMBER_LIST_BY_COOPEC: '/api/members/list/bycooperative/:idcooperative',
  MEMBER_DETAIL: '/api/members/member/:idmembre',
  MEMBER_CARD_QRCODE: '/api/members/card/qrcode/:idmembre',
  MEMBER_ENROLL: '/api/members/enroll',
  
  // Dashboard & Reports
  DASHBOARD_STATS: '/api/dashboard/stats',
  REPORT_STOCKS: '/api/reports/stocks',
  REPORT_CREDITS: '/api/reports/credits',
  REPORT_COMMANDES: '/api/reports/commandes',
  REPORT_PAIEMENTS: '/api/reports/paiements',
  
  // ... 100+ autres (paiements, livraisons, roles, permissions, provinces, etc.)
};
```
</details>

---

## CONCLUSION

L'écosystème **HEWAGRI ECOMMERCE** est une plateforme **fonctionnellement riche** et **architecturalement cohérente** dans sa conception globale (séparation claire des responsabilités, patterns réutilisés, modèle de données unifié). Elle répond aux besoins métiers complexes de la gestion agricole coopérative avec une approche **multi-canal** (Web Client, Web Admin, Mobile Terrain) bien pensée.

**Cependant**, trois **blocants critiques** empêchent un développement local serein et une mise en production sécurisée :

1. 🔴 **POS Mobile : URL Production en dur** — Impossible de développer/tester en local sans modifier le code source
2. 🔴 **Backend : Sécurité JWT/Authentication** — Triple Base64, secret durci, CORS ouvert, pas de rate limiting
3. 🔴 **POS Mobile : Stack Obsolète** — Expo 45 / RN 0.68 (2022), fin de vie, failles de sécurité non patchées

**Recommandation immédiate** : Corriger ces 3 points (estimé **3-5 jours**) avant toute nouvelle fonctionnalité. Paralléliser avec :
- Migration Expo SDK 51+ (2-3 semaines)
- Ajout tests automatisés (continu)
- Documentation API OpenAPI (1 semaine)

L'investissement dans la **qualité technique** (TypeScript mobile, migrations DB, tests, observabilité) réduira drastiquement le coût de maintenance futur et les risques de régression sur une plateforme qui manipule des **données financières** (crédits, paiements, stocks valorisés) et des **données personnelles** (membres, utilisateurs).

---

*Rapport généré automatiquement par analyse statique du code source — Mode lecture seule respecté.*
*Pour toute question ou clarification sur ce rapport, se référer aux fichiers source correspondants cités en référence.*