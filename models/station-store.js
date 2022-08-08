const dataStore = require("./data-store.js");
const dataStoreClient = dataStore.getDataStore();
const logger = require("../utils/logger.js");

const stationStore = {
    async getStation(id) {
        const query = 'SELECT * FROM weathertop_stations WHERE id=$1';
        const values = [id];
        try {
            let result = await dataStoreClient.query(query, values);
            return result.rows[0];
        } catch (e) {
            logger.error("Error fetching playlist", e);
        }
    },

    async getAllStationsForUser(user_email) {
        const query = 'SELECT * FROM weathertop_stations WHERE user_email=$1';
        const values = [user_email];
        try {
            let result = await dataStoreClient.query(query, values);
            return result.rows;
        } catch (e) {
            logger.error("Error fetching all stations", e);
        }
    },

    async addStation(newStation){
        const query = 'INSERT INTO weathertop_stations(station_name, lat, lon, user_email) VALUES ($1, $2, $3, $4)';
        const values = [newStation.name, newStation.latitude, newStation.longitude, newStation.user_email];
        try{
            await dataStoreClient.query(query, values);
        } catch(e){
            logger.error("Error adding new Station", e);
        }
    },

    async removeStation(stationId){
        const query = 'DELETE FROM weathertop_stations WHERE id=$1';
        const values = [stationId];
        try{
            await dataStoreClient.query(query, values);
        } catch(e){
            logger.error("Error deleting Station", e);
        }
    }



};

module.exports = stationStore;