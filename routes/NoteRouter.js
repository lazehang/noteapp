const express = require('express');

class NoteRouter {
    constructor(noteService) {
        this.noteService = noteService;
    }

    router() {
        let router = express.Router();

        router.get("/", this.get.bind(this));
        router.post("/", this.post.bind(this));
        router.put("/:id", this.put.bind(this));
        router.delete("/:id", this.delete.bind(this));

        return router;
    }

    get(req, res) {
        if (typeof req.query.id === 'undefined') {
            return this.noteService.list(req.auth.user)
                .then((notes) => res.json(notes))
                .catch((err) => res.status(500).json(err.message));
        } else {
            return this.noteService.getNote(req.query.id, req.auth.userid)
                .then((notes) => res.json(notes))
                .catch((err) => res.status(500).json(err.message));
        }

    }

    post(req, res) {
        return this.noteService.add(req.body.title, req.body.note, req.auth.userid)
            .then(() => this.noteService.list(req.auth.userid))
            .then((notes) => res.json(notes))
            .catch((err) => res.status(500).json(err.message));
    }

    put(req, res) {
        return this.noteService.update(req.params.id, req.body.title, req.body.note, req.auth.userid)
            .then(() => this.noteService.list(req.auth.userid))
            .then((notes) => res.json(notes))
            .catch((err) => res.status(500).json(err.message));
    }

    delete(req, res) {
        return this.noteService.delete(req.params.id, req.auth.userid)
            .then(() => this.noteService.list(req.auth.userid))
            .then((notes) => res.json(notes))
            .catch((err) => res.status(500).json(err.message));
    }
}

module.exports = NoteRouter;