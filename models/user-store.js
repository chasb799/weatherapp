const dataStore = require("./data-store.js");
const dataStoreClient = dataStore.getDataStore();
const logger = require("../utils/logger.js");

const userStore = {
    async addUser(user) {
        const query = 'INSERT INTO weathertop_users(email, vorname, nachname, passwort) VALUES($1, $2, $3, $4)';
        const values = [user.email, user.firstName, user.lastName, user.password];
        try {
            await dataStoreClient.query(query, values);
        } catch (e) {
            logger.error("Error adding user", e);
        }
    },

    async authenticateUser(email, password) {
        const query = 'SELECT * FROM weathertop_users WHERE email=$1 AND passwort=$2';
        const values = [email, password];
        try {
            let dbRes = await dataStoreClient.query(query, values);
            if (dbRes.rows[0] !== undefined) {
                return {id: email};
            } else {
                return undefined;
            }
        } catch (e) {
            console.log("Error authenticating user", e);
        }
    },

    async getUserById(id) {
        logger.info(`Getting user ${id}`);
        const query = 'SELECT * FROM weathertop_users WHERE email=$1';
        const values = [id];
        try {
            let dbRes = await dataStoreClient.query(query, values);
            logger.info(`Getting user ${dbRes.rows[0].email}`);
            if (dbRes.rows[0] !== undefined) {
                return {id: dbRes.rows[0].email, firstName: dbRes.rows[0].firstName, lastName: dbRes.rows[0].lastName};
            } else {
                return undefined;
            }
        } catch (e) {
            console.log("Error getting user", e);
        }
    }

};

module.exports = userStore;