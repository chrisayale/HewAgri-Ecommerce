import { Sequelize } from "sequelize";
import Database from "./database";

const database = Database.getInstance();
const { dbName, username, password, logging, dialect, host, port, timeZone } = database;

export const connect = new Sequelize(
    dbName,
    username,
    password, {
    port,
    host,
    dialect,
    logging: false,
    timezone: timeZone,
    retry: {
        match: [/Deadlock/i],
        max: 3,
        backoffBase: 1000,
        backoffExponent: 1.5
    },
    pool: {
        max: 50,
        min: 0,
        acquire: 1000000,
        idle: 200000
    }
}
);

// Export connection function for explicit startup
export async function initializeDatabase(): Promise<void> {
    try {
        await connect.authenticate();
        console.log(`✅ Connected successfully to database: ${dbName} on port ${port}`);

        // Optional: Sync models in development (skip if there are data issues)
        if (process.env.NODE_ENV !== 'production' && process.env.SYNC_MODELS === 'true') {
            try {
                await connect.sync({ alter: true });
                console.log("✅ Models synchronized successfully to DB");
            } catch (syncError: unknown) {
                const errorMessage = syncError instanceof Error ? syncError.message : String(syncError);
                console.warn("⚠️ Model sync failed (continuing anyway):", errorMessage);
            }
        }
    } catch (error) {
        console.error(`❌ Failed to connect to database: ${error}`);
        throw error;
    }
}

// Export function to run startup seed after models are loaded
export async function runStartupSeedIfEnabled(): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
        console.log('[Startup Seed] Skipping startup seed in production environment');
        return;
    }

    try {
        const { runStartupSeed } = await import('../__seeders/startup.seed');
        await runStartupSeed();
    } catch (seedError) {
        console.error('⚠️ Startup seed failed (non-blocking):', seedError);
        // Don't throw - allow app to continue even if seed fails
    }
}
