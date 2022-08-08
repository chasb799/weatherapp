const dataStore = require("./data-store.js");
const dataStoreClient = dataStore.getDataStore();
const logger = require("../utils/logger.js");

const weatherStore = {
    async getWeatherForStation(stationId) {
        const query = 'SELECT * FROM weathertop_weather WHERE station_id=$1 ORDER BY id DESC';
        const values = [stationId];
        try {
            let result = await dataStoreClient.query(query, values);
            return result.rows;
        } catch (e) {
            logger.error("Error fetching weather for station" ,e);
        }
    },

    async getCurrentWeatherForStation(stationId){
        const query = 'SELECT * FROM weathertop_weather WHERE station_id=$1 ORDER BY id DESC';
        const values = [stationId];
        try{
            let result = await dataStoreClient.query(query, values);
            return result.rows[0];
        } catch(e){
            logger.error("Error fetching current weather for station", e);
        }
    },

    async addWeather(stationId, newWeather){
        const query = 'INSERT INTO weathertop_weather (wetter, temperatur, wind, luftdruck, station_id, windrichtung) VALUES ($1, $2, $3, $4, $5, $6)';
        const values = [newWeather.code, newWeather.temperature, newWeather.wind, newWeather.air_pressure, stationId, newWeather.wind_dir];
        try{
            await dataStoreClient.query(query, values);
        } catch(e){
            logger.error("Error adding new Weather", e);
        }
    },

    async removeWeather(weatherId){
        const query = 'DELETE FROM weathertop_weather WHERE id=$1';
        const values = [weatherId];
        try{
            await dataStoreClient.query(query, values);
        } catch(e){
            logger.error("Error deleting Weather", e);
        }
    },

    async getMaxValuesForStation(stationId){
        const query = 'SELECT MAX(temperatur) AS max_temperatur, MAX(wind) AS max_wind, MAX(luftdruck) AS max_luftdruck FROM weathertop_weather WHERE station_id=$1';
        const values = [stationId];
        try{
            let result = await dataStoreClient.query(query, values);
            return result.rows[0];
        } catch(e){
            logger.error("Error getting max values", e);
        }
    },

    async getMinValuesForStation(stationId){
        const query = 'SELECT MIN(temperatur) AS min_temperatur, MIN(wind) AS min_wind, MIN(luftdruck) AS min_luftdruck FROM weathertop_weather WHERE station_id=$1';
        const values = [stationId];
        try{
            let result = await dataStoreClient.query(query, values);
            return result.rows[0];
        } catch(e){
            logger.error("Error getting min values", e);
        }
    },

    async getLastTwoMeasurements(stationId){
        const query = 'SELECT temperatur, wind, luftdruck FROM weathertop_weather WHERE station_id=$1 ORDER BY id DESC LIMIT 2';
        const values = [stationId];
        try{
            let result = await dataStoreClient.query(query, values);
            return result.rows;
        } catch(e){
            logger.error("Error getting last measurements", e);
        }
    },
};

module.exports = weatherStore;
