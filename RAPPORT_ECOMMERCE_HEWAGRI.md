# Rapport Technique et Fonctionnel - Projet HewAgri E-Commerce

---

## 1. Vue d'Ensemble & Objectif Métier

### 1.1 Objectif du Projet

**HewAgri** est une plateforme e-commerce complète dédiée au secteur agricole en République Démocratique du Congo (RDC). Elle connecte les producteurs agricoles (coopératives, agriculteurs individuels) aux acheteurs (particuliers, entreprises, banques) pour la vente de produits agricoles.

### 1.2 Utilisateurs Cibles

| Type d'utilisateur | Description |
|---|---|
| **Acheteurs (B2C/B2B)** | Particuliers, restaurants, hôtels, industries agroalimentaires |
| **Producteurs/Vendeurs** | Coopératives agricoles, agriculteurs individuels |
| **Administrateurs** | Gestion de la plateforme, modération, statistiques |
| **Banques/Institutions financières** | Suivi des crédits agricoles, financement des coopératives |

### 1.3 Fonctionnalités E-Commerce Principales

#### **Catalogue Produits**
- Navigation par catégories, sous-catégories, coopératives
- Filtrage avancé (prix, catégorie, coopérative, recherche textuelle)
- Affichage grille/liste avec pagination responsive
- Détail produit : images, prix (HT/TTC), TVA, unité de mesure, stock, description, coopérative productrice

#### **Panier & Commandes**
- Panier persistant (localStorage + Redux Persist)
- Gestion quantités (incrément/décrément, saisie directe)
- Multi-devises (CDF - Franc Congolais / USD - Dollar US) avec taux de change configurable
- Choix méthode de livraison (types configurables : retrait, livraison standard, express, etc.)
- Calcul frais de livraison dynamiques

#### **Paiements (Mobile Money)**
- Intégration opérateurs locaux : **Airtel Money, M-Pesa, Orange Money, Africell**
- Processus en 3 étapes : confirmation téléphone → récapitulatif commande → saisie PIN
- Support paiement via numéro tiers
- Retry paiement en cas d'échec

#### **Comptes Utilisateurs**
- Inscription multi-étapes (infos personnelles → sécurité)
- Vérification par code SMS/OTP
- Authentification téléphone/email + mot de passe
- Réinitialisation mot de passe par code
- Profil utilisateur (avatar, infos, historique commandes)
- Rôles : Admin, Banque, Agriculteur, Client

#### **Administration (Back-Office)**
- Dashboard statistiques (utilisateurs, produits, commandes, coopératives, banques, CA)
- Gestion commandes par états (payées, en cours, livrées, annulées, non payées)
- Gestion stocks & approvisionnements
- Gestion crédits agricoles (par coopérative, membre, statut)
- Gestion utilisateurs & rôles
- Configuration : catégories, sous-catégories, unités de mesure, types livraison, taux de change, commissions
- Carrousels marketing
- Rapports & exports (PDF via jsPDF)

---

## 2. Stack Technique & Dépendances

### 2.1 Frontend Client (Hewagri-ecommerce-Frontend)

| Catégorie | Technologies |
|---|---|
| **Framework** | Next.js 14.2.5 (App Router, React 18) |
| **Language** | TypeScript 5.x |
| **Styling** | Tailwind CSS 3.4.7, PostCSS, Autoprefixer |
| **UI Components** | @nextui-org/react 2.4.6, @headlessui/react 2.1.2, @heroicons/react 2.1.5, react-icons 5.2.1 |
| **State Management** | Redux Toolkit 2.2.7, React-Redux 9.1.2, Redux Persist 6.0.0 |
| **Data Fetching** | Axios 1.7.4 (intercepteurs, auth header automatique) |
| **Animations** | Framer Motion 11.3.24 |
| **Forms/Validation** | Composants custom (TextInput, TextSelect) |
| **Notifications** | React Toastify 10.0.5, SweetAlert2 11.14.0 |
| **PWA/Offline** | @ducanh2912/next-pwa 10.2.8 (Workbox, Service Workers) |
| **Internationalisation** | Google Translate Widget + next-themes 0.3.0 (dark/light) |
| **Autres** | Swiper 11.1.9 (carrousels), React QR Code 2.0.15, React To Print 2.15.1 |

