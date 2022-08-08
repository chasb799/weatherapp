const express = require("express");
const router = express.Router();

const home = require("./controllers/home.js");
const dashboard = require("./controllers/dashboard.js");
const station = require("./controllers/station.js");
const accounts = require("./controllers/accounts.js");
const auth = require("./utils/auth.js");

router.get("/", home.index);
router.get("/dashboard", auth.protected, dashboard.index);
router.get("/station/:id", auth.protected, station.index);

router.post("/dashboard/addstation", auth.protected, dashboard.addStation);
router.get("/dashboard/deletestation/:id", auth.protected, dashboard.deleteStation);
router.post("/station/:id/addweather", auth.protected, station.addWeather);
router.post("/station/:id/addautoweather/:lat/:lon", auth.protected, station.addAutoWeather);
router.get("/station/:id/deleteweather/:weatherid", auth.protected, station.deleteWeather);

router.get("/login", accounts.login);
router.get("/logout", accounts.logout);
router.get("/signup", accounts.signup);
router.post("/register", accounts.register);
router.post("/authenticate", accounts.authenticate);

module.exports = router;
