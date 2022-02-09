const betterSqlite3 = require('better-sqlite3');
const db = betterSqlite3('./database/cinema_booking.db3');

//get the names of all tables and views in the db
let views = db.prepare(`
  select name
  from sqlite_schema
  where (type = 'view')
  and name not like 'sqlite%'
  `).all();

module.exports = function api(app) {
  //add a special route that will list all views
  app.get('/api/views', (req, res) => {
    res.json(views);
  });
  for (let { name } of views) {
    app.get('/api/' + name, (req, res) => {
      let stmt = db.prepare(`
        SELECT * FROM ${name}
    `);
      let addresses = stmt.all();
      res.json(addresses);
    });
  }

  //Create a route to get a single post by its id
  for (let { name } of views) {
    app.get('/api/' + name + '/:id', (req, res) => {
      let stmt = db.prepare(`
        SELECT * FROM ${name} 
        where id = :id 
    `);
      let result = stmt.all(req.params)[0] || null;
      if (result === null) { res.status(404); }
      res.json(result);
    });
  }

}