**Scripts disponibles :**
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start -p 4004",
  "lint": "next lint"
}
```

### 2.2 Frontend Administration (Hewagreen-administration-Frontend)

| Catégorie | Technologies |
|---|---|
| **Framework** | Next.js 14.2.2 (App Router, React 18) |
| **Language** | TypeScript 5.x |
| **Styling** | Tailwind CSS 3.4.1, tailwindcss-animate |
| **UI Components** | **Ant Design 5.16.4** (principal), @mui/material 5.15.15 (charts), @nextui-org/react, @radix-ui/* (primitives), shadcn/ui pattern (class-variance-authority, clsx, tailwind-merge) |
| **Charts/Visualization** | @mui/x-charts 7.3.0, Recharts 2.12.6 |
| **State/Server State** | React Query (TanStack Query) 3.39.3, React Hook Form 7.51.3 + @hookform/resolvers + Zod 3.23.0 |
| **Data Fetching** | Axios 1.6.8 (config centralisée, intercepteurs token) |
| **Auth/Session** | js-cookie 3.0.5, localStorage, Cookies (7 jours) |
| **Forms/Inputs** | React Phone Input 2, Input OTP, Cmdk (command palette) |
| **Date/Time** | date-fns 3.6.0, dayjs 1.11.11, moment 2.30.1, react-day-picker 8.10.1 |
| **Export/PDF** | jsPDF 2.5.1 + jspdf-autotable 3.8.2 |
| **Autres** | Embla Carousel, Vaul (drawers), Sonner (toasts), Lucide React, nextjs-toploader |

**Scripts disponibles :**
```json
{
  "dev": "next dev -p 4003",
  "build": "next build",
  "start": "next start -p 4003",
  "lint": "next lint"
}
```

### 2.3 Backend (Non fourni - Déduit des appels API)

D'après les endpoints appelés, le backend expose une API REST sous la forme :
- **Base URLs** : `https://ecomv2.kivugreen.cd` (prod), `https://ecom-test.kivugreen.cd` (test)
- **Authentification** : Header custom `x-ecommerce-kgreen-api: Bearer <token>`
- **Format** : JSON avec structure `{ status, message, data }`
- **Endpoints principaux** : `/api/users/*`, `/api/marketplace/*`, `/api/commandes/*`, `/api/produits/*`, `/api/cooperatives/*`, `/api/stocks/*`, `/api/credits/*`, `/api/banks/*`, `/api/statistiques/*`, `/api/configurations/*`, `/api/services/*`

---

## 3. Architecture & Structure des Dossiers

### 3.1 Architecture Globale

