import { MovieModel } from '../models/movie.js'
import { validateMovie, validatePartialMovie } from '../schemas/movies.js'

export class MovieController {
  static async getAll (req, res) {
    const { genre } = req.query
    // request to the model
    const movies = await MovieModel.getAll({ genre })
    // render the response
    res.json(movies)
  }

  static async get (req, res) {
    const { id } = req.params
    const movie = await MovieModel.getById(id)
    if (movie) return res.json(movie)
    return res.status(404).json({ error: 'error, movie not found' })
  }

  static async create (req, res) {
    // validate the data
    const result = validateMovie(req.body)

    if (result.error) {
      return res.status(400).json({ error: JSON.parse(result.error.message) }) // 400: bad request
    }

    const newMovie = await MovieModel.create({ input: result.data })

    // return the new movie
    res.status(201).json(newMovie)
  }

  static async delete (req, res) {
    const { id } = req.params
    const result = MovieModel.delete({ id })

    if (result === false) {
      return res.status(404).json({ error: 'error, movie not found' })
    }

    return res.json({ message: 'movie deleted' })
  }

  static async patch (req, res) {
    const result = validatePartialMovie(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const { id } = req.params
    const updateMovie = await MovieModel.update({ id, input: result.data })
    res.json(updateMovie)
  }
}
