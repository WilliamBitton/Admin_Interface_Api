"use strict"

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const authRoutes = require('./routes/auth')
const usersRoutes = require('./routes/users')
const productsRoutes = require('./routes/products')
const categoriesRoutes = require('./routes/categories')
const cartRoutes = require('./routes/cart')
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
app.use(authRoutes)
app.use(usersRoutes)
app.use(productsRoutes)
app.use(categoriesRoutes)
app.use(cartRoutes)
app.use(errorController.getError)
app.use(errorController.logErrors)

const PORT = process.env.PORT || 3000
const MONGOOSE = process.env.MONGOOSE
mongoose.connect(MONGOOSE)
    .then(() => {
        console.log('La connexion à la base de données est établie')
        app.listen(PORT, () => {
            console.log('Le serveur est démarré')
        })
    })
    .catch(err => {
        console.log('La connexion à la base de données a échoué', err)
    })