const NoteRouter = require('../routes/NoteRouter');

describe('NoteRouter', () => {
    beforeEach(function() {
        this.noteService = jasmine.createSpyObj('NoteService', {
            getUserIdByUsername: Promise.resolve(1),
            list: Promise.resolve([])
        });

        this.noteRouter = new NoteRouter(this.noteService);
    })

    it('Can check the username first then read', function(done) {
        const req = {
            auth: {
                name: 'admin'
            }
        };
        this.noteRouter.getUsername(req, null, () => {
            expect(req.auth.id).toBe(1);
            done();
        });
    });

    it('Can call the read', function(done) {
        const req = {
            auth: {
                name: 'admin',
            }
        };
        this.noteRouter.getUsername(req, null, () => {
            let res;
            res = jasmine.createSpyObj('res', {
                status: res,
                json: res
            });
            this.noteRouter.get(req, res).then(() => {
                expect(res.json).toHaveBeenCalledWith([]);
                done();
            }).catch(done.fail);
        });
    });
})