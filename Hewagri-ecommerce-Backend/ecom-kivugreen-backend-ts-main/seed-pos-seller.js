const connect = require('./dist/__databases/connecte').connect;
const Users = require('./dist/__models/model.users').Users;
const Roles = require('./dist/__models/model.roles').Roles;
const Hasroles = require('./dist/__models/model.hasroles').Hasroles;
const Extras = require('./dist/__models/model.extras').Extras;
const Cooperatives = require('./dist/__models/model.cooperatives').Cooperatives;
const bcrypt = require('bcrypt');

async function seedPOSSeller() {
    try {
        console.log("🔄 Connexion à la base de données...");
        await connect.authenticate();
        console.log("✅ Connecté");

        // 1. Hash password
        const hashPWD = async (plaintext) => {
            return await bcrypt.hash(plaintext, 10);
        };

        // 2. Create POS Cooperative
        console.log("🔄 Création de la coopérative POS...");
        const [posCoop, posCoopCreated] = await Cooperatives.findOrCreate({
            where: { sigle: "POS-KIVU" },
            defaults: {
                cooperative: "KivuGreen POS Seller",
                sigle: "POS-KIVU",
                phone: "+243810000001",
                email: "pos@kivugreen.cd",
                adresse: "Goma, Nord-Kivu, RDC",
                num_enregistrement: "RG-2024-POS-001",
                isformel: 1,
                description: "Coopérative pour les vendeurs POS",
            }
        });
        console.log("✅ Coopérative POS:", posCoop.cooperative, "(ID:", posCoop.id, ")");

        // 3. Create POS Seller User (role 2 = admin, which is allowed for /auth endpoint)
        console.log("🔄 Création de l'utilisateur vendeur POS...");
        const posPassword = await hashPWD("pos123");
        const [posUser, posUserCreated] = await Users.findOrCreate({
            where: { phone: "+243810000001" },
            defaults: {
                uuid: "pos-seller-uuid-001",
                nom: "Vendeur",
                postnom: "POS",
                prenom: "KivuGreen",
                email: "pos@kivugreen.cd",
                phone: "+243810000001",
                password: posPassword,
                isvalidated: 1,
            }
        });
        console.log("✅ Vendeur POS:", posUser.phone, "(ID:", posUser.id, ")");

        // 4. Assign role admin (2) - allowed for /auth endpoint
        await Hasroles.findOrCreate({
            where: { TblEcomUserId: posUser.id, TblEcomRoleId: 2 }
        });
        console.log("✅ Rôle admin (2) assigné au vendeur POS");

        // Also assign client role (5) for completeness
        await Hasroles.findOrCreate({
            where: { TblEcomUserId: posUser.id, TblEcomRoleId: 5 }
        });
        console.log("✅ Rôle client (5) assigné au vendeur POS");

        // 5. Link user as responsable of the cooperative
        await posCoop.update({ id_responsable: posUser.id });
        console.log("✅ Vendeur POS lié comme responsable de la coopérative");

        // 6. Create Extras for POS seller
        await Extras.findOrCreate({
            where: { id_user: posUser.id },
            defaults: { id_user: posUser.id, verification: "123456" }
        });
        console.log("✅ Extras créé pour le vendeur POS");

        console.log("\n🎉 Seed POS Seller terminé !");
        console.log("\n📋 Compte POS Seller :");
        console.log("   👤 Phone: +243810000001");
        console.log("   👤 Email: pos@kivugreen.cd");
        console.log("   👤 Password: pos123");
        console.log("   👤 Rôles: admin (2), client (5)");
        console.log("   👤 Coopérative: KivuGreen POS Seller (ID:", posCoop.id, ")");
        console.log("\n✅ Ce compte peut se connecter via /api/users/user/auth");

    } catch (error) {
        console.error("❌ Erreur:", error);
    } finally {
        await connect.close();
        process.exit(0);
    }
}

seedPOSSeller();