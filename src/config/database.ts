import dotenv from "dotenv";
import pg from "pg";
dotenv.config();

const { Pool } = pg;

const configDatabase = {
  connectionString: process.env.DATABASE_URL
};

export const connection = new Pool(configDatabase);