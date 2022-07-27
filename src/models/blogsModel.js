const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true
    },
    body: {
        type: String,
        required: [true, "Body is required"],
        trim: true
    },
    authorId: {
        type: ObjectId,
        required: [true, "authorId must be provided"],
        ref: "Author",
        trim: true,
    },
    tags: [{
        type: String,
        trim: true
    }],
    category: {
        type: String,
        required: [true, "Blog category is required"],
        trim: true,
    },
    subcategory: [{ 
        type: String, 
        trim: true 
    }],
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    },
    deletedAt: { 
        type: Date, 
        default: null
     },
    isDeleted: { 
        type: Boolean, 
        default: false 
    },
    publishedAt: { 
        type: Date, 
        default: null 
    },
    isPublished: { 
        type: Boolean, 
        default: false 
    },
  },
  { timestamps: true });

  module.exports = mongoose.model('Blog', blogSchema)