var mysql = require('mysql');
var async = require('async');

var settings = require('./settings');
var db = new mysql.createConnection(settings.dbConnectionString);

var functions = {
  createTables: function(next) {
    console.log('creatig tables...');
    async.series({
      createUsers: function(callback) {
        db.query("CREATE TABLE IF NOT EXISTS users (" +
            "id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL," +
            "email VARCHAR(75) NOT NULL," +
            "password VARCHAR(128) NOT NULL);",
            function() { callback(null); });
      },
      createPads: function(callback) {
        db.query("CREATE TABLE IF NOT EXISTS pads (" +
            "id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL," +
            "name VARCHAR(100) NOT NULL," +
            "user_id INTEGER NOT NULL REFERENCES users(id));",
            function() { callback(null); })
      },
      createNotes: function(callback) {
        db.query("CREATE TABLE IF NOT EXISTS notes (" +
            "id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL," +
            "pad_id INTEGER REFERENCES pads(id)," +
            "user_id INTEGER NOT NULL REFERENCES users(id)," +
            "name VARCHAR(100) NOT NULL," +
            "text text NOT NULL," +
            "created_at default current_timestamp," +
            "updated_at default current_timestamp);",
            function() { callback(null); });
      }
    },
    function(err, results) {
      console.log('DONE CREATEING TABLES', err, results);
      next();
    });
  },

  applyFixtures: function(next) {
    this.truncateTables(function() {
      async.series([
        function(callback) {
          db.query("INSERT INTO users VALUES (1, 'user1@example.com', " +
                 "'$2a$10$mhkqpUvPPs.zoRSTiGAEKODOJMljkOY96zludIIw.Pop1UvQCTx8u')",
                function() { callback(null) });
        },
        function(callback) {
          db.query("INSERT INTO users VALUES (2, 'user2@example.com', " +
                 "'$2a$10$mhkqpUvPPs.zoRSTiGAEKODOJMljkOY96zludIIw.Pop1UvQCTx8u')",
                function() { callback(null) });

        },
        function(callback) {
          db.query("INSERT INTO pads VALUES (1, 'Pad 1', 1)",
                function() { callback(null) });
        },
        function(callback) {
          db.query("INSERT INTO pads VALUES (2, 'Pad 2', 1)",
                function() { callback(null) });
        },
        function(callback) {
          db.query("INSERT INTO notes VALUES (1, 1, 1, 'Note 1', 'Text', 1, 1)",
                function() { callback(null) });
        },
        function(callback) {
          db.query("INSERT INTO notes VALUES (2, 1, 1, 'Note 2', 'Text', 1, 1)",
                function() { callback(null) });
        }
      ], function(err, results) {
        next();
      })
    });
  },

  truncateTables: function(next) {
    async.series([
      function(callback) {
        db.query("DELETE FROM users;",
              function() { callback(null) });
      },
      function(callback) {
        db.query("DELETE FROM notes;",
              function() { callback(null) });

      },
      function(callback) {
        db.query("DELETE FROM pads;",
              function(result) { callback(null); });
      }
    ], function(err, results) {
      next();
    })
  }
}


if (require.main === module) {
  db.connect(function(err) {
    if (err) {
      console.log('error connectiong: ', err);
    }
    functions.createTables(function() {
        db.end(function() {
          console.log('ended.');
          console.log("DB successfully initialized");
        });
    });
  });
}

module.exports = functions;
