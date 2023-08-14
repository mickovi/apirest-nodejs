const express = require('express')
const crypto = require('node:crypto')
const movies = require('./movies.json')
const { validateMovie, validatePartialMovie } = require('./schemas/movies')

const app = express()

// middleware to log all requests
app.use(express.json())

// disable x-powered-by header
app.disable('x-powered-by')

// normal methdos: GET/HEAD/POST
// complex methods: PUT/PATCH/DELETE

// CORS PRE-FLIGHT
// OPTIONS /movies

const ACCEPTED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:8080',
  'http://mymovies.com'
]

// get all movies
app.get('/movies', (req, res) => {
  // OBS: the browser doesn't send the origin header when
  // the request is the same
  const origin = req.header('origin')
  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin', origin)
  }
  const { genre } = req.query
  if (genre) {
    const filteredMovies = movies.filter(
      movie => movie.genre.some(
        g => g.toLowerCase() === genre.toLowerCase()
      )
    )
    return res.json(filteredMovies)
  }
  res.json(movies)
})

// get movie by id
app.get('/movies/:id', (req, res) => {
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)
  if (movie) return res.json(movie)
  return res.status(404).json({ error: 'error, movie not found' })
})

// post a new movie
app.post('/movies', (req, res) => {
  // validate the data
  const result = validateMovie(req.body)

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) }) // 400: bad request
  }

  // add an id to the movie
  const newMovie = {
    id: crypto.randomUUID(), // uuidv4
    ...result.data
  }

  // this must be done in a database
  movies.push(newMovie)

  // return the new movie
  res.status(201).json(newMovie)
})

app.delete('/movies/:id', (req, res) => {
  const origin = req.header('origin')
  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin', origin)
  }
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ error: 'error, movie not found' })
  }

  movies.splice(movieIndex, 1)

  return res.json({ message: 'movie deleted' })
})

app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body)

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ error: 'error, movie not found' })
  }

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data
  }

  movies[movieIndex] = updateMovie
  res.json(updateMovie)
})

app.options('/movies/:id', (req, res) => {
  const origin = req.header('origin')
  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin', origin)
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
  }
  res.send(200)
})

const PORT = process.env.PORT ?? 3000

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})