```
HEWAGRI-ECOMMERCE/
├── Hewagri-ecommerce-Frontend/     # Application client (acheteurs)
│   ├── public/                     # Assets statiques, manifest PWA, SW
│   └── src/
│       ├── app/                    # Next.js App Router (pages, layouts)
│       │   ├── (auth)/            # Routes groupées auth (login, register, reset, validation)
│       │   ├── cart/              # Panier
│       │   ├── orders/            # Commandes (liste + détail)
│       │   ├── produits/[id]/     # Détail produit
│       │   ├── shop/              # Catalogue (marketplace)
│       │   ├── services/          # Page services
│       │   ├── contact/           # Contact
│       │   ├── actions.ts         # Server Actions (push notifications - commenté)
│       │   ├── layout.tsx         # Root layout (providers)
│       │   └── page.tsx           # Accueil
│       ├── components/
│       │   ├── layout/            # Navbar, Footer, ProfileButton, CurrencySwitcher, LanguageSwitcher, Modal
│       │   ├── Home/              # Hero, Filtres (Catégories, Coopératives, Provinces)
│       │   ├── Cart/              # CartSummary, ShoppingCardList
│       │   ├── Shop/              # Page boutique
│       │   ├── SingleProduct/     # Détail produit
│       │   ├── Login/Register/ResetPassword/Validate/  # Auth forms
│       │   └── shared/            # ProductCard, ListProductCard, CustomImage, EmptyData, Error, SearchInput, SocialIcons, ThemeSwitch
│       ├── context/               # React Context (AuthWrapper, ThemeProvider, ToastProvider)
│       ├── lib/
│       │   ├── redux/             # Store, slices (auth, cart, products, categories, filter, currency, orders, etc.)
│       │   ├── hook.ts            # Typed useDispatch/useSelector
│       │   └── useLanguageSwitcher.ts
│       ├── constants/             # baseUrl, MARKETPLACE_URL
│       ├── data/                  # Produits mock, logos
│       ├── utils/                 # formatMoney, formatPhoneNumber, formatNumberWithSpaces
│       └── styles/                # globals.css
├── Hewagreen-administration-Frontend/  # Application admin
│   ├── public/
│   └── src/
│       ├── app/
│       │   ├── (app)/             # Routes protégées admin
│       │   │   ├── dashboard/     # Tableau de bord
│       │   │   ├── commande/      # Gestion commandes (tabs par état)
│       │   │   ├── agriculteurs/  # Gestion agriculteurs
│       │   │   ├── cooperative/   # Coopératives
│       │   │   ├── produit/       # Produits
│       │   │   ├── stock/         # Stocks & historique
│       │   │   ├── credit/        # Crédits agricoles
│       │   │   ├── creditbank/    # Crédits vue banque
│       │   │   ├── parameters/    # Configuration (catégories, taux, livraison, etc.)
│       │   │   ├── payment/       # Paiements
│       │   │   ├── historique*    # Historiques ventes/appro
│       │   │   ├── profil/        # Profil admin
│       │   │   ├── layout.tsx     # Layout admin (MainAppLayout)
│       │   │   └── page.tsx       # Login (tabs Admin/Banque)
│       ├── components/
│       │   ├── config/            # site.ts
│       │   ├── dashboard/         # Dashboard, charts, cards
│       │   ├── global/            # loader, lazy
│       │   ├── ui/                # toaster, shadcn components
│       │   └── images/
│       ├── controller/
│       │   ├── api/               # config (axios), constant (apiLink endpoints)
│       │   ├── tanstack/          # Services React Query (dashboard, commande, etc.)
│       │   └── hooks/             # useAuth, authToken
│       ├── layouts/               # MainAppLayout, AppLayout, Panel, AntdLayout, MenuItems
│       └── types/                 # Types TypeScript complets (index.d.ts)
└── Hewagri-ecommerce-Backend.zip   # Backend (non extrait)
```

### 3.2 Patterns Architecturaux Identifiés

| Pattern | Implémentation |
|---|---|
| **App Router (Next.js 14)** | Route groups `(auth)`, `(app)`, layouts imbriqués, dynamic routes `[id]` |
| **Client/Server Components** | `"use client"` directive sur composants interactifs ; Server Components par défaut |
| **Redux Toolkit + RTK Query-like** | Slices avec `createAsyncThunk` pour data fetching, `redux-persist` pour hydration |
| **React Query (TanStack)** | Admin : `useQuery`/`useMutation` pour server state, cache, invalidation |
| **Context API** | Providers globaux : Auth, Theme, Toast, Modal |
| **Compound Components** | Filter (CategoriesFilter + CooperativesFilter), ProductCard/ListProductCard |
| **Custom Hooks** | `useAppDispatch`, `useAppSelector`, `useLanguageSwitcher`, `useToast`, `useModal`, `useAuth` |
| **Atomic Design** | shared (atoms), Home/Cart/Shop (molecules), Pages (organisms/templates) |
| **Type-Safe API** | Types TypeScript complets mirrors backend response structures |

---

## 4. Modèle de Données & Flux Principaux

### 4.1 Entités Principales (d'après types TypeScript)

```typescript
// Utilisateur
User {
  id, nom, postnom, prenom, phone, email, avatar
  date_naiss, sexe, hectare_cultive
  uuid, isvalidated, roles[], province, territoire, village
}

// Produit
Produit {
  id, tva, produit (nom), image, description
  id_unity, id_category, id_souscategory
  prix_unitaire, prix_plus_commission, currency, qte, qte_critique
  cooperative, category, souscategory, unite_mesure
}

// Coopérative
Cooperative {
  id, sigle, cooperative (nom), logo, description
  adresse, phone, email, num_enregistrement
  isformel, id_category, id_province, id_territoire
  responsable, adjoint, membres[]
}

// Commande
Commande {
  id, transaction, id_produit, qte, id_unity, id_cooperative
  prix_total, prix_unit, currency, payament_phone
  type_livraison, shipped_to, description
  is_pending, state (0-4), createdby, createdAt
  produit, type_livraison, unite, user
}

// Stock
Stock {
  id, id_cooperative, transaction, description
  date_production, date_expiration, createdby
  produits[] (avec qte, prix, tva, membre)
  cooperative, mouvements[]
}

// Crédit
Credit {
  id, id_cooperative, id_user, montant, currency
  motif, status, periode_remboursement
  cooperative, user, bank
}

// Configuration
TauxChange { taux_change, commission_price }
TypeLivraison { type, description, lieux, frais_livraison }
Category/SousCategory/UniteMesure/Role
```

