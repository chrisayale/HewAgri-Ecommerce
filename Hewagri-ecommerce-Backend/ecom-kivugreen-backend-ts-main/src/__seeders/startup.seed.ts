import { connect } from '../__databases/connecte';
import { Users } from '../__models/model.users';
import { Roles } from '../__models/model.roles';
import { Hasroles } from '../__models/model.hasroles';
import { Cooperatives } from '../__models/model.cooperatives';
import { Extras } from '../__models/model.extras';
import { Hasmembers } from '../__models/model.hasmembers';
import { Categoriescooperatives } from '../__models/model.categscooperatives';
import { Banks } from '../__models/model.banks';
import { Categories } from '../__models/model.categories';
import { Souscategories } from '../__models/model.souscategories';
import { Produits } from '../__models/model.produits';
import { Unites } from '../__models/model.unitemesures';
import { hashPWD } from '../__helpers/helper.passwords';
import { fillphone } from '../__helpers/helper.fillphone';
import { randomLongNumber } from '../__helpers/helper.random';
import dotenv from 'dotenv';
import { ICooperative } from '../__enums/enum.interfacemodels';
import { Op } from 'sequelize';

// Helper to ensure phone numbers have +243 prefix (for display/env config)
const ensurePlus243 = (phone: string): string => {
    let formatted = phone.trim();
    formatted = formatted.replace(/[\s\-\(\)]/g, '');
    if (!formatted.startsWith('+243')) {
        if (formatted.startsWith('0')) {
            formatted = '+243' + formatted.substring(1);
        } else if (formatted.startsWith('243')) {
            formatted = '+' + formatted;
        } else {
            formatted = '+243' + formatted;
        }
    }
    return formatted;
};

// Helper to format phone for database storage (uses existing fillphone logic)
const formatPhoneForStorage = (phone: string): string => fillphone({ phone: ensurePlus243(phone) });

dotenv.config();

// Type for seed configuration
interface SeedUserConfig {
    nom: string;
    postnom: string;
    prenom: string;
    email: string;
    phone: string;
    password: string;
    roleIds: number[];
    isvalidated: number;
    sexe: 'M' | 'F';
    isCoopResponsable?: boolean;
}

interface SeedCoopConfig {
    cooperative: string;
    sigle: string;
    phone: string;
    email: string;
    adresse: string;
    num_enregistrement: string;
    description: string;
    isformel: number;
    id_responsable?: number;
    logo?: string;
    file: string;
    id_territoire?: number;
    id_province?: number;
    coordonnees_gps?: string;
    id_adjoint?: number;
    id_category?: number;
}

interface SeedCoopCategoryConfig {
    category: string;
    description: string;
}

interface SeedBankConfig {
    bank: string;
    email: string;
    phone: string;
    description: string;
    id_responsable: number;
    createdby?: number;
}

interface SeedUnityConfig {
    unity: string;
    description: string;
    equival_kgs: number;
}

interface SeedCategoryConfig {
    category: string;
    description: string;
}

interface SeedSousCategoryConfig {
    souscategory: string;
    id_category: number;
    description: string;
}

interface SeedProductConfig {
    produit: string;
    image: string;
    id_unity: number;
    id_category: number;
    id_souscategory?: number;
    description: string;
    tva: number;
    createdby?: number;
}

// Helper to ensure phone numbers have +243 prefix
const formatPhone = (phone: string): string => {
    let formatted = phone.trim();
    // Remove any spaces, dashes, or special characters
    formatted = formatted.replace(/[\s\-\(\)]/g, '');
    // If it doesn't start with +243, add it
    if (!formatted.startsWith('+243')) {
        // If it starts with 0, replace with +243
        if (formatted.startsWith('0')) {
            formatted = '+243' + formatted.substring(1);
        } else if (formatted.startsWith('243')) {
            formatted = '+' + formatted;
        } else {
            formatted = '+243' + formatted;
        }
    }
    return formatted;
};

// Helper to check if we're in development
const isDevelopment = process.env.NODE_ENV !== 'production';

// Logging helper
const logSeed = (message: string, data?: any) => {
    if (isDevelopment) {
        console.log(`[Startup Seed] ${message}`, data ? JSON.stringify(data, null, 2) : '');
    }
};

const logSeedError = (message: string, error: any) => {
    console.error(`[Startup Seed ERROR] ${message}`, error?.message || error);
    if (error?.errors) {
        console.error('[Startup Seed ERROR] Validation errors:', JSON.stringify(error.errors, null, 2));
    }
    if (error?.stack) {
        console.error('[Startup Seed ERROR] Stack:', error.stack);
    }
};

/**
 * Idempotent startup seed routine
 * Runs after DB connection is established
 * Uses findOrCreate / upsert patterns to avoid duplicates
 */
export async function runStartupSeed(): Promise<void> {
    if (!isDevelopment) {
        logSeed('Skipping startup seed in production environment');
        return;
    }

    logSeed('Starting idempotent startup seed routine...');

    try {
        // Ensure DB connection
        await connect.authenticate();
        logSeed('Database connection verified');

        // 1. Seed Cooperative Categories (idempotent)
        await seedCoopCategories();

        // 2. Seed Roles (idempotent)
        await seedRoles();

        // 3. Seed Cooperative (idempotent)
        const cooperative = await seedCooperative();

        // 4. Seed Users (idempotent)
        const users = await seedUsers(cooperative);

        // 5. Link cooperative to responsible user
        if (cooperative && users.coopAdmin) {
            await linkCooperativeToAdmin(cooperative.id, users.coopAdmin.id);
        }

        // 6. Create Hasmembers for coop admin
        if (cooperative && users.coopAdmin) {
            await seedHasmember(users.coopAdmin.id, cooperative.id);
        }

        // 7. Seed 10 Cooperatives across categories & formalization statuses
        await seedCooperatives();

        // 8. Seed 10 E-commerce Customer Accounts
        await seedEcommerceCustomers();

        // 9. Seed 10 Delivery Driver Accounts
        await seedDeliveryDrivers();

        // 10. Seed 10 Bank Accounts
        await seedBankAccounts();

        // 11. Seed Units of Measure (Unites)
        await seedUnites();

        // 12. Seed Agricultural Product Categories
        await seedProductCategories();

        // 13. Seed Agricultural Product Subcategories
        await seedProductSousCategories();

        // 14. Seed Agricultural Products with Images
        await seedProducts();

        logSeed('✅ Startup seed routine completed successfully');
    } catch (error) {
        logSeedError('Startup seed routine failed', error);
        // Don't throw - allow app to continue even if seed fails
        // This prevents crashes in existing valid setups
    }
}

/**
 * Seed cooperative categories (idempotent)
 */
async function seedCoopCategories(): Promise<void> {
    const categories: SeedCoopCategoryConfig[] = [
        {
            category: 'Petite coopérative (OP 2-100 membres)',
            description: 'Coopérative de petite taille avec 2 à 100 membres (OP)'
        },
        {
            category: 'Moyenne coopérative (UOP 101-1000 membres)',
            description: 'Coopérative de taille moyenne avec 101 à 1000 membres (UOP)'
        },
        {
            category: 'Grande coopérative (UOP 1001 et plus)',
            description: 'Grande coopérative avec 1001 membres et plus (UOP)'
        },
    ];

    for (const catData of categories) {
        const [category, created] = await Categoriescooperatives.findOrCreate({
            where: { category: catData.category },
            defaults: catData,
        });

        if (created) {
            logSeed(`Created cooperative category: ${category.category} (id: ${category.id})`);
        } else if (isDevelopment) {
            logSeed(`Cooperative category already exists: ${category.category} (id: ${category.id})`);
        }
    }
}

/**
 * Seed default roles (idempotent)
 */
async function seedRoles(): Promise<void> {
    const defaultRoles = [
        { id: 1, role: 'super_admin', description: 'Platform super administrator' },
        { id: 2, role: 'admin', description: 'Administrator' },
        { id: 3, role: 'manager', description: 'Manager' },
        { id: 4, role: 'agent', description: 'Agent / Livreur' },
        { id: 5, role: 'client', description: 'E-commerce client' },
    ];

    for (const roleData of defaultRoles) {
        const [role, created] = await Roles.findOrCreate({
            where: { id: roleData.id },
            defaults: roleData,
        });

        if (created) {
            logSeed(`Created role: ${role.role} (id: ${role.id})`);
        } else if (isDevelopment) {
            logSeed(`Role already exists: ${role.role} (id: ${role.id})`);
        }
    }
}

/**
 * Seed platform cooperative (idempotent)
 */
async function seedCooperative(): Promise<any> {
    // Get category IDs for linking
    const smallCat = await Categoriescooperatives.findOne({ where: { category: 'Petite coopérative (OP 2-100 membres)' } });
    const defaultCategoryId = smallCat?.id;

    const coopPhone = formatPhoneForStorage(process.env.SEED_COOP_PHONE || '+243810000105');

    const [coop, created] = await Cooperatives.findOrCreate({
        where: { sigle: process.env.SEED_COOP_SIGLE || 'KVG-PLAT' },
        defaults: {
            cooperative: process.env.SEED_COOP_NAME || 'Coopérative KivuGreen Platform',
            sigle: process.env.SEED_COOP_SIGLE || 'KVG-PLAT',
            phone: coopPhone,
            email: process.env.SEED_COOP_EMAIL || 'platform@kivugreen.cd',
            adresse: process.env.SEED_COOP_ADRESSE || 'Plateforme KivuGreen, Kinshasa',
            num_enregistrement: process.env.SEED_COOP_NUM_ENREG || 'RG-2024-PLAT-001',
            description: process.env.SEED_COOP_DESCRIPTION || 'Coopérative de la plateforme KivuGreen',
            isformel: 1,
            logo: "",
            file: "",
            id_territoire: undefined,
            id_province: undefined,
            coordonnees_gps: undefined,
            id_adjoint: undefined,
            id_responsable: undefined,
            id_category: defaultCategoryId,
        },
    });

    if (created) {
        logSeed(`Created cooperative: ${coop.cooperative} (id: ${coop.id}) with phone: ${coopPhone}`);
    } else if (isDevelopment) {
        logSeed(`Cooperative already exists: ${coop.cooperative} (id: ${coop.id})`);
    }

    return coop;
}

