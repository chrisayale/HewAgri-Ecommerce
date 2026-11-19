import * as SQLite from "expo-sqlite";
import { db } from '../dbconnect/dbconnect';

export const tbl_users = '__tbl_ecom_users__';
export const tbl_historiques = '__tbl_ecom_histories__';

export const OnInitialize = () => {

    // ====== table user
    const __tbl_users = () => {
        db.transaction((tx) => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS ${tbl_users} (
                    id integer primary key not null,
                    realid integer not null,
                    avatar varchar(100) NOT NULL,
                    postnom varchar(100) NOT NULL,
                    prenom varchar(100) NOT NULL,
                    nom varchar(255) NOT NULL,
                    phone varchar(60) NOT NULL,
                    email varchar(60) NOT NULL,
                    token varchar(255) NOT NULL,
                    sexe varchar(60) NOT NULL,
                    uuid varchar(100) NOT NULL,
                    roles varchar(100) NOT NULL,
                    lastlogin varchar(100) NOT NULL,
                    idcooperative int NOT NULL,
                    typeaccount int NOT NULL,
                    chaine varchar(255) NOT NULL,
                    crearedon varchar(60) NOT NULL
                )`
            )
        })
    };
    __tbl_users();
}


