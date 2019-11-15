require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const movies = require('./movies.json')

console.log(process.env.API_TOKEN);

const app = express()

app.use(morgan('dev'));
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
    console.log('validate bearer token middleware')


    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({error: 'Unauthorized request'})
    }
    next()
})

function handleGetMovies(req, res) {
    //search for movies by genre, country, or avg_vote, query string parameters
    let response = movies
    if (req.query.genre) {
        response = response.filter(movie => movie.genre.toLowerCase().includes(req.query.genre.toLowerCase()))
    }

    if (req.query.country) {
        response = response.filter(movie => movie.country.toLowerCase().includes(req.query.country.toLowerCase()))
    }

    if (res.query.avg_vote) {
        response = response.filter(movie => {
            Number(movie.avg_vote) >= Number(req.query.avg_vote)
        })
    }
    

    res.json(response)
}

app.get('/movie', handleGetMovies)

app.listen(8000, () => {console.log('server listening at http://localhost:8000')})