const logger = require("../utils/logger.js");
const stationStore = require("../models/station-store.js");
const weatherStore = require("../models/weather-store");
const convert = require("../utils/convert");
const axios = require("axios");

const station = {
    async index(request, response) {
        const stationId = request.params.id;
        const Station = await stationStore.getStation(stationId);
        const allWeather = await weatherStore.getWeatherForStation(stationId);
        let currWeather = await weatherStore.getCurrentWeatherForStation(stationId);
        let maxValues = {};
        let minValues = {};

        if(currWeather) {
            // convert weather code and wind direction
            currWeather.wetter = convert.codeToWeather(Number(currWeather.wetter));
            currWeather.windrichtung = convert.degreeToDirection(Number(currWeather.windrichtung));

            // add current weather trends for temperature, wind and air pressure
            let measures = await weatherStore.getLastTwoMeasurements(stationId);

            // check if there are zero, one or two entries in the database
            if (measures.length === 0) {
                currWeather.temperatur = {value: "Error", trend: "bi bi-x-circle"};
                currWeather.wind = {value: "Error", trend: "bi bi-x-circle"};
                currWeather.luftdruck = {value: "Error", trend: "bi bi-x-circle"};
            } else if (measures.length === 1) {
                currWeather.temperatur = {value: currWeather.temperatur + " Grad", trend: "bi bi-x-circle"};
                currWeather.wind = {value: currWeather.wind + " bft", trend: "bi bi-x-circle"};
                currWeather.luftdruck = {value: currWeather.luftdruck.toString() + " hpa", trend: "bi bi-x-circle"};
            } else {
                let trends = convert.trendForStation(measures[0], measures[1]);
                currWeather.temperatur = {value: currWeather.temperatur + " Grad", trend: trends.temperatur};
                currWeather.wind = {value: currWeather.wind + " bft", trend: trends.wind};
                currWeather.luftdruck = {value: currWeather.luftdruck.toString() + " hpa", trend: trends.luftdruck};
            }

            // maximum and minimum measurements for temperature, wind and air pressure
            maxValues = await weatherStore.getMaxValuesForStation(stationId);
            minValues = await weatherStore.getMinValuesForStation(stationId);
        }
        else{
            currWeather = {
                id: -1,
                wetter: {text: "", icon: ""},
                temperatur: {value: "", trend: ""},
                wind: {value: "", trend: ""},
                luftdruck: {value: "", trend: ""},
                station_id: stationId,
                zeitpunkt: "",
                windrichtung: ""
            };
            maxValues = { max_temperatur: "", max_wind: "", max_luftdruck: ""};
            minValues = { min_temperatur: "", min_wind: "", min_luftdruck: ""};
        }

        logger.info('Station id = ' + stationId);
        const viewData = {
            title: 'Station',
            station: Station,
            weather: allWeather,
            currentWeather: currWeather,
            maxVal: maxValues,
            minVal: minValues
        };
        response.render('station', viewData);
    },

    async addWeather(request, response){
        const stationId = request.params.id;
        const newWeather = {
            code: Number(request.body.code),
            temperature: Number(request.body.temp),
            wind: Number(request.body.windspeed),
            wind_dir: Number(request.body.winddir),
            air_pressure: Number(request.body.airpressure)
        };
        logger.debug("New weather", newWeather);
        await weatherStore.addWeather(stationId, newWeather);
        response.redirect("/station/" + stationId);
    },

    async addAutoWeather(request, response){
        const stationId = request.params.id;
        const lat = request.params.lat;
        const lon = request.params.lon;
        const oneCallRequest = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=371cfa3ce9d9c31c12fdc41b07216d81`;
        let newWeather = {};
        const result = await axios.get(oneCallRequest);

        if (result.status === 200) {
            const reading = result.data.current;
            newWeather.code = Number(reading.weather[0].id);
            newWeather.temperature = Number(reading.temp);
            newWeather.wind = Number(reading.wind_speed);
            newWeather.wind_dir = Number(reading.wind_deg);
            newWeather.air_pressure = Number(reading.pressure);
        }

        logger.debug("New Weather", newWeather);
        await weatherStore.addWeather(stationId, newWeather);
        response.redirect("/station/" + stationId);
    },

    async deleteWeather(request, response){
        const stationId = request.params.id;
        const weatherId = request.params.weatherid;
        await weatherStore.removeWeather(weatherId);
        logger.debug("Deleting weather", weatherId);
        response.redirect("/station/" + stationId);
    }
};

module.exports = station;

