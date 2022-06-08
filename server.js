const mongoose = require('mongoose');
const dotenv = require('dotenv');

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
app.listen(LISTENING_PORT, () =>
  console.log(`Server running on port ${LISTENING_PORT}...`)
);
