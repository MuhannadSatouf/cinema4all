const session = require('express-session')
const store = require('better-express-store')





module.exports = function (app, db) {


  app.use(session({

    secret: 'IfYouSeeThisItsNotASecretAnyMore',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: 'auto' },
    store: store({ dbPath: './database/cinema_booking.db' })

  }))



  app.post('/api/login', (req, res) => {

    console.log(req.body + " Here");


    let data = req.body

    let userAlias = data.uname
    let password = data.psw


    console.log(data)

    let stmt = db.prepare(`
      SELECT * FROM validateUser
      WHERE userAlias=:uname AND password =:psw
    `);
    // Either we get an array with one element (success)
    // or an array with 0 elements (failure) back
    // - convert that array to a user object or an error object/message
    let result = stmt.all(req.body)[0] || { _error: 'No such user.' };


    // If the login is a sucess store the user in our session
    // (the session is unique for each connection)
    if (!result._error) {
      req.session.user = result;
    }
    // Respond
    res.json(result);
  }); app.get('/api/login', (req, res) => {
    res.json(req.session.user || { _error: 'Not logged in' });
  });

  // The delete route /api/login is used to logout the user
  app.delete('/api/login', (req, res) => {
    delete req.session.user;
    res.json({ success: 'logged out' });
  });

}