const NoteService = require('../services/NoteService');

xdescribe('NoteService', () => {
    xbeforeEach(function() {
        this.knex = jasmine.createSpy({
            select: Promise.resolve(knex),
            from: Promise.resolve(knex),
            where: Promise.resolve(knex)
        });
        this.noteService = new NoteService(this.knex);
    })

    xit('can list the notes', function(done) {
        this.noteService.list(this.adminId).then(notes => {
            expect(this.knex.where).toHaveBeenCalled('user_id', this.adminId);
        });
    });

});