const { isValid, authorschema } = require("../utils/validator");
const AuthorModel = require("../models/authorModel.js");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const bcrypt = require("bcrypt");

const createBlog = async function(req, res, next) {
    try {
        const requestBody = req.body
        const requestQuery = req.query
    
        //Checking whether any input data is provided
        if (!isValid(requestBody))
          throw createError.BadRequest("Input data is not provided");
    
        //Input should not be in query params
        if (isValid(requestQuery))
          throw createError.NotAcceptable("Invalid request");
    } 
    catch(err){
        next(err)
    }
}