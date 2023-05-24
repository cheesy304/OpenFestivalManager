import "reflect-metadata";
import { DatabaseType, DataSource, DataSourceOptions } from "typeorm";

// Import Model
import { Account } from "./entity/Account";
import { Station } from "./entity/Station";
import { Alert } from "./entity/Alert";
import { AlertType } from "./entity/AlertType";
import { TableGroup } from "./entity/TableGroup";
import { Table } from "./entity/Table";
import { Product } from "./entity/Product";
import { Category } from "./entity/Category";
import { Variation } from "./entity/Variation";
import { Ingredient } from "./entity/Ingredient";
import { Bill } from "./entity/Bill";
import { Order } from "./entity/Order";
import { PaymentMethod } from "./entity/PaymentMethod";
import { Session } from "./entity/Session";
import { State } from "./entity/State";
import { ProductIngredient } from "./entity/ProductIngredient";

export let AppDataSourcep: DataSource;

export class ds {
  static async createADS(
    dbhost: string | undefined,
    port: number | undefined | string,
    user: string | undefined,
    password: string | undefined,
    dbname: string | undefined
  ): Promise<Boolean> {
    try {
      AppDataSourcep = new DataSource({
        type: "postgres",
        host: dbhost,
        port: Number(port),
        username: user,
        password: password,
        database: dbname,
        entities: [
          Account,
          Station,
          Alert,
          AlertType,
          Table,
          TableGroup,
          Category,
          Product,
          Variation,
          Ingredient,
          Bill,
          Order,
          PaymentMethod,
          Session,
          State,
          ProductIngredient,
        ],
        synchronize: true,
        logging: false,
      });

      await AppDataSource.initialize()
        .then(() => {
          // here you can start to work with your database
          console.log("[server]: Database initialized");
        })
    } catch (err) {
      console.log("[server]: Create DataSource failed, " + err);
      return false;
    }
    return true;
  }
  static async createADSFromFile(): Promise<Boolean> {
    return ds.createADS(process.env.DB_HOST, process.env.DB_PORT, process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_SCHEMA)
  }
}
export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: false,
  entities: [
    Account,
    Station,
    Alert,
    AlertType,
    Table,
    TableGroup,
    Category,
    Product,
    Variation,
    Ingredient,
    Bill,
    Order,
    PaymentMethod,
    Session,
    State,
    ProductIngredient,],
  migrations: [],
  subscribers: [],
})