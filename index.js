const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const hb = require('express-handlebars');
const basicAuth = require('express-basic-auth');
const bodyParser = require('body-parser');

const NoteRouter = require('./routes/NoteRouter');
const Auth = require('./services/AuthService');
const NoteService = require('./services/NoteService');
const Handlebars = require('handlebars');
const config = require('./config.js')[process.env.NODE_ENV || 'development'];
const knexConfig = require('./knexfile')[process.env.NODE_ENV || 'development'];
const knex = require('knex')(knexConfig);

app.engine('handlebars', hb({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(basicAuth({
    authorizer: new Auth(knex),
    authorizeAsync: true,
    challenge: true,
    realm: 'Note taking app'
}));

let noteService = new NoteService(knex);

app.use('/', function(req, res, next) {
    return knex("users")
        .where('username', req.auth.user)
        .select('id')
        .then((row) => {
            req.auth.userid = row[0].id;

            next();
        });
});

app.get('/', function(req, res) {
    noteService.list(req.auth.userid).then(function(notes) {
        res.render('index', {
            user: req.auth.user,
            notes: notes
        });
    });
});

app.use('/api/notes', (new NoteRouter(noteService)).router());

app.listen(config.port, () => console.log(`Notes Taking listening on port ${config.port} in ${[process.env.NODE_ENV || 'development']} ENV! `));

module.exports.app = app;
