// ====================== Using dotenv library
require('dotenv').config()

// ====================== Mongo DB connection
require('./src/config/database.config')

const express = require('express')
const session = require('express-session');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require("cors")
const PORT = process.env.PORT;

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Session Login (Valid until 1 day)
app.use(
    session({
        secret: process.env.SESSION_SECRET_KEY,
        saveUninitialized: false,
        cookie: { maxAge: 1000 * 60 * 60 * 24 },
        resave: false,
    })
);

app.use(cookieParser());

// ======================= Router Call
const routes = require('./src/routes')
routes(app)

app.listen(PORT, () => {
    console.log("App listening on PORT: ", PORT)
})