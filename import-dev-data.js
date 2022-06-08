const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./model/tourModel');

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

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data deleted...');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const importData = async (tours) => {
  try {
    await Tour.create(tours);
    console.log('Data loaded! :)');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
const tours = JSON.parse(
  fs.readFileSync('./dev-data/data/tours-simple.json', 'utf-8')
);

if (process.argv[2] === '--import') {
  importData(tours);
} else if (process.argv[2] === '--delete') {
  deleteData();
}