### 4.2 Flux Clés Bout en Bout

#### **Flux 1 : Inscription & Vérification Utilisateur**
```
1. GET /register → Formulaire multi-étapes (Infos personnelles → Sécurité)
2. POST /api/users/user/signup → { token, user, expires_in }
3. Stockage localStorage (token, user, tokenExpiration)
4. Redirection /validation
5. PUT /api/users/user/verify { id_user, verification_code }
6. Succès → Redirection /shop + nettoyage localStorage phone
```

#### **Flux 2 : Connexion**
```
1. GET /login → Formulaire phone/email + password
2. POST /api/users/user/signin → { token, user, expires_in }
3. Header axios défaut `x-ecommerce-kgreen-api: Bearer <token>`
4. Redirection / (ou page précédente)
5. AuthWrapper vérifie token au montage (checkAuthStatus)
```

#### **Flux 3 : Ajout au Panier → Commande → Paiement**
```
1. Produit page → dispatch(addItemWithQuantity({ item, quantity }))
2. CartSlice : update localStorage + Redux state
3. /cart → CartSummary affiche récapitulatif
4. Sélection méthode livraison (fetchLivraisons)
5. Clic "Passer à la caisse" → Modal 3 étapes :
   Étape 1: Choix téléphone paiement (utilisateur ou tiers)
   Étape 2: Récapitulatif (sous-total, TVA, frais, total, devise)
   Étape 3: Confirmation PIN mobile money
6. POST /api/marketplace/command { items[], shipped_to, payment_phone, currency, type_livraison }
7. Succès → clearCart(), redirect /orders
8. Échec → retryOrder (POST /api/marketplace/command/retry)
```

#### **Flux 4 : Administration - Gestion Commandes**
```
1. Login Admin/Banque → token stocké (localStorage + cookies 7j)
2. /dashboard → _dashboard(token) → stats globales
3. /commande → Tabs par état :
   - _commandes() : toutes
   - _commandesParState*() : par état (0=annulée, 1=payée, 2=en cours, 3=livrée, 4=non payée)
   - _commandesParCooperative(), _commandesParCooperativeEtat()
4. Actions : validateCommande (PUT), deleteCommande (DELETE)
```

#### **Flux 5 : Gestion Stocks & Approvisionnements**
```
1. /stock → liste stocks (getStocks)
2. /stock/tout → tout stock par coopérative
3. POST /api/stocks/stock/in → entrée stock (items: produit, qte, prix, currency)
4. Historique : /api/stocks/stock/histories/{idstock}
5. Mouvements : entrées/sorties avec traçabilité membre/coopérative
```

---

## 5. Configuration & Déploiement

### 5.1 Variables d'Environnement

#### **Client (Hewagri-ecommerce-Frontend)**
```env
# .env.local (non commit)
NEXT_PUBLIC_API_URL=https://ecomv2.kivugreen.cd    # API Production
# ou
NEXT_PUBLIC_API_URL=https://ecom-test.kivugreen.cd  # API Test

# Google Translate (injecté via next.config.mjs)
GOOGLE_TRANSLATION_CONFIG={"languages":[{"title":"Français","name":"fr"},{"title":"English","name":"en"},{"title":"Swahili","name":"sw"},{"title":"Lingala","name":"ln"}],"defaultLanguage":"fr"}

# Push Notifications (commenté dans actions.ts)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
```

#### **Admin (Hewagreen-administration-Frontend)**
```env
# .env
NEXT_PUBLIC_BASE_URL=https://ecomv2.kivugreen.cd
NEXT_PUBLIC_BASE_URL_TEST=https://ecom-test.kivugreen.cd
```

### 5.2 Configuration Next.js

