import axios from 'axios';
import { endpoint } from '../assets/configs/configs';
import { db } from './dbconnect/dbconnect';

import { OnInitialize, tbl_users } from './tables/tables';

OnInitialize(); // initialize tables and create them if not exist

axios.interceptors.request.use(
    config => {
        config.headers['x-ecommerce-mobkgreen-api'] = `Bearer ${global.token}`;
        return config;
    },
    error => Promise.reject(error)
);

axios.interceptors.response.use(
    response => response,
    error => {
        const er = error.response ? error.response : undefined;
        return er ? er : Promise.reject(error);
    }
);

export const timeout = 25000;

export const onRunInsertQRY = async ({ columns, dot, table, values, options }, cb) => {
    try {
        db.transaction(
            (tx) => {
                tx.executeSql(`insert into ${table} (${columns}) values (${dot})`, values);
                tx.executeSql(`select * from ${table}`, [], (_, { rows }) => {
                    const result = rows['_array'][0];
                    cb(undefined, result);
                });
            },
            (err) => {
                console.error('[communications] Insert transaction error:', err);
                cb(err, undefined);
            }
        );
    } catch (error) {
        console.error('[communications] onRunInsertQRY caught error:', error);
        return cb(error, undefined);
    }
};

export const onRunRawQRY = async ({ table, sql, options }, cb) => {
    try {
        db.transaction(
            (tx) => {
                tx.executeSql(`${sql}`, null,
                    (d => {
                        cb(undefined, d);
                    }), e => {
                        console.error('[communications] Raw query error:', e);
                        cb(e, undefined);
                    })
            }
        );
    } catch (error) {
        console.error('[communications] onRunRawQRY caught error:', error);
        return cb(error, undefined);
    }
};

export const onRunRemoveQRY = async ({ table, clause }, cb) => {
    try {
        // DELETE FROM `__tbl_users` WHERE `__tbl_users`.`id` = 1 » ?
        db.transaction(
            (tx) => {
                const sql = `delete from ${table} where id <> 0`;
                tx.executeSql(sql, null,
                    (line) => {
                        cb(undefined, 'done');
                    },
                    (err) => {
                        console.error('[communications] Delete error:', err);
                        cb(err, undefined);
                    }
                );
            });
    } catch (error) {
        console.error('[communications] onRunRemoveQRY caught error:', error);
        return cb(error, undefined);
    }
};

export const onRunRetrieveQRY = async ({ table, limit }, cb) => {
    limit = limit ? limit : 1;
    try {
        db.transaction(
            (tx) => {
                tx.executeSql(`select * from ${table} limit ${limit}`, [], (_, { rows }) => {
                    const result = rows['_array'] && rows['_array']['length'] ? rows['_array'] : [];
                    cb(undefined, result);
                }, (err) => {
                    console.error('[communications] Query error:', err);
                    cb(err, undefined);
                });
            },
            (err) => {
                console.error('[communications] Transaction error:', err);
                cb(err, undefined);
            }
        );
    } catch (error) {
        console.error('[communications] onRunRetrieveQRY caught error:', error);
        cb(error, undefined);
    }
};

export const onRunExternalRQST = async ({ url, data, method, params }, cb) => {
    const _url = endpoint.concat('/api').concat(url);
    try {
        await axios({
            timeout,
            params: params ? params : null,
            data: data ? data : null,
            method: method ? method : "GET",
            url: _url,
        })
            .then(res => {
                return cb(undefined, { ...res['data'] });
            })
            .catch(err => {
                console.error('[communications] External request error:', err?.message || err);
                return cb(err, undefined);
            });
    } catch (error) {
        console.error('[communications] onRunExternalRQST caught error:', error);
        return cb(error, undefined);
    }
};

export const onDeconnextion = async (cb) => {
    try {
        db.transaction(
            (tx) => {
                //   tx.executeSql(`delete from __tbl_t_historiques where id <> 0`, null);
                //   tx.executeSql(`delete from __tbl_t_surveys where id <> 0`, null);
                tx.executeSql(`delete from ${tbl_users} where id <> 0`, null);
            },
            err => {
                console.error('[communications] Deconnexion transaction error:', err);
                cb(err, undefined);
            },
            done => {
                cb(undefined, "done");
            },
            err => {
                console.error("[communications] Error on deconnexion => ", err);
            }
        );
    } catch (error) {
        console.error("[communications] onDeconnextion caught error:", error);
        cb(error, undefined);
    }
};