const mysql = require('mysql');
const settings = require('./settings');
const db = mysql.createConnection(settings.dbConnectionString);

function queryAsPromised(query) {
  return new Promise(function(resolve, reject) {
    db.query(query,
      function(err, result) {
        if (err) {
          console.log('got err', err)
          reject(err);
        }
        resolve(result);
      });
  });
}

function createTables() {
  return queryAsPromised("CREATE TABLE IF NOT EXISTS users (" +
      "id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL," +
      "email VARCHAR(75) NOT NULL," +
      "password VARCHAR(128) NOT NULL);")
  .then(function(result) {
    return queryAsPromised("CREATE TABLE IF NOT EXISTS pads (" +
      "id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL," +
      "name VARCHAR(100) NOT NULL," +
      "user_id INTEGER NOT NULL REFERENCES users(id));")
   })
  .then(function(result) {
    return queryAsPromised("CREATE TABLE IF NOT EXISTS notes (" +
            "id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL," +
            "pad_id INTEGER REFERENCES pads(id)," +
            "user_id INTEGER NOT NULL REFERENCES users(id)," +
            "name VARCHAR(100) NOT NULL," +
            "text text NOT NULL," +
            "created_at DATETIME default current_timestamp," +
            "updated_at DATETIME default current_timestamp);")
  });
}

function applyFixtures() {

}

function truncateTables() {

}

db.connect(err => {
  if(err) console.log(err);
  return createTables().then(function() {
    console.log('tables created');
    db.end(() => console.log('done'));
  }).catch(err => console.error('FAILED', err))
  db.destroy();
  process.end()
})


