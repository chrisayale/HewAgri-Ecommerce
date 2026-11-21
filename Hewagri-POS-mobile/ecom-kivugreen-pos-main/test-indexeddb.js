// Test script to simulate the login flow and IndexedDB insertion
const localforage = require('localforage');
const axios = require('axios');

localforage.config({
  driver: localforage.INDEXEDDB,
  name: 'HewAgriPOS',
  version: 1.0,
  storeName: 'pos_database',
  description: 'HewAgri POS Offline Storage'
});

async function testLoginFlow() {
  try {
    await localforage.ready();
    console.log('✅ localforage ready');
    
    // 1. Call auth API
    console.log('\n📡 Calling auth API...');
    const authResponse = await axios.post('http://localhost:3002/api/users/user/auth', {
      phone: '+243811111112',
      password: 'admin123'
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log('✅ Auth response status:', authResponse.data.status);
    console.log('📦 Auth response data keys:', Object.keys(authResponse.data.data));
    console.log('👤 User data:', {
      id: authResponse.data.data.user.id,
      nom: authResponse.data.data.user.nom,
      phone: authResponse.data.data.user.phone,
      id_cooperative: authResponse.data.data.user.id_cooperative,
      roles: authResponse.data.data.user.__tbl_ecom_roles?.map(r => r.id)
    });
    
    const { user, token } = authResponse.data.data;
    const { nom, id, postnom, prenom, phone, lastlogin, uuid, sexe, hectare_cultive, date_naiss, __tbl_ecom_roles, avatar, email, id_cooperative } = user;
    const roles = Array.from(__tbl_ecom_roles).map(r => r && r['id']);
    const hasCooperative = !isNaN(id_cooperative);
    const isLivreur = roles.includes(3);
    const isCoopAdmin = hasCooperative && (roles.includes(2) || roles.includes(1));
    const typeaccount = isCoopAdmin ? 2 : 1;
    const cooperativeId = isCoopAdmin ? id_cooperative : 0;
    
    console.log('\n🔐 Parsed user info:', {
      id, nom, phone, id_cooperative, roles, hasCooperative, isLivreur, isCoopAdmin, typeaccount, cooperativeId
    });
    
    // 2. Clear existing users
    console.log('\n🗑️ Clearing existing users...');
    const table = '__tbl_ecom_users__';
    const ids = (await localforage.getItem(table + '_ids')) || [];
    for (const idKey of ids) {
      await localforage.removeItem(table + '_' + idKey);
    }
    await localforage.setItem(table + '_ids', []);
    console.log('✅ Cleared');
    
    // 3. Insert user
    console.log('\n💾 Inserting user into IndexedDB...');
    const columns = ['id', 'realid', 'nom', 'postnom', 'prenom', 'token', 'phone', 'email', 'lastlogin', 'uuid', 'avatar', 'idcooperative', 'chaine', 'crearedon', 'sexe', 'roles', 'typeaccount'];
    const values = [
      `${id}`, `${id}`, `${nom}`, `${postnom}`, `${prenom}`, `${token}`, `${phone}`, `${email}`, 
      `${lastlogin}`, `${uuid}`, `${avatar}`, `${cooperativeId}`, 
      `${JSON.stringify(authResponse.data.data)}`, `${new Date().toLocaleString()}`, `${sexe}`, 
      `${JSON.stringify(roles)}`, `${typeaccount}`
    ];
    
    const record = {};
    columns.forEach((col, i) => {
      record[col] = values[i];
    });
    
    console.log('📝 Record to insert:', JSON.stringify(record, null, 2).substring(0, 500) + '...');
    
    await localforage.setItem(table + '_' + record.id, record);
    
    const newIds = (await localforage.getItem(table + '_ids')) || [];
    if (!newIds.includes(record.id)) {
      newIds.push(record.id);
      await localforage.setItem(table + '_ids', newIds);
    }
    
    console.log('✅ Inserted with ID:', record.id);
    
    // 4. Verify insertion
    console.log('\n🔍 Verifying insertion...');
    const insertedRecord = await localforage.getItem(table + '_' + record.id);
    console.log('📖 Retrieved record:', insertedRecord ? 'FOUND' : 'NOT FOUND');
    if (insertedRecord) {
      console.log('   - id:', insertedRecord.id);
      console.log('   - realid:', insertedRecord.realid);
      console.log('   - nom:', insertedRecord.nom);
      console.log('   - phone:', insertedRecord.phone);
      console.log('   - idcooperative:', insertedRecord.idcooperative);
      console.log('   - typeaccount:', insertedRecord.typeaccount);
      console.log('   - roles:', insertedRecord.roles);
    }
    
    // 5. Test SELECT query simulation
    console.log('\n🔎 Simulating SELECT * FROM table WHERE id = ?...');
    const selectResult = await localforage.getItem(table + '_' + id);
    console.log('   Result:', selectResult ? 'FOUND' : 'NOT FOUND');
    
    console.log('\n✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('   Response:', error.response.data);
    }
  }
}

testLoginFlow();
