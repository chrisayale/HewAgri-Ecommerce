import { Sequelize } from "sequelize";
import config from "config";

// Configuration de la base de données
const dbConfig = config.get<any>('database') || config;

// Utiliser la config locale (development)
const dbName = "kivugreen_dev";
const username = "kgreen_dev_user";
const password = "[.UR7o]wgx)7/5[c";
const host = "localhost";
const port = 3306;
const dialect = "mysql";

const sequelize = new Sequelize(dbName, username, password, {
    host,
    port,
    dialect,
    logging: false,
    timezone: "+02:00",
});

// Modèles simplifiés pour le seed
const Role = sequelize.define('Role', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    role: { type: Sequelize.STRING, allowNull: false },
}, { tableName: 'Roles', timestamps: false });

const User = sequelize.define('User', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    uuid: { type: Sequelize.STRING, allowNull: false },
    nom: { type: Sequelize.STRING, allowNull: false },
    postnom: { type: Sequelize.STRING, allowNull: false },
    prenom: { type: Sequelize.STRING },
    email: { type: Sequelize.STRING },
    phone: { type: Sequelize.STRING, allowNull: false },
    password: { type: Sequelize.STRING, allowNull: false },
    isvalidated: { type: Sequelize.INTEGER, defaultValue: 0 },
    idprovince: { type: Sequelize.INTEGER },
    idterritoire: { type: Sequelize.INTEGER },
    idvillage: { type: Sequelize.INTEGER },
    date_naiss: { type: Sequelize.DATE },
    sexe: { type: Sequelize.STRING },
}, { tableName: 'Users', timestamps: true });

const HasRole = sequelize.define('HasRole', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    iduser: { type: Sequelize.INTEGER, allowNull: false },
    idrole: { type: Sequelize.INTEGER, allowNull: false },
}, { tableName: 'Hasroles', timestamps: false });

const Extra = sequelize.define('Extra', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    id_user: { type: Sequelize.INTEGER, allowNull: false },
    verification: { type: Sequelize.STRING },
}, { tableName: 'Extras', timestamps: false });

// Association
User.belongsToMany(Role, { through: HasRole, foreignKey: 'iduser', otherKey: 'idrole' });
Role.belongsToMany(User, { through: HasRole, foreignKey: 'idrole', otherKey: 'iduser' });

async function seed() {
    try {
        console.log("🔄 Connexion à la base de données...");
        await sequelize.authenticate();
        console.log("✅ Connecté à MySQL");

        console.log("🔄 Synchronisation des modèles (création des tables)...");
        await sequelize.sync({ alter: true });
        console.log("✅ Tables créées/mises à jour");

        // 1. Créer les rôles de base
        console.log("🔄 Création des rôles...");
        const roles = [
            { id: 1, role: "super_admin" },
            { id: 2, role: "admin" },
            { id: 3, role: "manager" },
            { id: 4, role: "agent" },
            { id: 5, role: "client" },
        ];

        for (const r of roles) {
            await Role.findOrCreate({ where: { id: r.id }, defaults: r });
        }
        console.log("✅ Rôles créés");

        // 2. Fonction de hash de mot de passe (copiée du helper)
        const bcrypt = require('bcrypt');
        const hashPWD = async (plaintext: string) => {
            return await bcrypt.hash(plaintext, 10);
        };

        // 3. Créer l'utilisateur admin
        console.log("🔄 Création de l'utilisateur admin...");
        const adminPassword = await hashPWD("admin123");
        const [adminUser] = await User.findOrCreate({
            where: { phone: "+243999999999" },
            defaults: {
                uuid: "admin-uuid-001",
                nom: "Admin",
                postnom: "Hewagri",
                prenom: "Super",
                email: "admin@hewagri.cd",
                phone: "+243999999999",
                password: adminPassword,
                isvalidated: 1,
            }
        });
        console.log("✅ Admin créé:", adminUser.phone);

        // Assigner rôle super_admin (1) à l'admin
        await HasRole.findOrCreate({
            where: { iduser: adminUser.id, idrole: 1 }
        });
        console.log("✅ Rôle super_admin assigné à l'admin");

        // 4. Créer l'utilisateur client
        console.log("🔄 Création de l'utilisateur client...");
        const clientPassword = await hashPWD("client123");
        const [clientUser] = await User.findOrCreate({
            where: { phone: "+243888888888" },
            defaults: {
                uuid: "client-uuid-001",
                nom: "Client",
                postnom: "Test",
                prenom: "Jean",
                email: "client@hewagri.cd",
                phone: "+243888888888",
                password: clientPassword,
                isvalidated: 1,
            }
        });
        console.log("✅ Client créé:", clientUser.phone);

        // Assigner rôle client (5) au client
        await HasRole.findOrCreate({
            where: { iduser: clientUser.id, idrole: 5 }
        });
        console.log("✅ Rôle client assigné au client");

        // 5. Créer les Extras pour la vérification
        await Extra.findOrCreate({
            where: { id_user: adminUser.id },
            defaults: { id_user: adminUser.id, verification: "123456" }
        });
        await Extra.findOrCreate({
            where: { id_user: clientUser.id },
            defaults: { id_user: clientUser.id, verification: "123456" }
        });
        console.log("✅ Extras créés");

        console.log("\n🎉 Seed terminé avec succès !");
        console.log("\n📋 Comptes de test créés :");
        console.log("   👤 Admin: phone=+243999999999, password=admin123 (rôle: super_admin=1)");
        console.log("   👤 Client: phone=+243888888888, password=client123 (rôle: client=5)");
        console.log("\n⚠️  Note: L'authentification 'auth' n'accepte que les rôles [1, 3, 2]");
        console.log("   L'admin (rôle 1) pourra se connecter, mais le client (rôle 5) aura '403 Unauthorized'");
        console.log("   Pour le client, utilisez l'endpoint 'authbank' ou changez son rôle en 2 ou 3");

    } catch (error) {
        console.error("❌ Erreur lors du seed:", error);
    } finally {
        await sequelize.close();
    }
}

seed();