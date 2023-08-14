// import fs from 'node:fs'

// how to read a json file using ESmodules (lowest performance)
// const movies = JSON.parse(fs.readFileSync('./movies.json', 'utf-8'))

// a better way (fastest and native) to read a json file using ESmodules
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
export const readJSON = (path) => require(path)
