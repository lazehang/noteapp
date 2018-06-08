module.exports = function Auth(knex) {
    return function(username, password, callback) {
        let user = knex('users').where({
            username: username,
            password: password
        }).select('*');

        user.then((rows) => {
            if (rows.length === 1) {
                callback(null, true);
            } else {
                callback(null, false);
            }
        }).catch((error) => {
            callback(error);
        })
    }
};