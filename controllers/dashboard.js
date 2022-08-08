const logger = require("../utils/logger.js");
const stationStore = require("../models/station-store.js");
const weatherStore = require("../models/weather-store.js");
const accounts = require("./accounts.js");
const convert = require("../utils/convert.js");

const dashboard = {
    async index(request, response) {
        const loggedInUser = await accounts.getCurrentUser(request);
        const Stations = await stationStore.getAllStationsForUser(loggedInUser.id);
        for(let station of Stations){
            station.currWeather = await weatherStore.getCurrentWeatherForStation(station.id);
            if(station.currWeather){
                // convert weather code and wind direction
                station.currWeather.wetter = convert.codeToWeather(Number(station.currWeather.wetter));
                station.currWeather.windrichtung = convert.degreeToDirection(Number(station.currWeather.windrichtung));

                // add current weather trends for temperature, wind and air pressure
                let measures = await weatherStore.getLastTwoMeasurements(station.id);

                // check if there are zero, one or two entries in the database
                if (measures.length === 0) {
                    station.currWeather.temperatur = {value: "Error", trend: "bi bi-x-circle"};
                    station.currWeather.wind = {value: "Error", trend: "bi bi-x-circle"};
                    station.currWeather.luftdruck = {value: "Error", trend: "bi bi-x-circle"};
                } else if (measures.length === 1) {
                    station.currWeather.temperatur = {
                        value: station.currWeather.temperatur + " Grad",
                        trend: "bi bi-x-circle"
                    };
                    station.currWeather.wind = {
                        value: station.currWeather.wind + " bft",
                        trend: "bi bi-x-circle"
                    };
                    station.currWeather.luftdruck = {
                        value: station.currWeather.luftdruck.toString() + " hpa",
                        trend: "bi bi-x-circle"
                    };
                } else {
                    let trends = convert.trendForStation(measures[0], measures[1]);
                    station.currWeather.temperatur = {
                        value: station.currWeather.temperatur + " Grad",
                        trend: trends.temperatur
                    };
                    station.currWeather.wind = {
                        value: station.currWeather.wind + " bft",
                        trend: trends.wind
                    };
                    station.currWeather.luftdruck = {
                        value: station.currWeather.luftdruck.toString() + " hpa",
                        trend: trends.luftdruck
                    };
                }

                // get max values for temperature, wind and air pressure
                station.maxValues = await weatherStore.getMaxValuesForStation(station.id);
                station.minValues = await weatherStore.getMinValuesForStation(station.id);
            }
            else {
                station.currWeather = {
                    id: -1,
                    wetter: {text: "", icon: ""},
                    temperatur: {value: "", trend: ""},
                    wind: {value: "", trend: ""},
                    luftdruck: {value: "", trend: ""},
                    station_id: station.id,
                    zeitpunkt: "",
                    windrichtung: "",
                    wind_dir: ""
                };
                station.maxValues = {max_temperatur: "", max_wind: "", max_luftdruck: ""};
                station.minValues = {min_temperatur: "", min_wind: "", min_luftdruck: ""};
            }
        }
        const viewData = {
            title: "Dashboard Weathertop",
            stations: Stations,
        };
        logger.info("About to render", Stations);
        response.render("dashboard", viewData);
    },

    async addStation(request, response){
        const loggedInUser = await accounts.getCurrentUser(request);
        const newStation = {
            name: request.body.name,
            latitude: Number(request.body.lat),
            longitude: Number(request.body.lon),
            user_email: loggedInUser.id
        };
        logger.debug("Creating a new station", newStation);
        await stationStore.addStation(newStation);
        response.redirect("/dashboard");
    },

    async deleteStation(request, response){
        const stationId = request.params.id;
        logger.debug("Deleting station", stationId);
        await stationStore.removeStation(stationId);
        response.redirect("/dashboard");
    }
};

module.exports = dashboard;

