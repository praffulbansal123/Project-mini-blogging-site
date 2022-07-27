const { isValid, authorschema } = require("../utils/validator");
const AuthorModel = require("../models/authorModel.js");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const bcrypt = require("bcrypt");

//----------------------------------------CREATING AUTHOR----------------------------------------------------//
const createAuthor = async function (req, res, next) {
  try {
    //Checking whether any input data is provided
    if (!isValid(req.body))
      throw createError.BadRequest("Input data is not provided");

    //Input should not be in query params
    if (isValid(req.query)) throw createError.NotAcceptable("Invalid request");

    //Validating Joi Schema
    const requestBody = await authorschema.validateAsync(req.body);

    //Destructuring the new request body
    const { title, fname, lname, email, password } = requestBody;

    //Checking if the email is unique
    const isEmailUnique = await AuthorModel.findOne({ email: email });
    if (isEmailUnique)
      throw createError.Conflict(`Email Id: ${email} already exist`);

    //Creating the new author
    const authorData = {
      title: title,
      fname: fname,
      lname: lname,
      email: email,
      password: password,
    };

    const newAuthor = await AuthorModel.create(authorData);

    // mask the password
    newAuthor.password = undefined;

    return res.status(201).send({
      status: true,
      message: "New author registered successfully",
      data: newAuthor,
    });
  } catch (err) {
    //Filtering out joi error form the server error
    if (err.isJoi === true) err.status = 422;
    next(err);
  }
};

//----------------------------------------AUTHOR LOGIN-------------------------------------------------------//
const authorLogin = async function (req, res, next) {
  try {
    const requestBody = req.body
    const requestQuery = req.query

    //Checking whether any input data is provided
    if (!isValid(requestBody))
      throw createError.BadRequest("Input data is not provided");

    //Input should not be in query params
    if (isValid(requestQuery))
      throw createError.NotAcceptable("Invalid request");

    //Destructuring the new request body
    const { email, password } = requestBody;

    //Validating request body email
    const validEmail = await authorschema.extract('email').validateAsync(email);
    
    //Checking for password in the request body
    if(!password) throw createError.NotAcceptable("Invaliad request as password is not provided")

    //Checking the credentials
    const loginAuthor = await AuthorModel.findOne({email: validEmail});
    if(!loginAuthor) 
      throw createError.Forbidden(`Invalid login credentials: ${validEmail} is not in DB`)
    
    // Comparing the hashed password
    const result = await bcrypt.compare(password, loginAuthor.password);
    if (!result)
      throw createError.Forbidden("Invalid login credentials");

    // Setting the Token data
    const authorId = loginAuthor._id.toString();
    const payload = { authorId: authorId };
    const secretkey = process.env.JWT_SECRET;

    // creating the token
    const token = jwt.sign(payload, secretkey, {
      expiresIn: process.env.JWT_EXPIRY,
    });

    res.setHeader("Authorization", "Bearer " + token);
    return res
      .status(200)
      .send({
        status: true,
        mssg: "Login Successful",
        accessToken: token
      });
  } catch (err) {
    //Filtering out joi error form the server error
    if (err.isJoi === true) err.status = 422;
    next(err);
  }
};

module.exports = { createAuthor,authorLogin };
