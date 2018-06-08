require('dotenv').config();

module.exports = {
    "production": {
        "port": process.env.PORT_NUMBER
    },
    "development": {
        "port": process.env.PORT_NUMBER
    },
    "test": {
        "port": process.env.PORT_NUMBER
    }
}