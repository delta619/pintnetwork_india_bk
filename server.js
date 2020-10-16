const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const { Server } = require('./app');

console.log(`#${process.env.NODE_ENV}# mode is on`);

if (process.env.NODE_ENV == 'production') {
  [db, dbServerName] = [
    process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD),
    'Production Server',
  ];
} else {
  [db, dbServerName] = [process.env.DATABASE_LOCAL, 'Local'];
}

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log(`MongoDB connected at ${dbServerName}`);
  })
  .catch((err) => {
    throw err;
  });

//test

Server.listen(process.env.PORT || 3000, (err) => {
  if (err) console.log(err);
  else {
    console.log(`Server started at port ${process.env.PORT || 3000}`);
  }
});
