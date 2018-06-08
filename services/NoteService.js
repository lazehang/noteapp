class NoteService {
    constructor(knex) {
        this.knex = knex;
    }

    list(userid) {
        if (typeof userid !== 'undefined') {
            return this.knex("notes")
                .where('user_id', userid)
                .orderBy('created_at')
                .select('id', 'notes', 'title')
                .then((rows) => {
                    if (rows.length !== 0) {
                        return rows.map(row => ({
                            notes: row.notes,
                            id: row.id,
                            title: row.title
                        }));
                    }
                });
        }
    }

    getNote(index, userid) {
        if (typeof userid === 'undefined') {
            throw new Error("Userid undefined");
        }
        return this.knex("notes")
            .where('id', index)
            .select('title', 'notes')
            .then((rows) => {
                if (rows.length === 0) {
                    throw new Error('Note not found');
                }
                return rows[0];
            });
    }

    add(title, content, userid) {
        return this.knex("notes").insert({
            title: title,
            notes: content,
            user_id: userid
        });
    }

    update(index, title, content, userid) {
        return this.knex("notes").update({
                notes: content,
                title: title
            }).where({
                user_id: userid,
                id: index
            })
            .then((rows) => {
                if (rows.length <= index) {
                    throw new Error("Note does not exist !");
                }
                // return rows[0].notes;
            })
    }

    delete(index, userid) {
        return this.knex("notes")
            .where({
                user_id: userid,
                id: index
            }).del()
            .then((rows) => {
                if (rows.length === 0) {
                    throw new Error("Note does not exist !");
                }
            })
    }
}

module.exports = NoteService;