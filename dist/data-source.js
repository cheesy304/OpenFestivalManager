"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
// Import Model
const Account_1 = require("./entity/Account");
const Station_1 = require("./entity/Station");
const Alert_1 = require("./entity/Alert");
const AlertType_1 = require("./entity/AlertType");
const TableGroup_1 = require("./entity/TableGroup");
const Table_1 = require("./entity/Table");
const Product_1 = require("./entity/Product");
const Category_1 = require("./entity/Category");
const Variation_1 = require("./entity/Variation");
const Ingredient_1 = require("./entity/Ingredient");
const Bill_1 = require("./entity/Bill");
const Order_1 = require("./entity/Order");
const PaymentMethod_1 = require("./entity/PaymentMethod");
const Session_1 = require("./entity/Session");
const State_1 = require("./entity/State");
const ProductIngredient_1 = require("./entity/ProductIngredient");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "Pa..w0rd",
    database: "festivalmanager",
    entities: [Account_1.Account, Station_1.Station,
        Alert_1.Alert, AlertType_1.AlertType, Table_1.Table, TableGroup_1.TableGroup, Category_1.Category,
        Product_1.Product, Variation_1.Variation, Ingredient_1.Ingredient, Bill_1.Bill, Order_1.Order,
        PaymentMethod_1.PaymentMethod, Session_1.Session, State_1.State, ProductIngredient_1.ProductIngredient],
    synchronize: true,
    logging: false,
});