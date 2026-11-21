import localforage from 'localforage';
import { Platform } from 'react-native';

if (Platform.OS === 'web') {
  localforage.config({
    driver: localforage.INDEXEDDB,
    name: 'HewAgriPOS',
    version: 1.0,
    storeName: 'pos_database',
    description: 'HewAgri POS Offline Storage'
  });
}

class WebDatabase {
  constructor() {
    this.ready = false;
    this.initPromise = this.initialize();
  }

  async initialize() {
    if (Platform.OS !== 'web') return;
    try {
      await Promise.race([
        localforage.ready(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('localforage.ready() timeout')), 10000))
      ]);
      this.ready = true;
    } catch (error) {
      console.error('[WebDB] Failed to initialize IndexedDB:', error);
      this.ready = true; // Still mark as ready to avoid hanging
    }
  }

  transaction(callback, errorCb, successCb) {
    if (Platform.OS !== 'web') {
      return {
        executeSql: (sql, params, successCb, errorCb) => {}
      };
    }

    // Track promises from executeSql calls to wait for all of them
    const executeSqlPromises = [];

    const tx = {
      executeSql: (sql, params = [], successCb, errorCb) => {
        const promise = this.executeWebSQL(sql, params)
          .then(result => {
            if (successCb) successCb(null, result);
            return result;
          })
          .catch(error => {
            console.error('[WebDB] executeSql error:', error);
            if (errorCb) errorCb(error);
            throw error;
          });
        executeSqlPromises.push(promise);
        return promise;
      }
    };

    // Execute the transaction callback with the transaction object
    try {
      const result = callback(tx);
      // Wait for all executeSql promises to complete
      Promise.all(executeSqlPromises)
        .then(() => {
          if (successCb) successCb(result);
        })
        .catch(err => {
          console.error('[WebDB] Transaction error:', err);
          if (errorCb) errorCb(err);
        });
    } catch (error) {
      console.error('[WebDB] Transaction callback error:', error);
      if (errorCb) errorCb(error);
    }
  }

  async executeWebSQL(sql, params = []) {
    await this.initPromise;
    const lowerSql = sql.toLowerCase().trim();

    if (lowerSql.startsWith('create table')) {
      // Extract table name and initialize _ids array for it
      // Match table name including underscores and special chars (e.g., __tbl_ecom_users__)
      const tableMatch = sql.match(/create table\s+(?:if not exists\s+)?([`"']?)([\w_$]+)\1/i);
      if (tableMatch) {
        const table = tableMatch[2];
        const idsKey = table + '_ids';
        const existingIds = await localforage.getItem(idsKey);
        if (!existingIds) {
          await localforage.setItem(idsKey, []);
        }
      }
      return { rowsAffected: 0, insertId: 0 };
    }

    if (lowerSql.startsWith('insert into')) {
      // Match table name including underscores and special chars
      const tableMatch = sql.match(/insert into\s+([`"']?)([\w_$]+)\1/i);
      const table = tableMatch ? tableMatch[2] : 'unknown';

      const columnsMatch = sql.match(/\(([^)]+)\)/);
      const valuesMatch = sql.match(/values\s*\(([^)]+)\)/i);

      let record = {};
      if (columnsMatch && valuesMatch) {
        const columns = columnsMatch[1].split(',').map(c => c.trim().replace(/^['"`]+|['"`]+$/g, ''));
        const values = valuesMatch[1].split(',').map(v => v.trim().replace(/^['"`]+|['"`]+$/g, ''));
        columns.forEach((col, i) => {
          record[col] = params[i] !== undefined ? params[i] : values[i];
        });
      } else if (params.length > 0) {
        // If params is an array of values, try to map to expected columns
        // For now, assume first param might be the record object or use timestamp
        if (typeof params[0] === 'object' && params[0] !== null) {
          record = params[0];
        } else {
          record = { id: Date.now().toString() };
        }
      }

      // Ensure we have an id - use realid if available, otherwise generate
      if (!record.id) {
        record.id = record.realid || Date.now().toString();
      }

      await localforage.setItem(table + '_' + record.id, record);

      const ids = (await localforage.getItem(table + '_ids')) || [];
      if (!ids.includes(record.id)) {
        ids.push(record.id);
        await localforage.setItem(table + '_ids', ids);
      }

      return { rowsAffected: 1, insertId: record.id };
    }

    if (lowerSql.startsWith('select * from')) {
      // Match table name including underscores and special chars
      const tableMatch = sql.match(/from\s+([`"']?)([\w_$]+)\1/i);
      const table = tableMatch ? tableMatch[2] : 'unknown';

      const limitMatch = sql.match(/limit\s+(\d+)/i);
      const limit = limitMatch ? parseInt(limitMatch[1]) : 1000;

      const idsKey = table + '_ids';
      const ids = (await localforage.getItem(idsKey)) || [];
      const rows = [];

      for (const id of ids.slice(0, limit)) {
        const record = await localforage.getItem(table + '_' + id);
        if (record) rows.push(record);
      }

      return { rows: { _array: rows, length: rows.length } };
    }

    if (lowerSql.includes('where') && !lowerSql.startsWith('update') && !lowerSql.startsWith('delete from')) {
      const tableMatch = sql.match(/from\s+([`"']?)([\w_$]+)\1/i);
      const table = tableMatch ? tableMatch[2] : 'unknown';

      const whereMatch = sql.match(/where\s+(.+)$/i);
      if (whereMatch) {
        const condition = whereMatch[1];
        const ids = (await localforage.getItem(table + '_ids')) || [];
        const rows = [];

        for (const id of ids) {
          const record = await localforage.getItem(table + '_' + id);
          if (record && this.matchCondition(record, condition, params)) {
            rows.push(record);
          }
        }

        return { rows: { _array: rows, length: rows.length } };
      }
    }

    if (lowerSql.startsWith('update')) {
      const tableMatch = sql.match(/update\s+([`"']?)([\w_$]+)\1/i);
      const table = tableMatch ? tableMatch[2] : 'unknown';

      const setMatch = sql.match(/set\s+(.+?)\s+where/i);
      const whereMatch = sql.match(/where\s+(.+)$/i);

      if (whereMatch) {
        const ids = (await localforage.getItem(table + '_ids')) || [];
        let updated = 0;

        for (const id of ids) {
          const record = await localforage.getItem(table + '_' + id);
          if (record && this.matchCondition(record, whereMatch[1], params)) {
            if (setMatch) {
              const sets = setMatch[1].split(',');
              sets.forEach(set => {
                const [key, value] = set.split('=').map(s => s.trim());
                record[key] = value.replace(/['"]/g, '');
              });
            }
            await localforage.setItem(table + '_' + id, record);
            updated++;
          }
        }

        return { rowsAffected: updated };
      }
    }

    if (lowerSql.startsWith('delete from')) {
      const tableMatch = sql.match(/delete from\s+([`"']?)([\w_$]+)\1/i);
      const table = tableMatch ? tableMatch[2] : 'unknown';

      const whereMatch = sql.match(/where\s+(.+)$/i);
      if (whereMatch) {
        const ids = (await localforage.getItem(table + '_ids')) || [];
        const newIds = [];
        let deleted = 0;

        for (const id of ids) {
          const record = await localforage.getItem(table + '_' + id);
          if (record && this.matchCondition(record, whereMatch[1], params)) {
            await localforage.removeItem(table + '_' + id);
            deleted++;
          } else {
            newIds.push(id);
          }
        }

        await localforage.setItem(table + '_ids', newIds);
        return { rowsAffected: deleted };
      }
    }

    return { rowsAffected: 0 };
  }

  matchCondition(record, condition, params) {
    try {
      let parsedCondition = condition;
      if (params && params.length > 0) {
        params.forEach(param => {
          parsedCondition = parsedCondition.replace('?', typeof param === 'string' ? "'" + param + "'" : param);
        });
      }

      const keys = Object.keys(record);
      let evalStr = parsedCondition;
      keys.forEach(key => {
        const regex = new RegExp('\\b' + key + '\\b', 'g');
        evalStr = evalStr.replace(regex, 'record.' + key);
      });

      evalStr = evalStr
        .replace(/=/g, '==')
        .replace(/<>/g, '!=')
        .replace(/IS NULL/g, '== null')
        .replace(/IS NOT NULL/g, '!= null');

      return eval(evalStr);
    } catch (e) {
      console.warn('[WebDB] Condition evaluation failed:', e);
      return false;
    }
  }

  async clearTable(table) {
    if (Platform.OS !== 'web') return;
    const ids = (await localforage.getItem(table + '_ids')) || [];
    for (const id of ids) {
      await localforage.removeItem(table + '_' + id);
    }
    await localforage.setItem(table + '_ids', []);
  }

  async getAll(table) {
    if (Platform.OS !== 'web') return [];
    const ids = (await localforage.getItem(table + '_ids')) || [];
    const rows = [];
    for (const id of ids) {
      const record = await localforage.getItem(table + '_' + id);
      if (record) rows.push(record);
    }
    return rows;
  }
}

const webDb = new WebDatabase();
export const db = Platform.OS === 'web' ? webDb : null;
export default webDb;