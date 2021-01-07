const axios = require('axios')
const permissions = require('../models/dals/permissionsDAL')

async function getMoviePermissions(userId) {
  try {
    let userPermissions = await permissions.getUserById(userId)
    let moviePermissions = userPermissions.permissions.filter(
      (permission) =>
        ['viewMovies', 'createMovies', 'deleteMovies', 'updateMovies'].indexOf(
          permission
        ) > -1
    )

    return moviePermissions
  } catch (error) {
    console.log(error)
    res.end()
  }
}

module.exports.displayMovies = async function (req, res, next) {
  try {
    let validPermission = await getMoviePermissions(req.user._id)
    if (validPermission.indexOf('viewMovies') > -1) {
      let movies = await axios
        .get('http://subscriptions-rest-api.herokuapp.com/api/movies')
        .then(({ data }) => data.slice(0, 6))
      let subscriptions = await axios.get(
        'http://subscriptions-rest-api.herokuapp.com/api/subscribers'
      )

      for (let movie of movies) {
        movie.membersWatchedMovie = []
        for (let subscription of subscriptions.data) {
          for (let watchedMovie of subscription.movies) {
            if (watchedMovie.movieId.includes(movie._id)) {
              let member = await axios.get(
                'http://subscriptions-rest-api.herokuapp.com/api/members/' +
                  subscription.memberId
              )
              movie.membersWatchedMovie.push({
                memberId: subscription.memberId,
                subscriptionId: subscription._id,
                memberName: member.data.name,
                date: formatDate(watchedMovie.date),
              })
            }
          }
        }
      }
      res.render('layout', {
        page: 'movies/allMovies',
        movies: movies,
        permissions: validPermission,
      })
    } else {
      res.redirect('/')
    }
  } catch (error) {
    console.log(error)
    res.end()
  }
}

module.exports.displayMovie = async function (req, res, next) {
  try {
    let validPermission = await getMoviePermissions(req.user._id)
    if (validPermission.indexOf('viewMovies') > -1) {
      let movie = await axios.get(
        'http://subscriptions-rest-api.herokuapp.com/api/movies/' +
          req.params.id
      )
      let subscriptions = await axios.get(
        'http://subscriptions-rest-api.herokuapp.com/api/subscribers'
      )
      movie = movie.data
      movie.membersWatchedMovie = []
      for (let subscription of subscriptions.data) {
        for (let watchedMovie of subscription.movies) {
          if (watchedMovie.movieId.includes(movie._id)) {
            let member = await axios.get(
              'http://subscriptions-rest-api.herokuapp.com/api/members/' +
                subscription.memberId
            )
            movie.membersWatchedMovie.push({
              memberId: subscription.memberId,
              subscriptionId: subscription._id,
              memberName: member.data.name,
              date: formatDate(watchedMovie.date),
            })
          }
        }
      }
      res.render('layout', {
        page: 'movies/allMovies',
        movies: [movie],
        permissions: validPermission,
      })
    } else {
      res.redirect('/')
    }
  } catch (error) {
    console.log(error)
    res.end()
  }
}

function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear()

  if (month.length < 2) month = '0' + month
  if (day.length < 2) day = '0' + day

  return [year, month, day].join('-')
}

module.exports.displayAddMovie = async function (req, res, next) {
  try {
    let validPermission = await getMoviePermissions(req.user._id)
    if (validPermission.indexOf('createMovies') > -1) {
      res.render('layout', { page: 'movies/addPage' })
    } else {
      res.redirect('/')
    }
  } catch (error) {
    console.log(error)
    res.end()
  }
}

module.exports.performAddMovie = function (req, res, next) {
  try {
    axios
      .post('http://subscriptions-rest-api.herokuapp.com/api/movies', {
        name: req.body.name,
        genres: req.body.genres.split(','),
        image: req.body.imageURL,
        premiered: req.body.premiered,
      })
      .then(() => res.redirect('/movies'))
  } catch (error) {
    console.log(error)
    res.end()
  }
}

module.exports.displayEditMovie = function (req, res, next) {
  try {
    axios
      .get(
        `http://subscriptions-rest-api.herokuapp.com/api/movies/${req.params.id}`
      )
      .then((movie) => {
        return res.render('layout', {
          page: 'movies/editPage',
          movie: movie.data,
        })
      })
  } catch (error) {
    console.log(error)
    return res.end()
  }
}

module.exports.performEditMovie = function (req, res, next) {
  try {
    axios
      .put(
        'http://subscriptions-rest-api.herokuapp.com/api/movies',
        {
          _id: req.params.id,
          name: req.body.name,
          genres: req.body.genres.split(','),
          image: req.body.imageURL,
          premiered: new Date(req.body.premiered),
        },
        { headers: { 'Content-Type': 'application/json' } }
      )
      .then(() => res.redirect('/movies/allMovies'))
  } catch (error) {
    console.log(error)
    return res.end()
  }
}

module.exports.performDeleteMovie = async function (req, res, next) {
  try {
    await axios.delete(
      `http://subscriptions-rest-api.herokuapp.com/api/movies/${req.params.id}`
    )
    let subscribers = await axios.get(
      'http://subscriptions-rest-api.herokuapp.com/api/subscribers'
    )

    for (let subscriber of subscribers.data) {
      index = subscriber.movies.findIndex(
        async (movie) => movieId == req.params.id
      )
      if (index != -1) {
        subscriber.movies.splice(index, 1)
        await axios.put(
          `http://subscriptions-rest-api.herokuapp.com/api/subscribers/${subscriber._id}`,
          {
            movies: subscriber.movies,
          },
          { headers: { 'Content-Type': 'application/json' } }
        )
      }
    }
    return res.redirect('/movies')
  } catch (error) {
    console.log(error)
    return res.end()
  }
}
