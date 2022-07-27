const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const BookModel = require("../models/bookModel");
const { objectIdschema } = require("../utils/joiValidator")

const authentication = async function (req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) throw createError.NotFound("Token not found");

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET, {
      ignoreExpiration: true,
    });
    if (Date.now() > decodedToken.exp * 1000)
      throw createError.RequestTimeout(" session expired please login again");
    req.decodedToken = decodedToken;
    next();
  } catch (err) {
    if (err.isjwt == true) err.status(401);
    next(err);
    // return res.status(401).send({ message: "authentication has failed" });
  }
};

const authorizationByAuthorID = async (req, res, next) => {
  try {
    const decodedToken = req.decodedToken;
    const authorId = req.body.authorId;

    if (decodedToken.authorId !== authorId)
      throw createError.Forbidden("Unauthorized access");
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { authentication,authorizationByAuthorID }