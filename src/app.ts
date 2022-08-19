import { AccountType } from './entity/Account';
import express, { Express, Request, Response } from 'express';
import { AppDataSource } from './data-source';
import dotenv from 'dotenv';
import path from 'path';
import sessions from 'express-session';
import { uid, suid } from 'rand-token';
import cookieParser from 'cookie-parser';
import { Account } from 'entity/Account';


// Add account data to session
declare module 'express-session' {
  interface SessionData {
    account: Account
  }
}

dotenv.config();


const app: Express = express();
const port = process.env.PORT;

if (process.env.DEVELOPMENT == "true") {
  console.log("Starting Server in Development Mode!!");
}

// view engine setup (express js)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Parse incoming cookies
app.use(cookieParser());

// Use public directory as root for web files
app.use(express.static(path.join(__dirname, 'public')));



// Session valid for 24h
const oneDay = 1000 * 60 * 60 * 24;
// Set session parameters
app.use(sessions({
    secret: uid(32), // Unique session token random generated
    saveUninitialized:true,   
  cookie: {
    maxAge: oneDay,
    secure: (process.env.DEVELOPMENT != "true")
  },
    resave: false 
}));

// Request Pre Routing
const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin');
const personalRouter = require('./routes/personal');
const tableRouter = require('./routes/table');
const stationRouter = require('./routes/station');
const restRouter = require('./routes/rest');

// Send requests for these paths to respective routing files
app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/personal', personalRouter);
app.use('/table', tableRouter);
app.use('/station', stationRouter);
app.use('/rest', restRouter);




app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ORM Mapper
// to initialize initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
AppDataSource.initialize()
    .then(() => {
        // here you can start to work with your database
        console.log("Database initialized")
    })
    .catch((error: Error) => console.log(error))