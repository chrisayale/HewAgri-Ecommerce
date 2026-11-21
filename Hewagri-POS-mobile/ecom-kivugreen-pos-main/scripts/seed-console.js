/**
 * Seed script for browser console - HewAgri POS
 *
 * USAGE:
 * 1. Open http://localhost:8083 in browser
 * 2. Open DevTools Console (F12)
 * 3. Paste this entire script and press Enter
 * 4. Run: await seedTestUsers()
 *
 * Test credentials after seeding:
 * - Admin Coopérative: +243970000001 / password123
 * - Livreur: +243970000002 / password123
 * - Admin Coop 2: +243970000003 / password123
 */

(async function() {
  // Configuration localforage (same as app)
  if (typeof localforage === 'undefined') {
    console.error('❌ localforage non disponible. Chargez d\'abord l\'application.');
    return;
  }

  localforage.config({
    driver: localforage.INDEXEDDB,
    name: 'HewAgriPOS',
    version: 1.0,
    storeName: 'pos_database',
    description: 'HewAgri POS Offline Storage'
  });

  const SEED_USERS = [
    {
      realid: 1,
      nom: "Mukwege",
      postnom: "Kivu",
      prenom: "Jean",
      phone: "+243970000001",
      email: "admin@kivugreen.cd",
      token: "", // Empty - user must log in to get real JWT token
      uuid: "uuid-coop-admin-1",
      roles: [{ id: 1, name: "COOP_ADMIN" }, { id: 2, name: "MANAGER" }],
      idcooperative: 1,
      typeaccount: 2,
      sexe: "M",
      avatar: "",
      lastlogin: new Date().toISOString(),
      chaine: JSON.stringify({ test: true }),
      crearedon: new Date().toLocaleString()
    },
    {
      realid: 2,
      nom: "Livreur",
      postnom: "Test",
      prenom: "Pierre",
      phone: "+243970000002",
      email: "livreur@kivugreen.cd",
      token: "", // Empty - user must log in to get real JWT token
      uuid: "uuid-livreur-1",
      roles: [{ id: 3, name: "LIVREUR" }],
      idcooperative: 1,
      typeaccount: 1,
      sexe: "M",
      avatar: "",
      lastlogin: new Date().toISOString(),
      chaine: JSON.stringify({ test: true }),
      crearedon: new Date().toLocaleString()
    },
    {
      realid: 3,
      nom: "Goma",
      postnom: "Nord",
      prenom: "Marie",
      phone: "+243970000003",
      email: "admin2@kivugreen.cd",
      token: "", // Empty - user must log in to get real JWT token
      uuid: "uuid-coop-admin-2",
      roles: [{ id: 1, name: "COOP_ADMIN" }],
      idcooperative: 2,
      typeaccount: 2,
      sexe: "F",
      avatar: "",
      lastlogin: new Date().toISOString(),
      chaine: JSON.stringify({ test: true }),
      crearedon: new Date().toLocaleString()
    }
  ];

  async function clearTestData() {
    const tables = ['__tbl_ecom_users__', '__tbl_ecom_cooperatives__'];
    for (const table of tables) {
      const idsKey = `${table}_ids`;
      const ids = (await localforage.getItem(idsKey)) || [];
      for (const id of ids) {
        await localforage.removeItem(`${table}_${id}`);
      }
      await localforage.setItem(idsKey, []);
    }
    console.log('🗑️ Données de test nettoyées');
  }

  async function seedTestUsers() {
    try {
      console.log('🌱 Démarrage du seed...');
      await localforage.ready();
      console.log('✅ localforage prêt');

      await clearTestData();

      for (const user of SEED_USERS) {
        const userKey = `__tbl_ecom_users__${user.uuid}`; // Use uuid as key since token is empty
        await localforage.setItem(userKey, user);

        const idsKey = '__tbl_ecom_users___ids';
        const ids = (await localforage.getItem(idsKey)) || [];
        if (!ids.includes(user.uuid)) {
          ids.push(user.uuid);
          await localforage.setItem(idsKey, ids);
        }

        const roleNames = user.roles.map(r => r.name).join(', ');
        console.log(`✅ ${user.prenom} ${user.nom} (${user.phone}) - ${user.typeaccount === 2 ? 'Admin Coop' : 'Livreur'} - Rôles: ${roleNames} - Coop: ${user.idcooperative}`);
      }

      console.log('\n🎉 Seed terminé avec succès !');
      console.log('\n📋 Identifiants de test (IndexedDB local) :');
      console.log('  👨‍💼 Admin Coopérative 1: +243970000001 / password123');
      console.log('  🚚 Livreur:             +243970000002 / password123');
      console.log('  👩‍💼 Admin Coopérative 2: +243970000003 / password123');
      console.log('\n✅ Ces utilisateurs existent AUSSI dans le backend MySQL');
      console.log('   - Admin Coop 1 & 2: Rôles 1,3 → /auth ✅ → typeaccount 2 (tabs)');
      console.log('   - Livreur: Rôle 5 → /authbank ❌ pour /auth (utiliser endpoint livreur)');
      console.log('\n💡 Utilisez ces numéros dans l\'écran de connexion POS');

      return true;
    } catch (error) {
      console.error('❌ Erreur lors du seed:', error);
      return false;
    }
  }

  async function checkUsers() {
    try {
      await localforage.ready();
      const ids = (await localforage.getItem('__tbl_ecom_users___ids')) || [];
      console.log(`\n📊 ${ids.length} utilisateur(s) en base:`);

      for (const id of ids) {
        const user = await localforage.getItem(`__tbl_ecom_users__${id}`);
        if (user) {
          const roleNames = user.roles?.map(r => r.name).join(', ') || 'aucun';
          console.log(`  - ${user.prenom} ${user.nom} (${user.phone}) - Type: ${user.typeaccount === 2 ? 'Admin' : 'Livreur'} - Rôles: ${roleNames} - Coop: ${user.idcooperative}`);
        }
      }
    } catch (error) {
      console.error('❌ Erreur vérification:', error);
    }
  }

  // Expose functions globally
  window.seedTestUsers = seedTestUsers;
  window.checkUsers = checkUsers;
  window.clearTestData = clearTestData;

  console.log('%c🌱 HewAgri POS Seed Script chargé', 'color: #2e7d32; font-size: 14px; font-weight: bold');
  console.log('Commandes disponibles:');
  console.log('  • await seedTestUsers()  - Créer les utilisateurs de test');
  console.log('  • checkUsers()           - Vérifier les utilisateurs existants');
  console.log('  • clearTestData()        - Nettoyer les données de test');
  console.log('\nExécutez: await seedTestUsers()');
})();