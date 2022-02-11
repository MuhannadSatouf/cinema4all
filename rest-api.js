const betterSqlite3 = require('better-sqlite3');
const db = betterSqlite3('./database/cinema_booking.db3');

//get the names of all tables and views in the db
let views = db.prepare(`
  select name
  from sqlite_schema
  where (type = 'view')
  or (type='table' and name like 'bookingHeader')
  or (type='table' and name like 'bookingLine')
  `).all();

let tables = db.prepare(`
  select name
  from sqlite_schema
  where (type='table' and name like 'bookingHeader')
  or (type='table' and name like 'bookingLine')
  `).all();



module.exports = function api(app) {
  //add a special route that will list all views
  app.get('/api/views', (req, res) => {
    res.json(views);
  });
  app.get('/api/tables', (req, res) => {
    res.json(tables);
  });

  let together = views.concat(tables);

  for (let { name } of together) {
    app.get('/api/' + name, (req, res) => {
      let stmt = db.prepare(`
        SELECT * FROM ${name}
    `);
      let links = stmt.all();
      res.json(links);
    });
  }

  //Create a route to get a single post by its id
  for (let { name } of together) {
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