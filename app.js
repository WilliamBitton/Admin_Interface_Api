"use strict"

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const indexRoutes = require('./routes/index')
const errorController = require('./controllers/errorController')

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    )
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))
app.use(indexRoutes)
app.use(errorController.getError)
app.use(errorController.logErrors)

const PORT = process.env.PORT || 3000
mongoose.connect('mongodb+srv://WillB:TP3.prog@tp3db.9dgu0ps.mongodb.net/TP3?retryWrites=true&w=majority')
    .then(() => {
        console.log('La connexion à la base de données est établie')
        app.listen(PORT, () => {
            console.log('Le serveur écoute sur le port 3000')
        })
    })
    .catch(err => {
        console.log('La connexion à la base de données a échoué', err)
    })