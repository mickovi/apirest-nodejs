import express, { json } from 'express'
import { moviesRouter } from './routes/movies.js'
import { corsMiddleware } from './middleware/cors.js'

const app = express()

// middleware to log all requests
app.use(json())

// middleware to enable cors
app.use(corsMiddleware())

// disable x-powered-by header
app.disable('x-powered-by')

// routes
app.use('/movies', moviesRouter)

const PORT = process.env.PORT ?? 3000

// start the server
app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})
