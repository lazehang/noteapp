require('dotenv').config();
const DEFAULT_PORT = 8000;
module.exports = {
    "production": {
        "port": process.env.PORT_NUMBER || DEFAULT_PORT
    },
    "development": {
        "port": process.env.PORT_NUMBER || DEFAULT_PORT
    },
    "test": {
        "port": process.env.PORT_NUMBER || DEFAULT_PORT
    }
}