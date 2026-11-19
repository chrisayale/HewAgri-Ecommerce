const connect = require('./dist/__databases/connecte').connect;
const Users = require('./dist/__models/model.users').Users;
const Roles = require('./dist/__models/model.roles').Roles;
const Hasroles = require('./dist/__models/model.hasroles').Hasroles;
const Extras = require('./dist/__models/model.extras').Extras;
const bcrypt = require('bcrypt');

async function seed() {
    try {
        console.log("🔄 Connexion à la base de données...");
        await connect.authenticate();
        console.log("✅ Connecté");

        // 1. Créer les rôles
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
        console.log("✅ Rôles créés");

        // 2. Hash passwords
        const hashPWD = async (plaintext) => {
            return await bcrypt.hash(plaintext, 10);
        };

        // 3. Créer l'utilisateur admin
        console.log("🔄 Création de l'utilisateur admin...");
        const adminPassword = await hashPWD("admin123");
        const [adminUser, adminCreated] = await Users.findOrCreate({
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
        console.log("✅ Admin:", adminUser.phone, "(ID:", adminUser.id, ")");

        // Assigner rôle super_admin (1)
        await Hasroles.findOrCreate({
            where: { TblEcomUserId: adminUser.id, TblEcomRoleId: 1 }
        });
        console.log("✅ Rôle super_admin assigné");

        // 4. Créer l'utilisateur client
        console.log("🔄 Création de l'utilisateur client...");
        const clientPassword = await hashPWD("client123");
        const [clientUser, clientCreated] = await Users.findOrCreate({
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
        console.log("✅ Client:", clientUser.phone, "(ID:", clientUser.id, ")");

        // Assigner rôle client (5) et admin (2) pour test /auth
        await Hasroles.findOrCreate({
            where: { TblEcomUserId: clientUser.id, TblEcomRoleId: 5 }
        });
        await Hasroles.findOrCreate({
            where: { TblEcomUserId: clientUser.id, TblEcomRoleId: 2 }
        });
        console.log("✅ Rôles client (5) et admin (2) assignés");

        // 5. Créer les Extras
        await Extras.findOrCreate({
            where: { id_user: adminUser.id },
            defaults: { id_user: adminUser.id, verification: "123456" }
        });
        await Extras.findOrCreate({
            where: { id_user: clientUser.id },
            defaults: { id_user: clientUser.id, verification: "123456" }
        });
        console.log("✅ Extras créés");

        console.log("\n🎉 Seed terminé !");
        console.log("\n📋 Comptes de test :");
        console.log("   👤 Admin: phone=+243999999999 / email=admin@hewagri.cd, password=admin123");
        console.log("   👤 Client: phone=+243888888888 / email=client@hewagri.cd, password=client123");
        console.log("\n✅ Les deux ont le rôle 2 (admin) pour pouvoir se connecter via /auth");

    } catch (error) {
        console.error("❌ Erreur:", error);
    } finally {
        await connect.close();
        process.exit(0);
    }
}

seed();