// Default seed configuration (configurable via env) - all phones with +243 prefix
const DEFAULT_SEED_USERS: SeedUserConfig[] = [
    {
        nom: process.env.SEED_PLATFORM_ADMIN_NOM || 'Platform',
        postnom: process.env.SEED_PLATFORM_ADMIN_POSTNOM || 'Admin',
        prenom: process.env.SEED_PLATFORM_ADMIN_PRENOM || 'Super',
        email: process.env.SEED_PLATFORM_ADMIN_EMAIL || 'platform-admin@kivugreen.cd',
        phone: ensurePlus243(process.env.SEED_PLATFORM_ADMIN_PHONE || '+243810000101'),
        password: process.env.SEED_PLATFORM_ADMIN_PASSWORD || 'PlatformAdmin2024!',
        roleIds: [1], // super_admin
        isvalidated: 1,
        sexe: 'M',
    },
    {
        nom: process.env.SEED_ECOMMERCE_CLIENT_NOM || 'Client',
        postnom: process.env.SEED_ECOMMERCE_CLIENT_POSTNOM || 'Ecommerce',
        prenom: process.env.SEED_ECOMMERCE_CLIENT_PRENOM || 'Test',
        email: process.env.SEED_ECOMMERCE_CLIENT_EMAIL || 'client@kivugreen.cd',
        phone: ensurePlus243(process.env.SEED_ECOMMERCE_CLIENT_PHONE || '+243810000102'),
        password: process.env.SEED_ECOMMERCE_CLIENT_PASSWORD || 'ClientEcom2024!',
        roleIds: [5], // client
        isvalidated: 1,
        sexe: 'M',
    },
    {
        nom: process.env.SEED_COOP_ADMIN_NOM || 'Coop',
        postnom: process.env.SEED_COOP_ADMIN_POSTNOM || 'Admin',
        prenom: process.env.SEED_COOP_ADMIN_PRENOM || 'Marie',
        email: process.env.SEED_COOP_ADMIN_EMAIL || 'coop-admin@kivugreen.cd',
        phone: ensurePlus243(process.env.SEED_COOP_ADMIN_PHONE || '+243810000103'),
        password: process.env.SEED_COOP_ADMIN_PASSWORD || 'CoopAdmin2024!',
        roleIds: [1, 3], // super_admin + manager
        isvalidated: 1,
        sexe: 'F',
    },
    {
        nom: process.env.SEED_LIVREUR_NOM || 'Livreur',
        postnom: process.env.SEED_LIVREUR_POSTNOM || 'Test',
        prenom: process.env.SEED_LIVREUR_PRENOM || 'Pierre',
        email: process.env.SEED_LIVREUR_EMAIL || 'livreur@kivugreen.cd',
        phone: ensurePlus243(process.env.SEED_LIVREUR_PHONE || '+243810000104'),
        password: process.env.SEED_LIVREUR_PASSWORD || 'Livreur2024!',
        roleIds: [4], // agent (livreur role)
        isvalidated: 1,
        sexe: 'M',
    },
];

/**
 * Seed default users (idempotent)
 */
