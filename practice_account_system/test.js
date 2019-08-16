const mysqlt = require("mysql");

HOST = 'localhost'
DATABASE_USER = 'test'
DATABASE_PASSWORD = '1111'
DATABASE = 'member'

const connection = mysqlt.createConnection({
  host: HOST,
  user: DATABASE_USER,
  password: DATABASE_PASSWORD,
  database: DATABASE
});

connection.connect(err => {
  if (err) {
    console.log('connecting error:' + err);
  } else {
    console.log('connecting success');
  }
});