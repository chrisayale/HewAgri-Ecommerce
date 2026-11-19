import * as SQLite from "expo-sqlite";

const openDatabase = () => {
    if (Platform.OS === "web") {
      return {
        transaction: () => {
          return {
            executeSql: () => {},
          };
        },
      };
    }
  
    const db = SQLite.openDatabase("__db_balabala_mobile_app.db");
    return db;
};

export const db = openDatabase();