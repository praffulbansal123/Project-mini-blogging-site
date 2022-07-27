const express = require('express')
const router = express.Router()
const AuthorController =  require('../controllers/authorController')


//----------------------------------------AUTHOR ROUTES------------------------------------------------------//
router.post('/createAuthor', AuthorController.createAuthor)

router.post('/authorLogin', AuthorController.authorLogin)

module.exports = router