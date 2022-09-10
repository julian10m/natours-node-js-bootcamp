const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.error(err.name, err.message);
  process.exit(1);
});

dotenv.config({
  path: './config.env',
});

mongoose
  .connect(
    process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
  )
  .then(() => console.log('DB connection succesful'));

const app = require('./app');

const LISTENING_PORT = +process.env.PORT;
// console.log(process.env);
const server = app.listen(LISTENING_PORT, () =>
  console.log(`Server running on ${process.env.NODE_ENV.toUpperCase()} mode, using port ${LISTENING_PORT}...`)
);

process.on('unhandledRejection', (err) => {
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
