# NOTEAPP (NodeJS + Postgres)
A simple note taking app using nodejs with postgres as database.

## Libraries
* knex (SQL query builder)
* express (Node framework)
* handlebars (Templating language)
* pg (PostgreSQL client for Node.js)

## Run
* Clone this repository.
* Install dependencies with `npm install`.
* Copy `.env.example` and rename as `.env` and update it as per your config.
* Run migrations and seeds with `npm run migrate-seed`.
* Run `npm run dev`

---

## postgres on docker
* `docker-compose up -d`
