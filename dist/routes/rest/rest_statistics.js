"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Account_1 = require("../../entity/Account");
const data_source_1 = require("../../data-source");
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
const process_1 = __importDefault(require("process"));
const Order_1 = require("../../entity/Order");
const typeorm_1 = require("typeorm");
/* Check session and accounttype*/
router.use(function (req, res, next) {
    if (req.session.account &&
        req.session.account.accounttype == Account_1.AccountType.ADMIN) {
        next();
    }
    else {
        console.log("rest/account/auth: unauthorized");
        res.sendStatus(401);
        return;
    }
});
/* GET all dates where a order was placed*/
/* If station id = -1 not filter for station*/
router.post("/dailyordersfromstation", (0, express_validator_1.body)("date").isISO8601(), (0, express_validator_1.body)("sid").isInt(), async (req, res) => {
    if (!(0, express_validator_1.validationResult)(req).isEmpty()) {
        res.sendStatus(400);
        return;
    }
    // Parse date range
    let beginDateRange = new Date(req.body.date);
    beginDateRange.setHours(0);
    beginDateRange.setMinutes(0);
    let endDateRange = new Date(req.body.date);
    endDateRange.setHours(23);
    endDateRange.setMinutes(59);
    console.log(beginDateRange);
    console.log(endDateRange);
    let result;
    try {
        // Check for station id
        if (req.body.sid == -1) {
            // Dont' filter for station
            result = await data_source_1.AppDataSource.getRepository(Order_1.Order).find({
                relations: {
                    // Load target station
                    product: {
                        producer: true,
                    },
                    states: true,
                },
                where: {
                    // Was created on that date
                    states: {
                        history: false,
                        created: (0, typeorm_1.Between)(beginDateRange, endDateRange),
                    },
                },
            });
        }
        else {
            result = await data_source_1.AppDataSource.getRepository(Order_1.Order).find({
                relations: {
                    // Load target station
                    product: {
                        producer: true,
                    },
                    states: true,
                },
                where: {
                    // Was created on that date
                    states: {
                        history: false,
                        created: (0, typeorm_1.Between)(beginDateRange, endDateRange),
                    },
                    // Target station
                    product: {
                        producer: {
                            id: Number(req.body.sid),
                        },
                    },
                },
            });
        }
        result.forEach((e) => e.getCurrentState());
        res.set("Cache-control", `max-age=${process_1.default.env.REST_CACHE_TIME}`);
        res.json(result);
    }
    catch (e) {
        console.log("rest/statistics/dailyordersfromstation GET/POST: " + e);
        res.sendStatus(500);
    }
});
module.exports = router;
