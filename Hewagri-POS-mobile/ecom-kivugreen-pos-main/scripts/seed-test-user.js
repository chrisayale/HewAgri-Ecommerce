// Seed script for creating test POS users in IndexedDB (web)
// Run this in the browser console at http://localhost:8083
// Or include in a test page

const SEED_USERS = [
  {
    // Cooperative admin user (typeaccount: 2)
    realid: 1,
    nom: "Mukwege",
    postnom: "Kivu",
    prenom: "Jean",
    phone: "+243970000001",
    email: "admin@kivugreen.cd",
    password: "password123", // Will be hashed by backend
    token: "test-token-coop-admin-1",
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
    // Livreur user (typeaccount: 1, role 3)
    realid: 2,
    nom: "Livreur",
    postnom: "Test",
    prenom: "Pierre",
    phone: "+243970000002",
    email: "livreur@kivugreen.cd",
    password: "password123",
    token: "test-token-livreur-1",
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
    // Cooperative admin for coop 2
    realid: 3,
    nom: "Goma",
    postnom: "Nord",
    prenom: "Marie",
    phone: "+243970000003",
    email: "admin2@kivugreen.cd",
    password: "password123",
    token: "test-token-coop-admin-2",
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

const COOPERATIVES = [
  {
    id: 1,
    name: "Coopérative KivuGreen Goma",
    code: "KVG-GOMA",
    address: "Goma, Nord-Kivu",
    phone: "+243970000000",
    email: "goma@kivugreen.cd",
    status: "active",
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: "Coopérative KivuGreen Bukavu",
    code: "KVG-BUKAVU",
    address: "Bukavu, Sud-Kivu",
    phone: "+243970000001",
    email: "bukavu@kivugreen.cd",
    status: "active",
    created_at: new Date().toISOString()
  }
];

async function seedIndexedDB() {
  // Wait for localforage to be ready
  if (typeof localforage === 'undefined') {
    console.error('localforage not available. Make sure the app is loaded first.');
    return;
  }

  try {
    await localforage.ready();
    console.log('localforage ready');

    // Clear existing test data
    await clearTestData();

    // Seed users
    for (const user of SEED_USERS) {
      const userKey = `__tbl_ecom_users__${user.token}`; // Using token as unique ID
      await localforage.setItem(userKey, user);

      // Update _ids array
      const idsKey = '__tbl_ecom_users___ids';
      const ids = (await localforage.getItem(idsKey)) || [];
      if (!ids.includes(user.token)) {
        ids.push(user.token);
        await localforage.setItem(idsKey, ids);
      }

      console.log(`Seeded user: ${user.prenom} ${user.nom} (${user.phone}) - typeaccount: ${user.typeaccount}`);
    }

    // Seed cooperatives (stored separately, fetched via API)
    // For testing, we'll also store in localforage for offline access
    for (const coop of COOPERATIVES) {
      const coopKey = `__tbl_ecom_cooperatives__${coop.id}`;
      await localforage.setItem(coopKey, coop);

      const idsKey = '__tbl_ecom_cooperatives___ids';
      const ids = (await localforage.getItem(idsKey)) || [];
      if (!ids.includes(coop.id.toString())) {
        ids.push(coop.id.toString());
        await localforage.setItem(idsKey, ids);
      }

      console.log(`Seeded cooperative: ${coop.name}`);
    }

    console.log('✅ Seed completed successfully!');
    console.log('You can now login with:');
    SEED_USERS.forEach(u => {
      console.log(`  - ${u.phone} / password123 (typeaccount: ${u.typeaccount}, coop: ${u.idcooperative})`);
    });

  } catch (error) {
    console.error('Seed failed:', error);
  }
}

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

  console.log('Cleared existing test data');
}

// Auto-run if in browser console
if (typeof window !== 'undefined') {
  window.seedIndexedDB = seedIndexedDB;
  window.clearTestData = clearTestData;
  console.log('Seed functions available: window.seedIndexedDB(), window.clearTestData()');
}

// Export for module usage
if (typeof module !== 'undefined') {
  module.exports = { seedIndexedDB, clearTestData, SEED_USERS, COOPERATIVES };
}