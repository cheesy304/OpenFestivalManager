import { db } from "./../../database";
import { LockType, Product } from "../../entity/Product";
import { Ingredient } from "../../entity/Ingredient";
import { Account, AccountType } from "../../entity/Account";
import { AppDataSource } from "../../data-source";
import express, { Express, Request, Response } from "express";
import { body, param, validationResult } from "express-validator";
import { createHash } from "crypto";
const router = express.Router();
import process from "process";
import { Station } from "../../entity/Station";
import { Category } from "../../entity/Category";
import { AlertType } from "../../entity/AlertType";
import { Variation } from "../../entity/Variation";
import { Table } from "../../entity/Table";
import { Session } from "../../entity/Session";
import { Order } from "../../entity/Order";
import { StateType } from "../../entity/State";
import { MoreThan, Not } from "typeorm";
import { TableGroup } from "../../entity/TableGroup";

/* GET categories */
router.get("/", (_req: Request, res: Response) => {
  AppDataSource.getRepository(Category)
    .find()
    .then((result) => {
      if (_req.session.account!.accounttype != AccountType.ADMIN) {
        res.set("Cache-control", `max-age=${process.env.REST_CACHE_TIME}`);
      }
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

/* GET products from category */
router.get(
  "/:cid/products",
  param("cid").isInt(),
  (req: Request, res: Response) => {
    if (!validationResult(req).isEmpty()) {
      res.sendStatus(400);
      return;
    }
    console.log(req.params.cid);
    AppDataSource.getRepository(Product)
      .find({
        relations: {
          category: true,
          ingredients: true,
          variations: true,
        },
        where: {
          category: {
            id: Number(req.params.cid),
          },
          productLock: Not(LockType.HIDDEN),
        },
        order: {
          list_priority: "DESC",
        },
      })
      .then((result) => {
        res.set("Cache-control", `max-age=${process.env.REST_CACHE_TIME}`);
        res.json(result);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(500);
      });
  }
);

/* Check session and accounttype \/\/\/\/\/\/\/\/ ADMIN SPACE \/\/\/\/\/\/ */
router.use(function (req, res, next) {
  if (
    req.session.account!.accounttype == AccountType.ADMIN
  ) {
    next();
  } else {
    console.log("rest/category/auth: unauthorized");
    res.sendStatus(403);
  }
});

/* PUT create category*/
router.put(
  "/",
  body("name").isString(),
  async (req: Request, res: Response) => {
    if (!validationResult(req).isEmpty()) {
      res.sendStatus(400);
      return;
    }
    const body = req.body;
    console.log("create new product categories request");
    console.log(body);
    // Create PC
    try {
      let pc = new Category(body.name);
      await AppDataSource.getRepository(Category).save(pc);
    } catch (e) {
      console.log("rest/categories/PUT new: Error" + e);
      res.sendStatus(500);
      return;
    }
    res.sendStatus(200);
  }
);

/* DELETE category*/
router.delete(
  "/:cid",
  param("cid").isInt(),
  async (req: Request, res: Response) => {
    if (!validationResult(req).isEmpty()) {
      res.sendStatus(400);
      return;
    }
    console.log("delete category request " + req.params.cid);
    // Create Payment Method
    try {
      let tmp = await AppDataSource.getRepository(Category).findOneOrFail({
        where: {
          id: Number(req.params.cid),
        },
      });
      await AppDataSource.getRepository(Category).remove(tmp);
    } catch (e) {
      console.log("rest/category/DELETE : Error" + e);
      res.sendStatus(500);
      return;
    }
    res.sendStatus(200);
  }
);

module.exports = router;
