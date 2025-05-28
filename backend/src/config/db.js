import {neon} from '@neondatabase/serverless';
import 'dotenv/config';

export const sql = neon(process.env.DATABASE_URL);

export async function initDB() {
    try {
        await sql`CREATE TABLE IF NOT EXISTS transactions (
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL (10,2) NOT NULL, 
            category VARCHAR(255) NOT NULL,
            created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`;
        // amount values (10,2): 8 digits before decimal, 2 after  (10 total)
        console.log('Database initialized successfully.');
    } catch (error) {
        console.log('Error initializing DATABESE:', error);
        process.exit(1); //status 1 means error, status 0 means success
    }
}