**Client (`next.config.mjs`) :**
- PWA activé (Workbox, cache 25MB, navigation offline)
- Images : domaines autorisés `ecom-test.kivugreen.cd`, `ecomv2.kivugreen.cd`, `kivugreen.cd`
- Headers sécurité : `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`
- Service Worker `/sw1.js` avec CSP strict

**Admin (`next.config.mjs`) :**
- Images : domaines `ecomv2.kivugreen.cd`, `ecom-test.kivugreen.cd`

### 5.3 Lancement & Déploiement

```bash
# Client
cd Hewagri-ecommerce-Frontend
npm install
npm run dev      # http://localhost:3000 (dev)
npm run build    # Build production
npm start        # Port 4004 (prod)

# Admin
cd Hewagreen-administration-Frontend
npm install
npm run dev      # http://localhost:4003 (dev)
npm run build
npm start        # Port 4003 (prod)
```

### 5.4 Déploiement Cible
- **Vercel** (recommandé par Next.js) ou conteneurs Docker
- Ports : Client 4004, Admin 4003
- PWA : manifest.json + Service Workers pour installation mobile
- HTTPS requis pour Mobile Money & Push Notifications

---

## 6. Qualité du Code & Pistes d'Amélioration

### 6.1 Points Forts

| Aspect | Détails |
|---|---|
| **Architecture modulaire** | Séparation claire Client/Admin, slices Redux par domaine, services TanStack Query organisés |
| **Type Safety** | Types TypeScript exhaustifs (`index.d.ts` admin > 1450 lignes) mirrorant l'API |
| **State Management** | Redux Toolkit + Persist côté client ; React Query + Cache côté admin |
| **UX/UI** | Tailwind + composants modernes (NextUI, AntD, Radix), animations Framer Motion, PWA ready |
| **Internationalisation** | 4 langues (FR/EN/SW/LN) via Google Translate + cookie-based language switcher |
| **Multi-devises** | CDF/USD avec taux configurable depuis API (`/api/configurations/get`) |
| **Mobile Money** | Intégration 4 opérateurs RDC, flux 3 étapes sécurisé |
| **Admin complet** | Dashboard temps réel, gestion fine commandes/stocks/crédits, exports PDF |
| **Sécurité headers** | CSP, X-Frame-Options, Referrer-Policy configurés |
| **Error Handling** | Toast notifications, Error boundaries implicites, loading skeletons |

### 6.2 Dette Technique & Axes d'Amélioration

#### **Critique (Sécurité/Robustesse)**
| Problème | Impact | Recommandation |
|---|---|---|
| **Tokens en localStorage** | Vulnérable XSS | Migrer vers httpOnly cookies + refresh token rotation |
| **Pas de validation schéma API** | Erreurs runtime silencieuses | Ajouter Zod/Valibot pour valider réponses API |
| **Auth header hardcodé** (`x-ecommerce-kgreen-api`) | Couplage fort | Abstraction via intercepteur Axios centralisé |
| **Pas de rate limiting client** | Risque spam API | Debounce sur recherche, retry avec backoff exponentiel |
| **Secrets dans code commenté** (actions.ts) | Fuite potentielle | Nettoyer, utiliser `.env` uniquement |

#### **Architecture & Maintenabilité**
| Problème | Impact | Recommandation |
|---|---|---|
| **Duplication types** (Client vs Admin) | Incohérence possible | Package partagé `@hewagri/types` ou générer depuis OpenAPI |
| **Redux + React Query coexistants** | Complexité inutile | Unifier : React Query partout (supporte persistence) |
| **Gros fichier `index.d.ts`** (1450+ lignes) | Maintenance difficile | Split par domaine : `user.ts`, `product.ts`, `order.ts`, etc. |
| **Pas de tests** | Régressions non détectées | Ajouter Jest + React Testing Library (unit) + Playwright (E2E) |
| **Composants "use client" excessifs** | Bundle size, hydration | Maximiser Server Components, minimiser client boundary |

#### **Performance**
| Problème | Impact | Recommandation |
|---|---|---|
| **fetchProducts(page_size=100)** | Sur-charge initiale | Pagination côté serveur, infinite scroll |
| **Images sans optimisation format** | Poids excessif | Utiliser `next/image` avec WebP/AVIF, placeholder blur |
| **Pas de code splitting par route** | JS initial lourd | `dynamic()` import pour pages lourdes (dashboard, charts) |
| **Redux persist tout le state** | Hydration lente | Persister seulement `cart`, `auth`, `currency` |

