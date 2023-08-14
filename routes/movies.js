import { Router } from 'express'
import { MovieController } from '../controllers/movies.js'

export const moviesRouter = Router()

// get all movies
moviesRouter.get('/', MovieController.getAll)

// get movie by id
moviesRouter.get('/:id', MovieController.getById)

// post a new movie
moviesRouter.post('/', MovieController.create)

// delete a movie
moviesRouter.delete('/:id', MovieController.delete)

// update a propperty of a movie
moviesRouter.patch('/:id', MovieController.update)
