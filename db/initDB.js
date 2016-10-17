const Movie = require('../models/movie');
const data = require('./initData.json');

// function clearDB() {
//   Movie.remove({}, error => {
//     if (error) console.error(error);
//   });
// }

function insertBaseData() {
  data.input.forEach(movieData => {
    let movie = new Movie(movieData);
    movie.save()
      // .then(console.log)
      .catch(console.error);
  });
}

function initDB() {
  Movie.find({}).exec()
    .then(movies => movies.length)
    .then(amount => {
      if (amount) return;
      insertBaseData();
      console.log('DB initialized successfully');
    })
    .catch(console.error);
}

module.exports = initDB;