#### **Fonctionnel Manquant**
| Fonctionnalité | Priorité |
|---|---|
| **Historique commandes client** (existe mais basique) | Haute - Ajouter filtres, réimpression, retour |
| **Wishlist/Favoris** | Moyenne - UI prête (HeartIcon commenté) |
| **Avis/Notation produits** | Moyenne - Rating affiché mais pas éditable |
| **Notifications push réelles** | Haute - Code commenté, infrastructure manquante |
| **Recherche full-text / autocomplete** | Moyenne - Actuellement filtre client-side seulement |
| **Tableau de bord vendeur (coopérative)** | Haute - Côté admin seulement |
| **Webhooks paiement (callback Mobile Money)** | Critique - Reconciliation auto paiements |
| **Logs/Monitoring (Sentry, Datadog)** | Haute - Aucune visibilité production |
| **CI/CD (GitHub Actions, tests auto)** | Haute - Aucun pipeline visible |

#### **Accessibilité & SEO**
- Manque labels `aria-*` sur certains composants interactifs
- Meta tags SEO basiques seulement (pas de structured data produits)
- Pas de sitemap.xml / robots.txt généré

### 6.3 Plan d'Action Priorisé

| Sprint | Focus | Livrables |
|---|---|---|
| **1** | Sécurité & Fiabilité | httpOnly cookies, validation Zod, nettoyage secrets, error boundaries |
| **2** | Performance & Tests | Pagination API, next/image optimisé, Jest+Playwright setup, CI/CD |
| **3** | Fonctionnel Core | Webhooks paiement, dashboard vendeur, wishlist, avis produits |
| **4** | DX & Monitoring | Shared types package, Sentry, logging structuré, documentation API |
| **5** | Polish | SEO/Accessibilité, PWA enhancements, i18n messages (pas seulement Google Translate) |

---

## Annexe : Endpoints API Principaux (Référence)

| Domaine | Endpoints Clés |
|---|---|
| **Auth** | `POST /api/users/user/signup`, `POST /api/users/user/signin`, `PUT /api/users/user/verify`, `PUT /api/users/user/resendcode`, `PUT /api/users/user/resetpassword`, `PUT /api/users/user/recoverypassword` |
| **Marketplace** | `GET /api/marketplace?page_size=100`, `GET /api/marketplace/product/{id}`, `POST /api/marketplace/command`, `POST /api/marketplace/command/retry` |
| **Commandes** | `GET /api/commandes/list/byowner/`, `GET /api/commandes/list/bytransaction/{id}`, `GET /api/commandes/list/bystate/{state}`, `GET /api/commandes/list/bycooperative/{id}`, `PUT /api/commandes/commande/validate/{id}`, `DELETE /api/marketplace/card/validate/{id}` |
| **Produits/Catalogue** | `GET /api/categories/list`, `GET /api/souscategories/list`, `GET /api/produits/list`, `GET /api/cooperatives/list`, `GET /api/unities/list`, `GET /api/typeslivraisons/list` |
| **Géo** | `GET /api/provinces/list`, `GET /api/territoires/list`, `GET /api/villages/list` |
| **Stocks** | `GET /api/stocks/list`, `GET /api/stocks/stock/{idCoop}`, `GET /api/stocks/stock/histories/{id}`, `POST /api/stocks/stock/in` |
| **Crédits** | `GET /api/credits/list`, `GET /api/credits/bystatus/{status}`, `GET /api/credits/bycooperative/{id}/{status}`, `GET /api/credits/bymember/{id}/{status}` |
| **Banques** | `GET /api/banks/list`, `POST /api/banks/bank/add` |
| **Stats** | `GET /api/statistiques/stat/dashboard`, `GET /api/statistiques/ventes/bycooperative/{id}`, `GET /api/statistiques/ventes/bymember/{id}`, `GET /api/statistiques/approvionnements/bymember/{id}` |
| **Config** | `GET /api/configurations/get` (taux_change, commission_price) |
| **Services** | `GET /api/services/carousels`, CRUD carrousels |

---

*Rapport généré le 2026-11-19 - Analyse statique du code source (lecture seule)*