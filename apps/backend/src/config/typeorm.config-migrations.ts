import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import { config } from "dotenv";
import { SeederOptions } from "typeorm-extension";

config();

const options = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? "5432"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  entities: ["src/database/entities/*.orm-entity.{js,ts}"],
  migrations: ["src/database/migrations/*-migrate.{js,ts}"],
  seeds: ["src/database/seeds/*.seed.{ts,js}"],
  migrationsRun: false,
  logging: true,
};

const AppDataSource = new DataSource(
  options as DataSourceOptions & SeederOptions
);

export default AppDataSource;
