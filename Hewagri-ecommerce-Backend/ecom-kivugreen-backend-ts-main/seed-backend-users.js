const connect = require('./dist/__databases/connecte').connect;
const Users = require('./dist/__models/model.users').Users;
const Roles = require('./dist/__models/model.roles').Roles;
const Hasroles = require('./dist/__models/model.hasroles').Hasroles;
const Extras = require('./dist/__models/model.extras').Extras;
const Cooperatives = require('./dist/__models/model.cooperatives').Cooperatives;
const bcrypt = require('bcrypt');

async function seedBackendUsers() {
    try {
        console.log("🔄 Connexion à la base de données...");
        await connect.authenticate();
        console.log("✅ Connecté");

        // Clean up existing test data first
        console.log("🔄 Nettoyage des données de test existantes...");
        await Extras.destroy({ where: { id_user: { [require('sequelize').Op.gte]: 3 } } });
        await Hasroles.destroy({ where: { TblEcomUserId: { [require('sequelize').Op.gte]: 3 } } });
        await Users.destroy({ where: { id: { [require('sequelize').Op.gte]: 3 } } });
        console.log("✅ Données de test nettoyées");

        // Sync models to ensure tables exist
        await Roles.sync({ alter: true });
        await Users.sync({ alter: true });
        await Hasroles.sync({ alter: true });
        await Extras.sync({ alter: true });
        await Cooperatives.sync({ alter: true });
        console.log("✅ Tables synchronisées");

        // 1. Hash password
        const hashPWD = async (plaintext) => {
            return await bcrypt.hash(plaintext, 10);
        };

        // 2. Create/ensure roles exist
        console.log("🔄 Création des rôles...");
        const rolesData = [
            { id: 1, role: "super_admin" },
            { id: 2, role: "admin" },
            { id: 3, role: "manager" },
            { id: 4, role: "agent" },
            { id: 5, role: "client" },
        ];

        for (const r of rolesData) {
            await Roles.findOrCreate({ where: { id: r.id }, defaults: r });
        }
        console.log("✅ Rôles créés/vérifiés");

        // 3. Create cooperatives
        console.log("🔄 Création des coopératives...");
        const cooperativesData = [
            {
                id: 1,
                cooperative: "Coopérative KivuGreen Goma",
                sigle: "KVG-GOMA",
                phone: "+243970000000",
                email: "goma@kivugreen.cd",
                adresse: "Goma, Nord-Kivu",
                isformel: 1,
                num_enregistrement: "RG-2024-COOPE-001",
                description: "Coopérative agricole KivuGreen Goma"
            },
            {
                id: 2,
                cooperative: "Coopérative KivuGreen Bukavu",
                sigle: "KVG-BUKAVU",
                phone: "+243970000001",
                email: "bukavu@kivugreen.cd",
                adresse: "Bukavu, Sud-Kivu",
                isformel: 1,
                num_enregistrement: "RG-2024-COOPE-002",
                description: "Coopérative agricole KivuGreen Bukavu"
            }
        ];

        for (const coop of cooperativesData) {
            await Cooperatives.findOrCreate({ where: { id: coop.id }, defaults: coop });
        }
        console.log("✅ Coopératives créées/vérifiées");

        // 4. Create test users matching frontend seed
        console.log("🔄 Création des utilisateurs de test POS...");

        // fillphone function equivalent
        const fillphone = ({ phone }) => {
            switch (phone.charAt(0)) {
                case '0': return String(phone);
                case '+': return String(`0${phone.substring(4)}`);
                case '2': return String(`0${phone.substring(3)}`);
                default: return String(`0${phone}`);
            }
        };

        // User 1: Admin Coopérative 1
        const pwd1 = await hashPWD("password123");
        const phone1 = fillphone({ phone: "+243970000001" }); // becomes "0970000001"
        const [user1, user1Created] = await Users.findOrCreate({
            where: { phone: phone1 },
            defaults: {
                uuid: "uuid-coop-admin-1",
                nom: "Mukwege",
                postnom: "Kivu",
                prenom: "Jean",
                email: "admin@kivugreen.cd",
                phone: phone1,
                password: pwd1,
                isvalidated: 1,
                idcooperative: 1,
                typeaccount: 2,
                sexe: "M"
            }
        });
        console.log("✅ Admin Coop 1:", user1.phone, "(ID:", user1.id, ")");

        // Assign roles: COOP_ADMIN (1) and MANAGER (3)
        await Hasroles.findOrCreate({ where: { TblEcomUserId: user1.id, TblEcomRoleId: 1 } });
        await Hasroles.findOrCreate({ where: { TblEcomUserId: user1.id, TblEcomRoleId: 3 } });
        console.log("✅ Rôles 1,3 assignés à Admin Coop 1");

        // Link as responsable of cooperative 1
        await Cooperatives.update({ id_responsable: user1.id }, { where: { id: 1 } });
        console.log("✅ Admin Coop 1 lié à la coopérative 1");

        // Extras for user1
        await Extras.findOrCreate({
            where: { id_user: user1.id },
            defaults: { id_user: user1.id, verification: "123456" }
        });

        // User 2: Livreur
        const pwd2 = await hashPWD("password123");
        const phone2 = fillphone({ phone: "+243970000002" }); // becomes "0970000002"
        const [user2, user2Created] = await Users.findOrCreate({
            where: { phone: phone2 },
            defaults: {
                uuid: "uuid-livreur-1",
                nom: "Livreur",
                postnom: "Test",
                prenom: "Pierre",
                email: "livreur@kivugreen.cd",
                phone: phone2,
                password: pwd2,
                isvalidated: 1,
                idcooperative: 1,
                typeaccount: 1,
                sexe: "M"
            }
        });
        console.log("✅ Livreur:", user2.phone, "(ID:", user2.id, ")");

        // Assign role: LIVREUR (we need to check what role ID this is - for now use client=5)
        // The auth endpoint only allows [1, 2, 3] - so Livreur might need a different endpoint
        await Hasroles.findOrCreate({ where: { TblEcomUserId: user2.id, TblEcomRoleId: 5 } });
        console.log("✅ Rôle 5 (client) assigné au Livreur");

        // Extras for user2
        await Extras.findOrCreate({
            where: { id_user: user2.id },
            defaults: { id_user: user2.id, verification: "123456" }
        });

        // User 3: Admin Coopérative 2
        const pwd3 = await hashPWD("password123");
        const phone3 = fillphone({ phone: "+243970000003" }); // becomes "0970000003"
        const [user3, user3Created] = await Users.findOrCreate({
            where: { phone: phone3 },
            defaults: {
                uuid: "uuid-coop-admin-2",
                nom: "Goma",
                postnom: "Nord",
                prenom: "Marie",
                email: "admin2@kivugreen.cd",
                phone: phone3,
                password: pwd3,
                isvalidated: 1,
                idcooperative: 2,
                typeaccount: 2,
                sexe: "F"
            }
        });
        console.log("✅ Admin Coop 2:", user3.phone, "(ID:", user3.id, ")");

        // Assign role: COOP_ADMIN (1)
        await Hasroles.findOrCreate({ where: { TblEcomUserId: user3.id, TblEcomRoleId: 1 } });
        console.log("✅ Rôle 1 assigné à Admin Coop 2");

        // Link as responsable of cooperative 2
        await Cooperatives.update({ id_responsable: user3.id }, { where: { id: 2 } });
        console.log("✅ Admin Coop 2 lié à la coopérative 2");

        // Extras for user3
        await Extras.findOrCreate({
            where: { id_user: user3.id },
            defaults: { id_user: user3.id, verification: "123456" }
        });

        console.log("\n🎉 Seed Backend Users terminé !");
        console.log("\n📋 Comptes de test créés (backend MySQL) :");
        console.log("   👤 Admin Coop 1: +243970000001 (stored as 0970000001) / password123 (rôles: 1=super_admin, 3=manager) - coop 1");
        console.log("   👤 Livreur:      +243970000002 (stored as 0970000002) / password123 (rôle: 5=client) - coop 1");
        console.log("   👤 Admin Coop 2: +243970000003 (stored as 0970000003) / password123 (rôle: 1=super_admin) - coop 2");
        console.log("\n💡 Pour l'authentification, utilisez le format international (+243...) ou local (097...)");
        console.log("\n⚠️  Note: L'endpoint /auth n'accepte que les rôles [1, 2, 3]");
        console.log("   - Admin Coop 1 (rôles 1,3) ✅ PEUT se connecter via /auth");
        console.log("   - Admin Coop 2 (rôle 1) ✅ PEUT se connecter via /auth");
        console.log("   - Livreur (rôle 5) ❌ NE PEUT PAS se connecter via /auth (utiliser /authbank)");

    } catch (error) {
        console.error("❌ Erreur:", error);
    } finally {
        await connect.close();
        process.exit(0);
    }
}

seedBackendUsers();