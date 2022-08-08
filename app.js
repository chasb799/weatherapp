const express = require("express");
const logger = require("./utils/logger");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const session = require("express-session");

// load variables from .env
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.static("static"));
app.use(bodyParser.urlencoded({extended: false}));

app.use(session({
    secret: "This is a secret!",
    cookie: {
        maxAge: 3600000
    },
    resave: false,
    saveUninitialized: false
}));

app.engine('.hbs', handlebars.engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', './views');

const routes = require("./routes");
app.use("/", routes);

app.listen(process.env.PORT, () => {
    console.log(`Weatherapp listening on Port ${process.env.PORT}`);
});

module.exports = app;
