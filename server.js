const dotenv = require('dotenv');

dotenv.config({
  path: './config.env',
});

const app = require('./app');

const LISTENING_PORT = +process.env.PORT;
// console.log(process.env);
app.listen(LISTENING_PORT, () =>
  console.log(`Server running on port ${LISTENING_PORT}...`)
);
