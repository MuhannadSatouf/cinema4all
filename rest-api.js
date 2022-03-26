const betterSqlite3 = require("better-sqlite3");
const db = betterSqlite3("./database/cinema_booking.db3");
let dbCon;

//get the names of all tables and views in the db
let views = db
  .prepare(
    `
  select name
  from sqlite_schema
  where (type = 'view')
  `
  )
  .all();
let tables = db
  .prepare(
    `
  select name
  from sqlite_schema
  where (type='table' and name like 'bookingHeader')
  or (type='table' and name like 'bookingLine')
  `
  )
  .all();
module.exports = function api(app, databaseConnection) {
  dbCon = databaseConnection;
  //add a special route that will list all views
  app.get("/api/views", (req, res) => {
    res.json(views);
  });
  app.get("/api/tables", (req, res) => {
    res.json(tables);
  });
  let together = views.concat(tables);
  for (let { name } of together) {
    app.get("/api/" + name, (req, res) => {
      let stmt = db.prepare(`
        SELECT * FROM ${name}
    `);
      let links = stmt.all();
      res.json(links);
    });
  }
  //Create a route to get a single post by its id (except validateUser):
  // this will help the logIn function validate the user via link http://localhost:3000/api/validateUser/{lee}
  //You are supposed to retrieve the user's Id and then use another view (api/allCustomers/id) to get all the user-related info
  for (let { name } of views) {
    if ({ name }.name === "validateUser") {
      app.get("/api/validateUser/" + ":userAlias", (req, res) => {
        let stmt = db.prepare(`
        select * from validateUser
          where 
          userAlias like :userAlias
    `);
        let result = stmt.all(req.params)[0] || null;
        if (result === null) {
          res.status(404);
        }
        res.json(result);
      });
    } else if ({ name }.name === "bookedPlaces") {
      app.get("/api/bookedPlaces/" + ":scheduleId", (req, res) => {
        let stmt = db.prepare(`
        select * from ${name}
          where 
          scheduleId is null or scheduleId = :scheduleId
    `);
        let result = stmt.all(req.params) || null;
        if (result === null) {
          res.status(404);
        }
        res.json(result);
      });
    } else if ({ name }.name === "scheduleFilter") {
      app.get("/api/scheduleFilter/" + ":date", (req, res) => {
        let stmt = db.prepare(`
        select * from ${name}
          where 
          date = :date
    `);
        let result = stmt.all(req.params) || null;
        if (result === null) {
          res.status(404);
        }
        res.json(result);
      });
    } else if ({ name }.name === "places") {
      app.get("/api/places/" + ":hallId", (req, res) => {
        let stmt = db.prepare(`
        select * from ${name}
          where 
          hallId = :hallId
    `);
        let result = stmt.all(req.params) || null;
        if (result === null) {
          res.status(404);
        }
        res.json(result);
      });
    } else {
      // we do not generate a path with :ID for this view because they conflict with :userAlias paramener
      app.get("/api/" + name + "/:id", (req, res) => {
        let stmt = db.prepare(`
        SELECT * FROM ${name} 
        where id = :id 
    `);
        let result = stmt.all(req.params)[0] || null;
        if (result === null) {
          res.status(404);
        }
        res.json(result);
      });
    }

    app.post("/api/" + name, (req, res) => {
      // do not allow id:s to be set manually
      delete req.body.id;
      // if this is the user table then encrypt the password
      if (name === userTable) {
        // add the most basic user role
        // this also changes the user role to just "user"
        // if someone tries to send something else through our REST-api
        req.body[userRoleField] = "user";
      }
      //this lets filter booking headers by userId and schedule Id. One recent record till be returned.
      //Made for getting the header id to then use it for booking lines creation.
      for (let { name } of tables) {
        if ({ name }.name === "bookingHeader") {
          app.get(
            "/api/bookingHeader?userId=" +
              ":userId" +
              "&scheduleId=" +
              ":scheduleId",
            (req, res) => {
              let stmt = db.prepare(`

        select * from ${name}
          where 
          userId =:userId AND scheduleId =:scheduleId
          order by id desc limit 1;
    `);

              let result = stmt.all(req.params)[0] || null;
              if (result === null) {
                res.status(404);
              }
              res.json(result);
            }
          );
          // booking lines will be returned for a specific header Id.
        } else if ({ name }.name === "bookingLine") {
          app.get("/api/" + name + "/:bookingId", (req, res) => {
            let stmt = db.prepare(`
        SELECT * FROM ${name} 
        where bookingId = :bookingId 
    `);
            let result = stmt.all(req.params) || null;
            if (result === null) {
              res.status(404);
            }
            res.json(result);
          });
        }
        app.post("/api/" + name, (req, res) => {
          // is ont working - received null object as req.????
          // do not let the id's to be set manually
          //delete req.body.id;
          console.log(req);
          let qry = `

  INSERT INTO ${name} (${Object.keys(req.body)})
  VALUES (${Object.keys(req.body).map((x) => ":" + x)}))
  `;

          console.log(qry);
          let stmt = db.prepare(qry);
          res.json(stmt.run(req.body));
        });
      }
    });
  }
};
