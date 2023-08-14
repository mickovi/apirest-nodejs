import z from 'zod'

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'title must be a string',
    requires_error: 'title is required'
  }),
  year: z.number().int().min(1900).max(2024),
  director: z.string(),
  duration: z.number().int().positive(),
  poster: z.string().url({
    message: 'poster must be a valid url'
  }),
  rate: z.number().min(0).max(10).default(0),
  genre: z.array(
    z.enum(
      ['Action', 'Biography', 'Comedy', 'Crime', 'Drama', 'Horror', 'Thriller', 'Sci-fi']
    ),
    {
      required_error: 'genre is required',
      invalid_type_error: 'genre must be an array of enum genre'
    }
  )
})

export function validateMovie (object) {
  return movieSchema.safeParse(object)
}

export function validatePartialMovie (object) {
  // partial() makes all properties optional, id doesn't modify
  return movieSchema.partial().safeParse(object)
}
