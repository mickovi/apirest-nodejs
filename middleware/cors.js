import cors from 'cors'

// normal methdos: GET/HEAD/POST
// complex methods: PUT/PATCH/DELETE

// CORS PRE-FLIGHT
// OPTIONS /movies

// OBS: the browser doesn't send the origin header when
// the request is the same origin

const ACCEPTED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:8080',
  'http://mymovies.com'
]

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
  origin: (origin, callback) => {
    if (acceptedOrigins.includes(origin) || !origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
}
)
