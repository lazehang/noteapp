const NoteService = require('../services/NoteService');

require('dotenv').config();
const knex = require('knex')({
    client: 'postgresql',
    connection: {
        database: process.env.TESTDB_NAME,
        user: process.env.TESTDB_USER,
        password: process.env.TESTDB_PASSWORD
    },
});

describe('NoteService', () => {
    beforeEach(function(done) {
        knex.migrate.latest().then(() => {
            return knex.seed.run();
        }).then(() => {
            return knex.select("*")
                .from("users")
                .where("username", "admin");
        }).then((users) => {
            this.noteService = new NoteService(knex);
            this.adminId = users[0].id;
            done();
        });
    })

    it('can fetch the username', function(done) {
        this.noteService.getUserIdByUsername('admin').then(id => {
            expect(id).toEqual(this.adminId);
            done();
        });
    });

    it('can list the notes', function(done) {
        this.noteService.list(this.adminId).then(notes => {
            expect(notes[0]).toEqual(jasmine.objectContaining({
                content: 'first note',
                user_id: this.adminId
            }));
            expect(notes[0].created_at).toBeDefined();
            expect(notes[0].id).toEqual(jasmine.any(Number));
            done();
        });
    });

    it('can add the notes', function(done) {
        this.noteService.add(this.adminId, 'test').then(() => {
            return this.noteService.list(this.adminId);
        }).then(notes => {
            expect(notes[0]).toEqual(jasmine.objectContaining({
                content: 'first note',
                user_id: this.adminId
            }));
            expect(notes[0].created_at).toBeDefined();
            expect(notes[0].id).toEqual(jasmine.any(Number));
            expect(notes[1]).toEqual(jasmine.objectContaining({
                content: 'test',
                user_id: this.adminId
            }));
            expect(notes[1].created_at).toBeDefined();
            expect(notes[1].id).toEqual(jasmine.any(Number));
            done();
        });
    });

});