const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./model/tourModel');
const Review = require('./model/reviewModel');
const User = require('./model/userModel');

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
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data deleted...');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const importData = async (tours, users, reviews) => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('Data loaded! :)');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const tours = JSON.parse(
  fs.readFileSync('./dev-data/data/tours.json', 'utf-8')
);
const users = JSON.parse(
  fs.readFileSync('./dev-data/data/users.json', 'utf-8')
);
const reviews = JSON.parse(
  fs.readFileSync('./dev-data/data/reviews.json', 'utf-8')
);

if (process.argv[2] === '--import') {
  importData(tours, users, reviews);
} else if (process.argv[2] === '--delete') {
  deleteData();
}