async function seedUsers(cooperative: any): Promise<{
    platformAdmin: any;
    ecommerceClient: any;
    coopAdmin: any;
    livreur: any;
}> {
    const coopId: number | null = cooperative?.id ?? null;
    const results: any = {};

    for (const userConfig of DEFAULT_SEED_USERS) {
        // Use fillphone for storage format (matches login controller)
        const storagePhone = formatPhoneForStorage(userConfig.phone);
        const hashedPassword = await hashPWD({ plaintext: userConfig.password });

        // Prepare user data (no idcooperative - cooperative membership is via Hasmembers)
        const userData = {
            nom: userConfig.nom,
            postnom: userConfig.postnom,
            prenom: userConfig.prenom,
            email: userConfig.email,
            phone: storagePhone,
            password: hashedPassword,
            isvalidated: userConfig.isvalidated,
            uuid: `seed-${userConfig.roleIds[0]}-${Date.now()}`,
            sexe: userConfig.sexe,
        };

        // Find user by email first (since email is also unique), then by phone
        let user = await Users.findOne({ where: { email: userConfig.email } });
        let created = false;

        if (!user) {
            user = await Users.findOne({ where: { phone: storagePhone } });
        }

        if (!user) {
            // Create new user
            user = await Users.create(userData);
            created = true;
            logSeed(`Created user: ${userConfig.email} (${storagePhone})`);
        } else {
            logSeed(`User already exists: ${userConfig.email} (${storagePhone})`);
            // Update password and phone if needed (for dev convenience)
            if (isDevelopment) {
                const updates: any = {};
                if (user.password !== hashedPassword) {
                    updates.password = hashedPassword;
                }
                if (user.phone !== storagePhone) {
                    updates.phone = storagePhone;
                }
                if (Object.keys(updates).length > 0) {
                    try {
                        await user.update(updates);
                        logSeed(`Updated user: ${userConfig.email}`);
                    } catch (updateError: any) {
                        // If phone update fails due to unique constraint, just update password
                        if (updateError.name === 'SequelizeUniqueConstraintError' && updates.phone) {
                            delete updates.phone;
                            await user.update(updates);
                            logSeed(`Updated user password only (phone conflict): ${userConfig.email}`);
                        } else {
                            throw updateError;
                        }
                    }
                }
            }
        }

        const userId: number = user.id!;

        // Assign roles (idempotent)
        for (let i = 0; i < userConfig.roleIds.length; i++) {
            const rid: number = userConfig.roleIds[i]!;
            const whereClause = { TblEcomUserId: userId, TblEcomRoleId: rid };
            const defaultsClause = { TblEcomUserId: userId, TblEcomRoleId: rid };
            await Hasroles.findOrCreate({
                where: whereClause,
                defaults: defaultsClause,
            });
        }

        // Create Extras record (idempotent)
        await Extras.findOrCreate({
            where: { id_user: user.id },
            defaults: {
                id_user: user.id,
                verification: '123456',
                lastlogin: undefined,
            },
        });

        // Store references for later linking
        if (userConfig.roleIds.includes(1) && userConfig.email === DEFAULT_SEED_USERS[0].email) {
            results.platformAdmin = user;
        } else if (userConfig.roleIds.includes(5) && userConfig.email === DEFAULT_SEED_USERS[1].email) {
            results.ecommerceClient = user;
        } else if (userConfig.roleIds.includes(1) && userConfig.email === DEFAULT_SEED_USERS[2].email) {
            results.coopAdmin = user;
        } else if (userConfig.roleIds.includes(4) && userConfig.email === DEFAULT_SEED_USERS[3].email) {
            results.livreur = user;
        }
    }

    // Log credentials in development mode for easy testing
    if (isDevelopment) {
        console.log('\n===========================================');
        console.log('🔐 SEEDED ACCOUNT CREDENTIALS (DEV MODE)');
        console.log('===========================================');
        DEFAULT_SEED_USERS.forEach((user, index) => {
            const roles = user.roleIds.map(r => {
                const roleNames: Record<number, string> = { 1: 'super_admin', 2: 'admin', 3: 'manager', 4: 'agent', 5: 'client' };
                return roleNames[r] || `role_${r}`;
            }).join(', ');
            console.log(`\n${index + 1}. ${user.prenom} ${user.nom} (${roles})`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Phone: ${formatPhone(user.phone)}`);
            console.log(`   Password: ${user.password}`);
        });
        // Log cooperative credentials
        console.log(`\n5. Cooperative Account`);
        console.log(`   Name: ${process.env.SEED_COOP_NAME || 'Coopérative KivuGreen Platform'}`);
        console.log(`   Sigle: ${process.env.SEED_COOP_SIGLE || 'KVG-PLAT'}`);
        console.log(`   Email: ${process.env.SEED_COOP_EMAIL || 'platform@kivugreen.cd'}`);
        console.log(`   Phone: ${formatPhone(process.env.SEED_COOP_PHONE || '+243810000105')}`);
        console.log('\n===========================================\n');
    }

    return results;
}

/**
 * Seed 10 cooperatives across all 3 categories and formalization statuses
 */
async function seedCooperatives(): Promise<void> {
    logSeed('Seeding 10 cooperatives across categories and formalization statuses...');

    // Get all categories
    const categories = await Categoriescooperatives.findAll();
    const categoryMap = new Map(categories.map(c => [c.category, c.id]));

    const smallCatId = categoryMap.get('Petite coopérative (OP 2-100 membres)');
    const mediumCatId = categoryMap.get('Moyenne coopérative (UOP 101-1000 membres)');
    const largeCatId = categoryMap.get('Grande coopérative (UOP 1001 et plus)');

    // 5 Formelle (isformel=1), 5 Informelle (isformel=0)
    // Distributed across 3 categories
    const cooperatives: SeedCoopConfig[] = [
        // Petite - Formelle (2)
        {
            cooperative: 'Coopérative Agricole Kivu Nord',
            sigle: 'CAKN',
            phone: formatPhoneForStorage('+243810000201'),
            email: 'cakn@kivugreen.cd',
            adresse: 'Beni, Nord-Kivu',
            num_enregistrement: 'RG-2024-CAKN-001',
            description: 'Coopérative agricole de Beni - café et cacao',
            isformel: 1,
            id_category: smallCatId,
            file: '',
            logo: '',
        },
        {
            cooperative: 'Union Paysanne de Rutshuru',
            sigle: 'UPR',
            phone: formatPhoneForStorage('+243810000202'),
            email: 'upr@kivugreen.cd',
            adresse: 'Rutshuru, Nord-Kivu',
            num_enregistrement: 'RG-2024-UPR-002',
            description: 'Union paysanne produisant maïs et haricots',
            isformel: 1,
            id_category: smallCatId,
            file: '',
            logo: '',
        },
        // Moyenne - Formelle (2)
        {
            cooperative: 'Coopérative Café Kivu Central',
            sigle: 'CCKC',
            phone: formatPhoneForStorage('+243810000203'),
            email: 'cckc@kivugreen.cd',
            adresse: 'Goma, Nord-Kivu',
            num_enregistrement: 'RG-2024-CCKC-003',
            description: 'Coopérative caféière exportatrice',
            isformel: 1,
            id_category: mediumCatId,
            file: '',
            logo: '',
        },
        {
            cooperative: 'Fédération des Producteurs de l\'Est',
            sigle: 'FPE',
            phone: formatPhoneForStorage('+243810000204'),
            email: 'fpe@kivugreen.cd',
            adresse: 'Butembo, Nord-Kivu',
            num_enregistrement: 'RG-2024-FPE-004',
            description: 'Fédération regroupant plusieurs UOP',
            isformel: 1,
            id_category: mediumCatId,
            file: '',
            logo: '',
        },
        // Grande - Formelle (1)
        {
            cooperative: 'Coopérative Géante KivuGreen Export',
            sigle: 'CGKE',
            phone: formatPhoneForStorage('+243810000205'),
            email: 'cgke@kivugreen.cd',
            adresse: 'Kinshasa, Gombe',
            num_enregistrement: 'RG-2024-CGKE-005',
            description: 'Grande coopérative d\'exportation multi-produits',
            isformel: 1,
            id_category: largeCatId,
            file: '',
            logo: '',
        },
        // Petite - Informelle (2)
        {
            cooperative: 'Groupement Paysan de Masisi',
            sigle: 'GPM',
            phone: formatPhoneForStorage('+243810000206'),
            email: 'gpm@kivugreen.cd',
            adresse: 'Masisi, Nord-Kivu',
            num_enregistrement: 'INF-2024-GPM-001',
            description: 'Groupement informel de petits producteurs',
            isformel: 0,
            id_category: smallCatId,
            file: '',
            logo: '',
        },
        {
            cooperative: 'Association des Cultivateurs de Walikale',
            sigle: 'ACW',
            phone: formatPhoneForStorage('+243810000207'),
            email: 'acw@kivugreen.cd',
            adresse: 'Walikale, Nord-Kivu',
            num_enregistrement: 'INF-2024-ACW-002',
            description: 'Association informelle pour l\'entraide agricole',
            isformel: 0,
            id_category: smallCatId,
            file: '',
            logo: '',
        },
        // Moyenne - Informelle (2)
        {
            cooperative: 'Collectif Agricole du Sud-Kivu',
            sigle: 'CAS',
            phone: formatPhoneForStorage('+243810000208'),
            email: 'cas@kivugreen.cd',
            adresse: 'Bukavu, Sud-Kivu',
            num_enregistrement: 'INF-2024-CAS-003',
            description: 'Collectif informel de producteurs du Sud-Kivu',
            isformel: 0,
            id_category: mediumCatId,
            file: '',
            logo: '',
        },
        {
            cooperative: 'Réseau Producteurs Maniema',
            sigle: 'RPM',
            phone: formatPhoneForStorage('+243810000209'),
            email: 'rpm@kivugreen.cd',
            adresse: 'Kindu, Maniema',
            num_enregistrement: 'INF-2024-RPM-004',
            description: 'Réseau informel de producteurs de Maniema',
            isformel: 0,
            id_category: mediumCatId,
            file: '',
            logo: '',
        },
        // Grande - Informelle (1)
        {
            cooperative: 'Grande Alliance Paysanne Informelle',
            sigle: 'GAPI',
            phone: formatPhoneForStorage('+243810000210'),
            email: 'gapi@kivugreen.cd',
            adresse: 'Kisangani, Tshopo',
            num_enregistrement: 'INF-2024-GAPI-005',
            description: 'Grande alliance informelle inter-provinciale',
            isformel: 0,
            id_category: largeCatId,
            file: '',
            logo: '',
        },
    ];

    for (const coopData of cooperatives) {
        // Use sigle + cooperative as unique constraint (per model indexes)
        const [coop, created] = await Cooperatives.findOrCreate({
            where: {
                sigle: coopData.sigle,
                cooperative: coopData.cooperative
            },
            defaults: coopData,
        });

        if (created) {
            logSeed(`Created cooperative: ${coop.cooperative} (${coop.sigle}) - ${coop.isformel ? 'Formelle' : 'Informelle'} - Cat: ${coop.id_category}`);
        } else if (isDevelopment) {
            logSeed(`Cooperative already exists: ${coop.cooperative} (${coop.sigle})`);
        }
    }
}

/**
 * Seed 10 E-commerce Customer Accounts with various validation states
 */
async function seedEcommerceCustomers(): Promise<void> {
    logSeed('Seeding 10 e-commerce customer accounts...');

    const clientPassword = 'ClientEcom2024!';
    const hashedPassword = await hashPWD({ plaintext: clientPassword });

    // isvalidated states: 0=unverified/pending, 1=verified/active, 2=suspended, 3=blocked
    const customers = [
        // Active/Verified (isvalidated=1)
        { nom: 'Client', postnom: 'Actif', prenom: 'Un', email: 'client1@kivugreen.cd', phone: ensurePlus243('+243810000301'), isvalidated: 1, sexe: 'M' as const },
        { nom: 'Client', postnom: 'Actif', prenom: 'Deux', email: 'client2@kivugreen.cd', phone: ensurePlus243('+243810000302'), isvalidated: 1, sexe: 'F' as const },
        { nom: 'Client', postnom: 'Actif', prenom: 'Trois', email: 'client3@kivugreen.cd', phone: ensurePlus243('+243810000303'), isvalidated: 1, sexe: 'M' as const },
        // Pending/Unverified (isvalidated=0)
        { nom: 'Client', postnom: 'EnAttente', prenom: 'Quatre', email: 'client4@kivugreen.cd', phone: ensurePlus243('+243810000304'), isvalidated: 0, sexe: 'F' as const },
        { nom: 'Client', postnom: 'EnAttente', prenom: 'Cinq', email: 'client5@kivugreen.cd', phone: ensurePlus243('+243810000305'), isvalidated: 0, sexe: 'M' as const },
        // Verified but different state indicator
        { nom: 'Client', postnom: 'Verifie', prenom: 'Six', email: 'client6@kivugreen.cd', phone: ensurePlus243('+243810000306'), isvalidated: 1, sexe: 'F' as const },
        { nom: 'Client', postnom: 'Verifie', prenom: 'Sept', email: 'client7@kivugreen.cd', phone: ensurePlus243('+243810000307'), isvalidated: 1, sexe: 'M' as const },
        // Suspended (isvalidated=2)
        { nom: 'Client', postnom: 'Suspendu', prenom: 'Huit', email: 'client8@kivugreen.cd', phone: ensurePlus243('+243810000308'), isvalidated: 2, sexe: 'F' as const },
        // Blocked (isvalidated=3)
        { nom: 'Client', postnom: 'Bloque', prenom: 'Neuf', email: 'client9@kivugreen.cd', phone: ensurePlus243('+243810000309'), isvalidated: 3, sexe: 'M' as const },
        // Another active
        { nom: 'Client', postnom: 'Actif', prenom: 'Dix', email: 'client10@kivugreen.cd', phone: ensurePlus243('+243810000310'), isvalidated: 1, sexe: 'F' as const },
    ];

    for (let i = 0; i < customers.length; i++) {
        const cust = customers[i];
        const storagePhone = formatPhoneForStorage(cust.phone);

        let user = await Users.findOne({ where: { email: cust.email } });
        let created = false;

        if (!user) {
            user = await Users.findOne({ where: { phone: storagePhone } });
        }

        if (!user) {
            user = await Users.create({
                nom: cust.nom,
                postnom: cust.postnom,
                prenom: cust.prenom,
                email: cust.email,
                phone: storagePhone,
                password: hashedPassword,
                isvalidated: cust.isvalidated,
                uuid: `seed-client-${i + 1}-${Date.now()}`,
                sexe: cust.sexe,
            });
            created = true;
            logSeed(`Created e-commerce client: ${cust.email} (${cust.isvalidated === 1 ? 'Active' : cust.isvalidated === 0 ? 'Pending' : cust.isvalidated === 2 ? 'Suspended' : 'Blocked'})`);
        } else {
            logSeed(`E-commerce client already exists: ${cust.email}`);
            if (isDevelopment) {
                const updates: any = {};
                if (user.password !== hashedPassword) updates.password = hashedPassword;
                if (user.phone !== storagePhone) updates.phone = storagePhone;
                if (Object.keys(updates).length > 0) {
                    try {
                        await user.update(updates);
                    } catch (updateError: any) {
                        if (updateError.name === 'SequelizeUniqueConstraintError' && updates.phone) {
                            delete updates.phone;
                            await user.update(updates);
                        }
                    }
                }
            }
        }

        const userId: number = user.id!;

        // Assign client role (idempotent)
        await Hasroles.findOrCreate({
            where: { TblEcomUserId: userId, TblEcomRoleId: 5 },
            defaults: { TblEcomUserId: userId, TblEcomRoleId: 5 },
        });

        // Create Extras record
        await Extras.findOrCreate({
            where: { id_user: user.id },
            defaults: { id_user: user.id, verification: '123456', lastlogin: undefined },
        });
    }

    if (isDevelopment) {
        console.log('\n===========================================');
        console.log('🛒 E-COMMERCE CLIENT CREDENTIALS (DEV MODE)');
        console.log('===========================================');
        customers.forEach((cust, index) => {
            const state = cust.isvalidated === 1 ? 'Active' : cust.isvalidated === 0 ? 'Pending/Unverified' : cust.isvalidated === 2 ? 'Suspended' : 'Blocked';
            console.log(`${index + 1}. ${cust.prenom} ${cust.nom} [${state}]`);
            console.log(`   Email: ${cust.email}`);
            console.log(`   Phone: ${formatPhone(cust.phone)}`);
            console.log(`   Password: ${clientPassword}`);
        });
        console.log('===========================================\n');
    }
}

/**
 * Seed 10 Delivery Driver (Agent/Livreur) Accounts with various states
 */
async function seedDeliveryDrivers(): Promise<void> {
    logSeed('Seeding 10 delivery driver (livreur) accounts...');

    const driverPassword = 'Livreur2024!';
    const hashedPassword = await hashPWD({ plaintext: driverPassword });

    // isvalidated states for drivers: 0=pending, 1=active/available, 2=busy/on-delivery, 3=suspended, 4=inactive/offline
    const drivers = [
        // Active/Available (isvalidated=1)
        { nom: 'Livreur', postnom: 'Dispo', prenom: 'Un', email: 'livreur1@kivugreen.cd', phone: ensurePlus243('+243810000401'), isvalidated: 1, sexe: 'M' as const },
        { nom: 'Livreur', postnom: 'Dispo', prenom: 'Deux', email: 'livreur2@kivugreen.cd', phone: ensurePlus243('+243810000402'), isvalidated: 1, sexe: 'M' as const },
        { nom: 'Livreur', postnom: 'Dispo', prenom: 'Trois', email: 'livreur3@kivugreen.cd', phone: ensurePlus243('+243810000403'), isvalidated: 1, sexe: 'F' as const },
        // Pending approval (isvalidated=0)
        { nom: 'Livreur', postnom: 'EnAttente', prenom: 'Quatre', email: 'livreur4@kivugreen.cd', phone: ensurePlus243('+243810000404'), isvalidated: 0, sexe: 'M' as const },
        { nom: 'Livreur', postnom: 'EnAttente', prenom: 'Cinq', email: 'livreur5@kivugreen.cd', phone: ensurePlus243('+243810000405'), isvalidated: 0, sexe: 'F' as const },
        // On delivery/busy (isvalidated=2)
        { nom: 'Livreur', postnom: 'EnCours', prenom: 'Six', email: 'livreur6@kivugreen.cd', phone: ensurePlus243('+243810000406'), isvalidated: 2, sexe: 'M' as const },
        { nom: 'Livreur', postnom: 'EnCours', prenom: 'Sept', email: 'livreur7@kivugreen.cd', phone: ensurePlus243('+243810000407'), isvalidated: 2, sexe: 'F' as const },
        // Suspended (isvalidated=3)
        { nom: 'Livreur', postnom: 'Suspendu', prenom: 'Huit', email: 'livreur8@kivugreen.cd', phone: ensurePlus243('+243810000408'), isvalidated: 3, sexe: 'M' as const },
        // Inactive/Offline (isvalidated=4)
        { nom: 'Livreur', postnom: 'Inactif', prenom: 'Neuf', email: 'livreur9@kivugreen.cd', phone: ensurePlus243('+243810000409'), isvalidated: 4, sexe: 'F' as const },
        // Another active
        { nom: 'Livreur', postnom: 'Dispo', prenom: 'Dix', email: 'livreur10@kivugreen.cd', phone: ensurePlus243('+243810000410'), isvalidated: 1, sexe: 'M' as const },
    ];

    for (let i = 0; i < drivers.length; i++) {
        const drv = drivers[i];
        const storagePhone = formatPhoneForStorage(drv.phone);

        let user = await Users.findOne({ where: { email: drv.email } });
        let created = false;

        if (!user) {
            user = await Users.findOne({ where: { phone: storagePhone } });
        }

        if (!user) {
            user = await Users.create({
                nom: drv.nom,
                postnom: drv.postnom,
                prenom: drv.prenom,
                email: drv.email,
                phone: storagePhone,
                password: hashedPassword,
                isvalidated: drv.isvalidated,
                uuid: `seed-driver-${i + 1}-${Date.now()}`,
                sexe: drv.sexe,
            });
            created = true;
            const stateLabel = drv.isvalidated === 1 ? 'Active/Available' : drv.isvalidated === 0 ? 'Pending' : drv.isvalidated === 2 ? 'On Delivery' : drv.isvalidated === 3 ? 'Suspended' : 'Inactive';
            logSeed(`Created delivery driver: ${drv.email} (${stateLabel})`);
        } else {
            logSeed(`Delivery driver already exists: ${drv.email}`);
            if (isDevelopment) {
                const updates: any = {};
                if (user.password !== hashedPassword) updates.password = hashedPassword;
                if (user.phone !== storagePhone) updates.phone = storagePhone;
                if (Object.keys(updates).length > 0) {
                    try {
                        await user.update(updates);
                    } catch (updateError: any) {
                        if (updateError.name === 'SequelizeUniqueConstraintError' && updates.phone) {
                            delete updates.phone;
                            await user.update(updates);
                        }
                    }
                }
            }
        }

        const userId: number = user.id!;

        // Assign agent role (idempotent)
        await Hasroles.findOrCreate({
            where: { TblEcomUserId: userId, TblEcomRoleId: 4 },
            defaults: { TblEcomUserId: userId, TblEcomRoleId: 4 },
        });

        // Create Extras record
        await Extras.findOrCreate({
            where: { id_user: user.id },
            defaults: { id_user: user.id, verification: '123456', lastlogin: undefined },
        });
    }

    if (isDevelopment) {
        console.log('\n===========================================');
        console.log('🚚 DELIVERY DRIVER CREDENTIALS (DEV MODE)');
        console.log('===========================================');
        drivers.forEach((drv, index) => {
            const state = drv.isvalidated === 1 ? 'Active/Available' : drv.isvalidated === 0 ? 'Pending' : drv.isvalidated === 2 ? 'On Delivery' : drv.isvalidated === 3 ? 'Suspended' : 'Inactive/Offline';
            console.log(`${index + 1}. ${drv.prenom} ${drv.nom} [${state}]`);
            console.log(`   Email: ${drv.email}`);
            console.log(`   Phone: ${formatPhone(drv.phone)}`);
            console.log(`   Password: ${driverPassword}`);
        });
        console.log('===========================================\n');
    }
}

/**
 * Seed 10 Bank Accounts across various states
 * Banks model has unique constraints on: email, phone, bank name
 * id_responsable references Users table (foreign key)
 */
async function seedBankAccounts(): Promise<void> {
    logSeed('Seeding 10 bank accounts...');

    // Get some users to link as responsables (must be valid user IDs)
    const users = await Users.findAll({ limit: 5 });

    const banks: SeedBankConfig[] = [
        // Active/Verified banks (normal operation)
        {
            bank: 'Rawbank',
            email: 'rawbank@kivugreen.cd',
            phone: formatPhoneForStorage('+243810000501'),
            description: 'Rawbank - Banque principale RDC',
            id_responsable: users[0]?.id || null,
            createdby: users[0]?.id || null,
        },
        {
            bank: 'Banque Commerciale du Congo (BCDC)',
            email: 'bcdc@kivugreen.cd',
            phone: formatPhoneForStorage('+243810000502'),
            description: 'BCDC - Grande banque commerciale',
            id_responsable: users[1]?.id || null,
            createdby: users[1]?.id || null,
        },
        {
            bank: 'Equity Bank Congo',
            email: 'equity@kivugreen.cd',
            phone: formatPhoneForStorage('+243810000503'),
            description: 'Equity Bank - Services bancaires inclusifs',
            id_responsable: users[2]?.id || null,
            createdby: users[2]?.id || null,
        },
        {
            bank: 'Standard Bank RDC',
            email: 'standard@kivugreen.cd',
            phone: formatPhoneForStorage('+243810000504'),
            description: 'Standard Bank - Banque internationale',
            id_responsable: users[3]?.id || null,
            createdby: users[3]?.id || null,
        },
        {
            bank: 'Banque Postale du Congo',
            email: 'postale@kivugreen.cd',
            phone: formatPhoneForStorage('+243810000505'),
            description: 'Banque Postale - Services postaux et bancaires',
            id_responsable: users[4]?.id || null,
            createdby: users[4]?.id || null,
        },
        // Pending verification banks
        {
            bank: 'AfriLand First Bank',
            email: 'afriland@kivugreen.cd',
            phone: formatPhoneForStorage('+243810000506'),
            description: 'AfriLand First Bank - En attente validation',
            id_responsable: users[0]?.id || null,
            createdby: users[0]?.id || null,
        },
        {
            bank: 'Banque de l\'Habitat du Congo (BHC)',
            email: 'bhc@kivugreen.cd',
            phone: formatPhoneForStorage('+243810000507'),
            description: 'BHC - Banque habitat, pending',
            id_responsable: users[1]?.id || null,
            createdby: users[1]?.id || null,
        },
        // Suspended/Inactive banks
        {
            bank: 'Banque Centrale du Congo (BCC) - Test',
            email: 'bcc-test@kivugreen.cd',
            phone: formatPhoneForStorage('+243810000508'),
            description: 'BCC Test - Suspendu pour tests',
            id_responsable: users[2]?.id || null,
            createdby: users[2]?.id || null,
        },
        {
            bank: 'Citibank RDC - Legacy',
            email: 'citi-legacy@kivugreen.cd',
            phone: formatPhoneForStorage('+243810000509'),
            description: 'Citibank Legacy - Compte inactif',
            id_responsable: users[3]?.id || null,
            createdby: users[3]?.id || null,
        },
        // Another active bank
        {
            bank: 'Société Générale Congo',
            email: 'sogec@kivugreen.cd',
            phone: formatPhoneForStorage('+243810000510'),
            description: 'Société Générale - Banque active',
            id_responsable: users[4]?.id || null,
            createdby: users[4]?.id || null,
        },
    ];

    for (let i = 0; i < banks.length; i++) {
        const bankData = banks[i];

        // Banks has unique constraints on email, phone, AND bank name
        // So we need to check all three
        let bank = await Banks.findOne({ where: { email: bankData.email } });
        if (!bank) bank = await Banks.findOne({ where: { phone: bankData.phone } });
        if (!bank) bank = await Banks.findOne({ where: { bank: bankData.bank } });

        let created = false;
        if (!bank) {
            // Only include id_responsable and createdby if they have valid values
            const createData: any = {
                bank: bankData.bank,
                email: bankData.email,
                phone: bankData.phone,
                description: bankData.description,
            };
            if (bankData.id_responsable) {
                createData.id_responsable = bankData.id_responsable;
            }
            if (bankData.createdby) {
                createData.createdby = bankData.createdby;
            }

            bank = await Banks.create(createData);
            created = true;
            logSeed(`Created bank: ${bankData.bank} (${bankData.email})`);
        } else {
            logSeed(`Bank already exists: ${bankData.bank} (${bankData.email})`);
        }
    }

    if (isDevelopment) {
        console.log('\n===========================================');
        console.log('🏦 BANK ACCOUNTS (DEV MODE)');
        console.log('===========================================');
        banks.forEach((bank, index) => {
            console.log(`${index + 1}. ${bank.bank}`);
            console.log(`   Email: ${bank.email}`);
            console.log(`   Phone: ${formatPhone(bank.phone)}`);
            console.log(`   Responsable ID: ${bank.id_responsable}`);
        });
        console.log('===========================================\n');
    }
}

/**
 * Seed Units of Measure (Unites)
 */
async function seedUnites(): Promise<void> {
    logSeed('Seeding units of measure...');

    const unites: SeedUnityConfig[] = [
        { unity: 'kg', description: 'Kilogramme', equival_kgs: 1 },
        { unity: 'g', description: 'Gramme', equival_kgs: 0.001 },
        { unity: 't', description: 'Tonne', equival_kgs: 1000 },
        { unity: 'sac', description: 'Sac (50kg)', equival_kgs: 50 },
        { unity: 'sac_100', description: 'Sac (100kg)', equival_kgs: 100 },
        { unity: 'litre', description: 'Litre', equival_kgs: 1 },
        { unity: 'ml', description: 'Millilitre', equival_kgs: 0.001 },
        { unity: 'piece', description: 'Pièce', equival_kgs: 1 },
        { unity: 'dizaine', description: 'Dizaine (10 pièces)', equival_kgs: 10 },
        { unity: 'centaine', description: 'Centaine (100 pièces)', equival_kgs: 100 },
    ];

    for (const unityData of unites) {
        const [unity, created] = await Unites.findOrCreate({
            where: { unity: unityData.unity },
            defaults: unityData,
        });

        if (created) {
            logSeed(`Created unit: ${unity.unity} (${unity.equival_kgs} kg equiv)`);
        } else if (isDevelopment) {
            logSeed(`Unit already exists: ${unity.unity}`);
        }
    }
}

/**
 * Seed Agricultural Product Categories (Categories)
 */
async function seedProductCategories(): Promise<void> {
    logSeed('Seeding agricultural product categories...');

    const categories: SeedCategoryConfig[] = [
        {
            category: 'Céréales',
            description: 'Maïs, Riz, Sorgho, Blé, Mil, Fonio'
        },
        {
            category: 'Légumineuses & Oléagineux',
            description: 'Haricot, Soja, Arachide, Niébé, Lentille, Pois chiche'
        },
        {
            category: 'Tubercules & Racines',
            description: 'Manioc, Pomme de terre, Patate douce, Igname, Taro, Carotte'
        },
        {
            category: 'Fruits',
            description: 'Banane, Ananas, Mangue, Avocat, Papaye, Agrumes, Fruit de la passion'
        },
        {
            category: 'Légumes & Maraîchage',
            description: 'Tomate, Chou, Oignon, Amarante (Lengalenga), Courge, Poivron, Aubergine, Concombre'
        },
        {
            category: 'Cultures de rente & Café/Cacao',
            description: 'Café Arabica, Café Robusta, Cacao, Thé, Vanille, Quinquina, Coton'
        },
        {
            category: 'Épices & Condiments',
            description: 'Gingembre, Piment, Ail, Curcuma, Cannelle, Clou de girofle, Poivre'
        },
        {
            category: 'Produits transformés & Farines',
            description: 'Farine de manioc, Farine de maïs, Huile de palme, Miel, Confitures, Jus de fruits'
        },
    ];

    for (const catData of categories) {
        const [category, created] = await Categories.findOrCreate({
            where: { category: catData.category },
            defaults: catData,
        });

        if (created) {
            logSeed(`Created product category: ${category.category} (id: ${category.id})`);
        } else if (isDevelopment) {
            logSeed(`Product category already exists: ${category.category} (id: ${category.id})`);
        }
    }
}

/**
 * Seed Agricultural Product Subcategories (Souscategories)
 */
async function seedProductSousCategories(): Promise<void> {
    logSeed('Seeding agricultural product subcategories...');

    // Get category IDs
    const categories = await Categories.findAll();
    const categoryMap = new Map(categories.map(c => [c.category, c.id]));

    const cerealesId = categoryMap.get('Céréales');
    const legumineusesId = categoryMap.get('Légumineuses & Oléagineux');
    const tuberculesId = categoryMap.get('Tubercules & Racines');
    const fruitsId = categoryMap.get('Fruits');
    const legumesId = categoryMap.get('Légumes & Maraîchage');
    const culturesRenteId = categoryMap.get('Cultures de rente & Café/Cacao');
    const epicesId = categoryMap.get('Épices & Condiments');
    const transformesId = categoryMap.get('Produits transformés & Farines');

    const sousCategories: SeedSousCategoryConfig[] = [
        // Céréales
        { souscategory: 'Maïs', id_category: cerealesId!, description: 'Maïs grain, maïs blanc, maïs jaune' },
        { souscategory: 'Riz', id_category: cerealesId!, description: 'Riz paddy, riz blanc, riz parfumé' },
        { souscategory: 'Sorgho', id_category: cerealesId!, description: 'Sorgho blanc, sorgho rouge' },
        { souscategory: 'Blé', id_category: cerealesId!, description: 'Blé tendre, blé dur' },
        { souscategory: 'Mil', id_category: cerealesId!, description: 'Mil perle, mil rouge' },
        { souscategory: 'Fonio', id_category: cerealesId!, description: 'Fonio blanc, fonio noir' },

        // Légumineuses & Oléagineux
        { souscategory: 'Haricot', id_category: legumineusesId!, description: 'Haricot rouge, haricot blanc, haricot noir' },
        { souscategory: 'Soja', id_category: legumineusesId!, description: 'Graines de soja, soja jaune' },
        { souscategory: 'Arachide', id_category: legumineusesId!, description: 'Arachide décortiquée, arachide en coque' },
        { souscategory: 'Niébé', id_category: legumineusesId!, description: 'Niébé (haricot à œil noir)' },
        { souscategory: 'Lentille', id_category: legumineusesId!, description: 'Lentille verte, lentille corail' },
        { souscategory: 'Pois chiche', id_category: legumineusesId!, description: 'Pois chiche (chiche)' },

        // Tubercules & Racines
        { souscategory: 'Manioc', id_category: tuberculesId!, description: 'Manioc doux, manioc amer, racines fraîches' },
        { souscategory: 'Pomme de terre', id_category: tuberculesId!, description: 'Pomme de terre de table, pomme de terre de semence' },
        { souscategory: 'Patate douce', id_category: tuberculesId!, description: 'Patate douce à chair blanche, orange, pourpre' },
        { souscategory: 'Igname', id_category: tuberculesId!, description: 'Igname blanche, igname jaune, igname d\'eau' },
        { souscategory: 'Taro', id_category: tuberculesId!, description: 'Taro (macabo), taro blanc' },
        { souscategory: 'Carotte', id_category: tuberculesId!, description: 'Carotte orange, carotte violette' },

        // Fruits
        { souscategory: 'Banane', id_category: fruitsId!, description: 'Banane plantain, banane douce, banane dessert' },
        { souscategory: 'Ananas', id_category: fruitsId!, description: 'Ananas Cayenne, ananas Victoria, ananas Sugarloaf' },
        { souscategory: 'Mangue', id_category: fruitsId!, description: 'Mangue Kent, mangue Keitt, mangue Tommy Atkins' },
        { souscategory: 'Avocat', id_category: fruitsId!, description: 'Avocat Hass, avocat Fuerte, avocat Bacon' },
        { souscategory: 'Papaye', id_category: fruitsId!, description: 'Papaye solo, papaye géante' },
        { souscategory: 'Agrumes', id_category: fruitsId!, description: 'Orange, citron, mandarine, pamplemousse, lime' },
        { souscategory: 'Fruit de la passion', id_category: fruitsId!, description: 'Fruit de la passion jaune, pourpre' },

        // Légumes & Maraîchage
        { souscategory: 'Tomate', id_category: legumesId!, description: 'Tomate ronde, tomate cerise, tomate Roma' },
        { souscategory: 'Chou', id_category: legumesId!, description: 'Chou pommé, chou de Milan, chou chinois' },
        { souscategory: 'Oignon', id_category: legumesId!, description: 'Oignon jaune, oignon rouge, oignon blanc, échalote' },
        { souscategory: 'Amarante (Lengalenga)', id_category: legumesId!, description: 'Amarante verte, amarante rouge' },
        { souscategory: 'Courge', id_category: legumesId!, description: 'Courge butternut, courge musquée, potiron' },
        { souscategory: 'Poivron', id_category: legumesId!, description: 'Poivron vert, rouge, jaune, orange' },
        { souscategory: 'Aubergine', id_category: legumesId!, description: 'Aubergine violette, aubergine blanche, aubergine longue' },
        { souscategory: 'Concombre', id_category: legumesId!, description: 'Concombre hollandais, concombre à cornichons' },

        // Cultures de rente & Café/Cacao
        { souscategory: 'Café Arabica', id_category: culturesRenteId!, description: 'Café Arabica lavé, café Arabica naturel' },
        { souscategory: 'Café Robusta', id_category: culturesRenteId!, description: 'Café Robusta lavé, café Robusta naturel' },
        { souscategory: 'Cacao', id_category: culturesRenteId!, description: 'Fèves de cacao fermentées, cacao séché' },
        { souscategory: 'Thé', id_category: culturesRenteId!, description: 'Thé noir, thé vert, thé blanc' },
        { souscategory: 'Vanille', id_category: culturesRenteId!, description: 'Gousses de vanille noire, vanille rouge' },
        { souscategory: 'Quinquina', id_category: culturesRenteId!, description: 'Écorce de quinquina' },
        { souscategory: 'Coton', id_category: culturesRenteId!, description: 'Coton graine, coton fibre' },

        // Épices & Condiments
        { souscategory: 'Gingembre', id_category: epicesId!, description: 'Gingembre frais, gingembre séché, gingembre en poudre' },
        { souscategory: 'Piment', id_category: epicesId!, description: 'Piment fort, piment doux, piment oiseau' },
        { souscategory: 'Ail', id_category: epicesId!, description: 'Ail blanc, ail violet, ail rose' },
        { souscategory: 'Curcuma', id_category: epicesId!, description: 'Curcuma frais, curcuma en poudre' },
        { souscategory: 'Cannelle', id_category: epicesId!, description: 'Écorce de cannelle, cannelle en poudre' },
        { souscategory: 'Clou de girofle', id_category: epicesId!, description: 'Clous de girofle entiers, moulus' },
        { souscategory: 'Poivre', id_category: epicesId!, description: 'Poivre noir, poivre blanc, poivre vert, poivre rouge' },

        // Produits transformés & Farines
        { souscategory: 'Farine de manioc', id_category: transformesId!, description: 'Farine de manioc (fufu, chikwangue), farine de tapioca' },
        { souscategory: 'Farine de maïs', id_category: transformesId!, description: 'Farine de maïs blanche, farine de maïs jaune' },
        { souscategory: 'Huile de palme', id_category: transformesId!, description: 'Huile de palme rouge, huile de palmiste' },
        { souscategory: 'Miel', id_category: transformesId!, description: 'Miel pur, miel de fleurs, miel de forêt' },
        { souscategory: 'Confitures', id_category: transformesId!, description: 'Confiture de mangue, ananas, fruit de la passion, goyave' },
        { souscategory: 'Jus de fruits', id_category: transformesId!, description: 'Jus de mangue, ananas, fruit de la passion, orange, citron' },
    ];

    for (const scData of sousCategories) {
        const [sousCat, created] = await Souscategories.findOrCreate({
            where: {
                souscategory: scData.souscategory,
                id_category: scData.id_category
            },
            defaults: scData,
        });

        if (created) {
            logSeed(`Created subcategory: ${sousCat.souscategory} (cat: ${sousCat.id_category})`);
        } else if (isDevelopment) {
            logSeed(`Subcategory already exists: ${sousCat.souscategory}`);
        }
    }
}

/**
 * Seed Agricultural Products (Produits) with valid HTTPS image URLs
 */
async function seedProducts(): Promise<void> {
    logSeed('Seeding agricultural products with images...');

    // Get IDs for foreign keys
    const categories = await Categories.findAll();
    const categoryMap = new Map(categories.map(c => [c.category, c.id]));

    const sousCategories = await Souscategories.findAll();
    const sousCatMap = new Map(sousCategories.map(sc => [sc.souscategory, sc.id]));

    const unites = await Unites.findAll();
    const uniteMap = new Map(unites.map(u => [u.unity, u.id]));

    // Get a user to use as creator (platform admin)
    const adminUser = await Users.findOne({ where: { email: 'platform-admin@kivugreen.cd' } });
    const createdById = adminUser?.id || 1;

    // Reliable Unsplash image URLs with proper parameters for hotlinking
    const imageBaseUrl = 'https://images.unsplash.com/photo-';

    const products: SeedProductConfig[] = [
        // CÉRÉALES
        {
            produit: 'Maïs grain blanc',
            image: `${imageBaseUrl}1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80`,
            id_unity: uniteMap.get('kg')!,
            id_category: categoryMap.get('Céréales')!,
            id_souscategory: sousCatMap.get('Maïs'),
            description: 'Maïs grain blanc de qualité supérieure, idéal pour la farine et l\'alimentation animale',
            tva: 0.16,
            createdby: createdById,
        },
        {
            produit: 'Maïs grain jaune',
            image: `${imageBaseUrl}1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80`,
            id_unity: uniteMap.get('kg')!,
            id_category: categoryMap.get('Céréales')!,
            id_souscategory: sousCatMap.get('Maïs'),
            description: 'Maïs grain jaune riche en caroténoïdes, parfait pour l\'alimentation humaine et animale',
            tva: 0.16,
            createdby: createdById,
        },
        {
            produit: 'Riz paddy long grain',
            image: `${imageBaseUrl}1586201375761-83865011e358?auto=format&fit=crop&w=800&q=80`,
            id_unity: uniteMap.get('kg')!,
            id_category: categoryMap.get('Céréales')!,
            id_souscategory: sousCatMap.get('Riz'),
            description: 'Riz paddy à long grain, non décortiqué, pour transformation locale',
            tva: 0.16,
            createdby: createdById,
        },
        {
            produit: 'Riz blanc parfumé',
            image: `${imageBaseUrl}1604908176997-12d92a9b85b5?auto=format&fit=crop&w=800&q=80`,
            id_unity: uniteMap.get('kg')!,
            id_category: categoryMap.get('Céréales')!,
            id_souscategory: sousCatMap.get('Riz'),
            description: 'Riz blanc parfumé de qualité premium, prêt à cuisiner',
            tva: 0.16,
            createdby: createdById,
        },
        {
            produit: 'Sorgho blanc',
            image: `${imageBaseUrl}1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80`,
            id_unity: uniteMap.get('kg')!,
            id_category: categoryMap.get('Céréales')!,
            id_souscategory: sousCatMap.get('Sorgho'),
            description: 'Sorgho blanc décortiqué, sans gluten, riche en fibres',
            tva: 0.16,
            createdby: createdById,
        },
        {
            produit: 'Mil perle',
            image: `${imageBaseUrl}1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80`,
            id_unity: uniteMap.get('kg')!,
            id_category: categoryMap.get('Céréales')!,
            id_souscategory: sousCatMap.get('Mil'),
            description: 'Mil perle (petit mil), céréale ancestrale très nutritive',
            tva: 0.16,
            createdby: createdById,
        },

        // LÉGUMINEUSES & OLÉAGINEUX
        {
            produit: 'Haricot rouge sec',
            image: `${imageBaseUrl}1547592180-85f173990554?auto=format&fit=crop&w=800&q=80`,
            id_unity: uniteMap.get('kg')!,
            id_category: categoryMap.get('Légumineuses & Oléagineux')!,
            id_souscategory: sousCatMap.get('Haricot'),
            description: 'Haricots rouges secs, riches en protéines et fer',
            tva: 0.16,
            createdby: createdById,
        },
        {
            produit: 'Haricot blanc sec',
            image: `${imageBaseUrl}1547592180-85f173990554?auto=format&fit=crop&w=800&q=80`,
            id_unity: uniteMap.get('kg')!,
            id_category: categoryMap.get('Légumineuses & Oléagineux')!,
            id_souscategory: sousCatMap.get('Haricot'),
            description: 'Haricots blancs secs (haricots cannellini), tendres à la cuisson',
            tva: 0.16,
            createdby: createdById,
        },
        {
            produit: 'Graines de soja',
            image: `${imageBaseUrl}1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80`,
            id_unity: uniteMap.get('kg')!,
            id_category: categoryMap.get('Légumineuses & Oléagineux')!,
            id_souscategory: sousCatMap.get('Soja'),
            description: 'Graines de soja jaune non-OGM, riches en protéines complètes',
            tva: 0.16,
            createdby: createdById,
        },
        {
            produit: 'Arachide décortiquée',
            image: `${imageBaseUrl}1559181568651-295d0a28b74c?auto=format&fit=crop&w=800&q=80`,
            id_unity: uniteMap.get('kg')!,
            id_category: categoryMap.get('Légumineuses & Oléagineux')!,
            id_souscategory: sousCatMap.get('Arachide'),
            description: 'Arachides décortiquées, idéales pour huile, pâte ou grillées',
            tva: 0.16,
            createdby: createdById,
        },
        {
            produit: 'Arachide en coque',
            image: `${imageBaseUrl}1559181568651-295d0a28b74c?auto=format&fit=crop&w=800&q=80`,
            id_unity: uniteMap.get('kg')!,
            id_category: categoryMap.get('Légumineuses & Oléagineux')!,
            id_souscategory: sousCatMap.get('Arachide'),
            description: 'Arachides en coque, fraîchement récoltées',
            tva: 0.16,
            createdby: createdById,
        },
        {
            produit: 'Niébé (haricot à œil noir)',
            image: `${imageBaseUrl}1547592180-85f173990554?auto=format&fit=crop&w=800&q=80`,
            id_unity: uniteMap.get('kg')!,
            id_category: categoryMap.get('Légumineuses & Oléagineux')!,
            id_souscategory: sousCatMap.get('Niébé'),
            description: 'Niébé (black-eyed peas), cuisson rapide, très nutritif',
            tva: 0.16,
            createdby: createdById,
        },

        // TUBERCULES & RACINES
        {
            produit: 'Manioc frais',
            image: `${imageBaseUrl}1588464041395-2ef5a7e3e3b8?auto=format&fit=crop&w=800&q=80`,
            id_unity: uniteMap.get('kg')!,
            id_category: categoryMap.get('Tubercules & Racines')!,
            id_souscategory: sousCatMap.get('Manioc'),
            description: 'Racines de manioc fraîches, variété douce, pour fufu et chikwangue',
            tva: 0.16,
            createdby: createdById,
        },
        {
            produit: 'Pomme de terre de table',
            image: `${imageBaseUrl}1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80`,
            id_unity: uniteMap.get('kg')!,
            id_category: categoryMap.get('Tubercules & Racines')!,
            id_souscategory: sousCatMap.get('Pomme de terre'),
            description: 'Pommes de terre de table à chair ferme, idéales frites, vapeur, purée',
            tva: 0.16,
            createdby: createdById,
        },
        {
            produit: 'Patate douce chair orange',
            image: `${imageBaseUrl}1597797817-5b4c1b7b7a1f?auto=format&fit=crop&w=800&q=80`,
            id_unity: uniteMap.get('kg')!,
            id_category: categoryMap.get('Tubercules & Racines')!,
            id_souscategory: sousCatMap.get('Patate douce'),
            description: 'Patates douces à chair orange, riches en bêta-carotène',
            tva: 0.16,
            createdby: createdById,
        },
        {
            produit: 'Igname blanche',
            image: `${imageBaseUrl}1588464041395-2ef5a7e3e3b8?auto=format&fit=crop&w=800&q=80`,
            id_unity: uniteMap.get('kg')!,
            id_category: categoryMap.get('Tubercules & Racines')!,
            id_souscategory: sousCatMap.get('Igname'),
            description: 'Igname blanche fraîche, texture ferme, saveur douce',
            tva: 0.16,
            createdby: createdById,
        },
        {
            produit: 'Carottes fraîches',
            image: `${imageBaseUrl}1447175008436-054170c2e979?auto=format&fit=crop&w=800&q=80`,
            id_unity: uniteMap.get('kg')!,
            id_category: categoryMap.get('Tubercules & Racines')!,
            id_souscategory: sousCatMap.get('Carotte'),
            description: 'Carottes orange fraîches, croquantes et sucrées',
            tva: 0.16,
            createdby: createdById,
        },

        // FRUITS
        {
            produit: 'Banane plantain verte',
            image: `${imageBaseUrl}1603833665858-211e4518d6eb?auto=format&fit=crop&w=800&q=80`,
            id_unity: uniteMap.get('kg')!,
            id_category: categoryMap.get('Fruits')!,
            id_souscategory: sousCatMap.get('Banane'),
            description: 'Bananes plantain vertes, pour cuisson (frites, bouillies, vapeur)',
            tva: 0.16,
            createdby: createdById,
        },
        {
            produit: 'Banane douce (dessert)',
            image: `${imageBaseUrl}1603833665858-211e4518d6eb?auto=format&fit=crop&w=800&q=80`,
            id_unity: uniteMap.get('kg')!,
            id_category: categoryMap.get('Fruits')!,
            id_souscategory: sousCatMap.get('Banane'),
            description: 'Bananes douces mûres, prêtes à manger, très sucrées',
            tva: 0.16,
            createdby: createdById,
        },
        {
            produit: 'Ananas Cayenne',
            image: `${imageBaseUrl}1550258987189-1c5b6e8e4c1d?auto=format&fit=crop&w=800&q=80`,
            id_unity: uniteMap.get('piece')!,
            id_category: categoryMap.get('Fruits')!,
            id_souscategory: sousCatMap.get('Ananas'),
            description: 'Ananas variété Cayenne, juteux et parfumé, chair jaune doré',
            tva: 0.16,
            createdby: createdById,
        },
        {
            produit: 'Mangue Kent',
            image: `${imageBaseUrl}1601070956603-7f5e2e2b3b3f?auto=format&fit=crop&w=800&q=80`,
            id_unity: uniteMap.get('kg')!,
            id_category: categoryMap.get('Fruits')!,
            id_souscategory: sousCatMap.get('Mangue'),
            description: 'Mangues Kent, chair sans fibres, très sucrée et parfumée',
            tva: 0.16,
            createdby: createdById,
        },
        {
            produit: 'Avocat Hass',
            image: `${imageBaseUrl}1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80`,
            id_unity: uniteMap.get('kg')!,
            id_category: categoryMap.get('Fruits')!,
            id_souscategory: sousCatMap.get('Avocat'),
            description: 'Avocats Hass mûrs à point, chair crémeuse et beurrée',
            tva: 0.16,
            createdby: createdById,
        },
        {
            produit: 'Papaye solo',
            image: `${imageBaseUrl}1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80`,
            id_unity: uniteMap.get('kg')!,
            id_category: categoryMap.get('Fruits')!,
            id_souscategory: sousCatMap.get('Papaye'),
            description: 'Papayes solo, chair orange foncé, très sucrée',
            tva: 0.16,
            createdby: createdById,
        },
        {
            produit: 'Oranges douces',
            image: `${imageBaseUrl}1611080626919-7cf5a093b5f0?auto=format&fit=crop&w=800&q=80`,
            id_unity: uniteMap.get('kg')!,
            id_category: categoryMap.get('Fruits')!,
            id_souscategory: sousCatMap.get('Agrumes'),
            description: 'Oranges douces à jus, peau fine, très juteuses',
            tva: 0.16,
            createdby: createdById,
        },

        // LÉGUMES & MARAÎCHAGE
        {
            produit: 'Tomates rondes',
            image: `${imageBaseUrl}1546094096087-6c1b8c1e5b3c?auto=format&fit=crop&w=800&q=80`,
            id_unity: uniteMap.get('kg')!,
            id_category: categoryMap.get('Légumes & Maraîchage')!,
            id_souscategory: sousCatMap.get('Tomate'),
            description: 'Tomates rondes fermes, idéales salades et cuisson',
            tva: 0.16,
            createdby: createdById,
        },
        {
            produit: 'Tomates cerises',
            image: `${imageBaseUrl}1592841200221-7a2b5c3d8e9f?auto=format&fit=crop&w=800&q=80`,
            id_unity: uniteMap.get('kg')!,
            id_category: categoryMap.get('Légumes & Maraîchage')!,
            id_souscategory: sousCatMap.get('Tomate'),
            description: 'Tomates cerises sucrées, parfaites pour apéritif et salades',
            tva: 0.16,
            createdby: createdById,
        },
        {
            produit: 'Chou pommé blanc',
            image: `${imageBaseUrl}1571101410793-73f8c8b8c8c8?auto=format&fit=crop&w=800&q=80`,
            id_unity: uniteMap.get('kg')!,
            id_category: categoryMap.get('Légumes & Maraîchage')!,
            id_souscategory: sousCatMap.get('Chou'),
            description: 'Chou pommé blanc compact, idéal choucroute et salades',
            tva: 0.16,
            createdby: createdById,
        },
        {
            produit: 'Oignons jaunes',
            image: `${imageBaseUrl}1518977722-2c1b5c3d8e9f?auto=format&fit=crop&w=800&q=80`,
            id_unity: uniteMap.get('kg')!,
            id_category: categoryMap.get('Légumes & Maraîchage')!,
            id_souscategory: sousCatMap.get('Oignon'),
            description: 'Oignons jaunes de conservation, forts et parfumés',
            tva: 0.16,
            createdby: createdById,
        },
        {
            produit: 'Amarante (Lengalenga) fraîche',
            image: `${imageBaseUrl}1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80`,
            id_unity: uniteMap.get('kg')!,
            id_category: categoryMap.get('Légumes & Maraîchage')!,
            id_souscategory: sousCatMap.get('Amarante (Lengalenga)'),
            description: 'Feuilles d\'amarante fraîches (lengalenga), très nutritives',
            tva: 0.16,
            createdby: createdById,
        },
        {
            produit: 'Poivrons rouges',
            image: `${imageBaseUrl}1563565795-5d8e5c3d8e9f?auto=format&fit=crop&w=800&q=80`,
            id_unity: uniteMap.get('kg')!,
            id_category: categoryMap.get('Légumes & Maraîchage')!,
            id_souscategory: sousCatMap.get('Poivron'),
            description: 'Poivrons rouges mûrs, charnus et sucrés',
            tva: 0.16,
            createdby: createdById,
        },

        // CULTURES DE RENTE & CAFÉ/CACAO
        {
            produit: 'Café Arabica lavé (grains verts)',
            image: `${imageBaseUrl}1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80`,
            id_unity: uniteMap.get('kg')!,
            id_category: categoryMap.get('Cultures de rente & Café/Cacao')!,
            id_souscategory: sousCatMap.get('Café Arabica'),
            description: 'Grains de café Arabica lavés, qualité specialty, pour torréfaction',
            tva: 0.16,
            createdby: createdById,
        },
        {
            produit: 'Café Robusta lavé (grains verts)',
            image: `${imageBaseUrl}1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80`,
            id_unity: uniteMap.get('kg')!,
            id_category: categoryMap.get('Cultures de rente & Café/Cacao')!,
            id_souscategory: sousCatMap.get('Café Robusta'),
            description: 'Grains de café Robusta lavés, corsé, pour mélanges expresso',
            tva: 0.16,
            createdby: createdById,
        },
        {
            produit: 'Fèves de cacao fermentées',
            image: `${imageBaseUrl}1541783245831-57d628c6b5e1?auto=format&fit=crop&w=800&q=80`,
            id_unity: uniteMap.get('kg')!,
            id_category: categoryMap.get('Cultures de rente & Café/Cacao')!,
            id_souscategory: sousCatMap.get('Cacao'),
            description: 'Fèves de cacao fermentées et séchées, qualité export',
            tva: 0.16,
            createdby: createdById,
        },
        {
            produit: 'Thé noir en vrac',
            image: `${imageBaseUrl}1556881286-8c6e8f4a5c6b?auto=format&fit=crop&w=800&q=80`,
            id_unity: uniteMap.get('kg')!,
            id_category: categoryMap.get('Cultures de rente & Café/Cacao')!,
            id_souscategory: sousCatMap.get('Thé'),
            description: 'Thé noir orthodoxe, feuilles entières, arôme malté',
            tva: 0.16,
            createdby: createdById,
        },
        {
            produit: 'Gousses de vanille noire',
            image: `${imageBaseUrl}1608198644332-8c6e8f4a5c6b?auto=format&fit=crop&w=800&q=80`,
            id_unity: uniteMap.get('piece')!,
            id_category: categoryMap.get('Cultures de rente & Café/Cacao')!,
            id_souscategory: sousCatMap.get('Vanille'),
            description: 'Gousses de vanille noire de Madagascar, grade A, très parfumées',
            tva: 0.16,
            createdby: createdById,
        },

        // ÉPICES & CONDIMENTS
        {
            produit: 'Gingembre frais',
            image: `${imageBaseUrl}1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80`,
            id_unity: uniteMap.get('kg')!,
            id_category: categoryMap.get('Épices & Condiments')!,
            id_souscategory: sousCatMap.get('Gingembre'),
            description: 'Rhizomes de gingembre frais, fermes et parfumés',
            tva: 0.16,
            createdby: createdById,
        },
        {
            produit: 'Piment fort (oiseau)',
            image: `${imageBaseUrl}1563565795-5d8e5c3d8e9f?auto=format&fit=crop&w=800&q=80`,
            id_unity: uniteMap.get('kg')!,
            id_category: categoryMap.get('Épices & Condiments')!,
            id_souscategory: sousCatMap.get('Piment'),
            description: 'Piments oiseau frais, très forts, pour sauces pimentées',
            tva: 0.16,
            createdby: createdById,
        },
        {
            produit: 'Ail violet',
            image: `${imageBaseUrl}1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80`,
            id_unity: uniteMap.get('kg')!,
            id_category: categoryMap.get('Épices & Condiments')!,
            id_souscategory: sousCatMap.get('Ail'),
            description: 'Têtes d\'ail violet, gros calibre, conservation longue',
            tva: 0.16,
            createdby: createdById,
        },
        {
            produit: 'Curcuma en poudre',
            image: `${imageBaseUrl}1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80`,
            id_unity: uniteMap.get('kg')!,
            id_category: categoryMap.get('Épices & Condiments')!,
            id_souscategory: sousCatMap.get('Curcuma'),
            description: 'Poudre de curcuma pure, couleur jaune intense, curcumine élevée',
            tva: 0.16,
            createdby: createdById,
        },

        // PRODUITS TRANSFORMÉS & FARINES
        {
            produit: 'Farine de manioc (fufu)',
            image: `${imageBaseUrl}1588464041395-2ef5a7e3e3b8?auto=format&fit=crop&w=800&q=80`,
            id_unity: uniteMap.get('kg')!,
            id_category: categoryMap.get('Produits transformés & Farines')!,
            id_souscategory: sousCatMap.get('Farine de manioc'),
            description: 'Farine de manioc fermentée pour fufu, texture lisse, sans grumeaux',
            tva: 0.16,
            createdby: createdById,
        },
        {
            produit: 'Farine de maïs blanc',
            image: `${imageBaseUrl}1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80`,
            id_unity: uniteMap.get('kg')!,
            id_category: categoryMap.get('Produits transformés & Farines')!,
            id_souscategory: sousCatMap.get('Farine de maïs'),
            description: 'Farine de maïs blanc fin, pour ugali, bouillie, pâtisserie',
            tva: 0.16,
            createdby: createdById,
        },
        {
            produit: 'Huile de palme rouge',
            image: `${imageBaseUrl}1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80`,
            id_unity: uniteMap.get('litre')!,
            id_category: categoryMap.get('Produits transformés & Farines')!,
            id_souscategory: sousCatMap.get('Huile de palme'),
            description: 'Huile de palme rouge artisanale, riche en vitamine A et E',
            tva: 0.16,
            createdby: createdById,
        },
        {
            produit: 'Miel pur de fleurs',
            image: `${imageBaseUrl}1558642452-9d2a7e7b5c6d?auto=format&fit=crop&w=800&q=80`,
            id_unity: uniteMap.get('kg')!,
            id_category: categoryMap.get('Produits transformés & Farines')!,
            id_souscategory: sousCatMap.get('Miel'),
            description: 'Miel pur multifloral, non chauffé, cristallisation naturelle',
            tva: 0.16,
            createdby: createdById,
        },
        {
            produit: 'Confiture de mangue artisanale',
            image: `${imageBaseUrl}1601070956603-7f5e2e2b3b3f?auto=format&fit=crop&w=800&q=80`,
            id_unity: uniteMap.get('kg')!,
            id_category: categoryMap.get('Produits transformés & Farines')!,
            id_souscategory: sousCatMap.get('Confitures'),
            description: 'Confiture de mangue artisanale, fruits entiers, peu sucrée',
            tva: 0.16,
            createdby: createdById,
        },
        {
            produit: 'Jus de mangue 100% pur',
            image: `${imageBaseUrl}1601070956603-7f5e2e2b3b3f?auto=format&fit=crop&w=800&q=80`,
            id_unity: uniteMap.get('litre')!,
            id_category: categoryMap.get('Produits transformés & Farines')!,
            id_souscategory: sousCatMap.get('Jus de fruits'),
            description: 'Jus de mangue 100% pur, sans sucre ajouté, sans conservateur',
            tva: 0.16,
            createdby: createdById,
        },
    ];

    for (const prodData of products) {
        const [product, created] = await Produits.findOrCreate({
            where: { produit: prodData.produit },
            defaults: prodData,
        });

        if (created) {
            logSeed(`Created product: ${product.produit} (cat: ${product.id_category}, unit: ${product.id_unity})`);
        } else if (isDevelopment) {
            logSeed(`Product already exists: ${product.produit}`);
            // Update image URL if it's empty or placeholder
            if (!product.image || product.image === '' || product.image.includes('placeholder')) {
                await product.update({ image: prodData.image });
                logSeed(`Updated product image: ${product.produit}`);
            }
        }
    }

    if (isDevelopment) {
        console.log('\n===========================================');
        console.log('🌾 AGRICULTURAL PRODUCTS WITH IMAGES (DEV MODE)');
        console.log('===========================================');
        products.forEach((prod, index) => {
            const catName = Array.from(categoryMap.entries()).find(([_, v]) => v === prod.id_category)?.[0] || 'N/A';
            const unitName = Array.from(uniteMap.entries()).find(([k, v]) => v === prod.id_unity)?.[0] || 'N/A';
            console.log(`${index + 1}. ${prod.produit} [${catName}] - ${unitName}`);
            console.log(`   Image: ${prod.image}`);
        });
        console.log('===========================================\n');
    }
}

export default runStartupSeed;

/**
 * Link cooperative to admin user
 */
async function linkCooperativeToAdmin(coopId: number, adminId: number): Promise<void> {
    await Cooperatives.update(
        { id_responsable: adminId },
        { where: { id: coopId } }
    );
    logSeed(`Linked cooperative ${coopId} to admin ${adminId}`);
}

/**
 * Seed Hasmember for coop admin
 */
async function seedHasmember(userId: number, cooperativeId: number): Promise<void> {
    const [hasmember, created] = await Hasmembers.findOrCreate({
        where: { TblEcomUserId: userId, TblEcomCooperativeId: cooperativeId },
        defaults: {
            TblEcomUserId: userId,
            TblEcomCooperativeId: cooperativeId,
            is_payed: 1,
            carte: randomLongNumber({ length: 12 }),
            date_expiration: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            date_expiration_unix: String(Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60),
        },
    });

    if (created) {
        logSeed(`Created hasmember for user ${userId} in cooperative ${cooperativeId}`);
    } else if (isDevelopment) {
        logSeed(`Hasmember already exists for user ${userId} in cooperative ${cooperativeId}`);
    }
}