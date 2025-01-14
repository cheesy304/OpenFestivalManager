import { PaymentMethod } from './../entity/PaymentMethod';
import { Category } from './../entity/Category';
import { TableGroup } from "../entity/TableGroup";
import { AccountType } from "../entity/Account";
import { AppDataSource } from "../data-source";
import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { Account } from "../entity/Account";
import { createHash } from "crypto";
import mysqldump from "mysqldump";
import multer from "multer";
import { db }  from "../database";
import { Order } from "../entity/Order";
import { State } from "../entity/State";
import { Table } from "../entity/Table";
let upload = multer({ dest: "uploads/" });
const router = express.Router();

/* Check session and accounttype*/
router.use(function (req, res, next) {
  if (req.url.includes("login")) {
    next();
  } else {
    if (req.session.account && req.session.account!.accounttype == AccountType.ADMIN) {
      next();
    } else {
        console.log("admin/auth: unauthorized, redirecting to login")
      res.redirect("/admin/login");
      return;
    }
  }
});

/* GET main admin page */
router.get("/", async (_req: Request, res: Response) => {
  res.render("admin/admin", {
    uptime: process.uptime() | 0,
    db_a: AppDataSource.isInitialized,
  });
});

router.post("/", async (req, res, _next) => {
  // store all the user input data
  const body = req.body;

  /* Logout admin session*/
  if (body.logout) {
    req.session.destroy(function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("admin/logout: session destroyed");
      }
    });
    res.redirect("/admin/login");
    return;
  }

  res.redirect("/admin"); // redirect to user form page after inserting the data
});

/* GET login page. */
router.get("/login", (req: Request, res: Response) => {
  if (req.session.account?.accounttype == AccountType.ADMIN) {
    // Redirect tp mainpage if admin session exists
    res.redirect("/admin");
  } else {
    res.render("admin/admin_login", { err: false });
  }
});

/* POST login page */
router.post(
  "/login",
  body("username").isString(),
  body("password").isString(),
  async (req: Request, res: Response) => {
    if (!validationResult(req).isEmpty()) {
      res.sendStatus(400);
      return;
    }

    // Check if there are admin users in the db
    const userCountQuery = AppDataSource.getRepository(Account)
      .createQueryBuilder("account")
      .where("account.accounttype = :at", { at: AccountType.ADMIN })
      .getCount();
    const count = await userCountQuery;

    // Default login if no admin user is present
    if (count == 0) {
      console.log(
        "No admin user found. Enabling INSECURE default access. Please add a user."
      );
      if (req.body.username == "admin" && req.body.password == "admin") {
        let a = new Account();
        a.accounttype = AccountType.ADMIN;
        a.id = -1;
        req.session.account=a;
        res.redirect("/admin");
        return;
      }
    }
    // Hash password
    const hash = createHash("sha256");
    hash.update(req.body.password);

    // Search for user
    const user = await AppDataSource.getRepository(Account).findOneBy({
      name: req.body.username,
      hash: hash.digest("hex"),
    });

    // User not found and check if user is allowed to login
    if (user == null || !user.loginAllowed) {
      res.render("admin/admin_login", { err: true });
      return;
    }

    // Save user data to session
    req.session.account=user;
    res.redirect("/admin");
  }
);

/* GET statistics page */
router.get("/statistics", async (_req, res) => {
  res.render("admin/admin_statistics_vue");
});

/* GET configuration page */
router.get("/configuration", async (req, res) => {
  res.render("admin/admin_configuration.ejs");
});

/* GET orderdata page */
router.get("/orderdata", async function (_req, res) {
  res.render("admin/admin_orderdata_vue");
});

/*
router.get('/error', function (req, res) {
  res.render("error", {error: "test"});
});*/

module.exports = router;
