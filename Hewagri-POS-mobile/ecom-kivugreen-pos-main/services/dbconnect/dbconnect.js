import { Platform } from 'react-native';

// Import conditionnel selon la plateforme
let db;

if (Platform.OS === 'web') {
  // Sur Web, utiliser l'adaptateur IndexedDB
  const webDb = require('./dbconnect.web').default;
  db = webDb;
} else {
  // Sur Native, utiliser SQLite
  import * as SQLite from "expo-sqlite";

  const openDatabase = () => {
    const database = SQLite.openDatabase("__db_balabala_mobile_app.db");
    return database;
  };

  db = openDatabase();
}

export const db = db;
export default db;