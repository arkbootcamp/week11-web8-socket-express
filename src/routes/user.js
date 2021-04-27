const express = require('express')
const route = express.Router()
const userController = require('../controllers/user')

route.get('/', userController.getUser)


module.exports = route