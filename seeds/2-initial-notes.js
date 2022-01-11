exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('notes').del()
        .then(function() {
            // Inserts seed entries
            return knex('notes').insert([
                { id: 1, title: 'title', notes: 'hello this is a test', user_id: 1 },
            ]);
        });
};