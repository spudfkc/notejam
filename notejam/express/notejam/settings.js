var settings = {
  development: {
    dbConnectionString: process.env.DB_CONNECTION || 'mysql://notejam:Airaenoj8Ohk8chienuog9icheet8eiy@localhost:3306/notejam'
  },
  test: {
    dbConnectionString: process.env.DB_CONNECTION || 'mysql://ubuntu@localhost:3306/circle_test'
  }
};


var env = process.env.NODE_ENV;
if (!env) {
  env = 'development';
}
module.exports = settings[env];
