const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


const authorSchema = new mongoose.Schema({
    title: {
        type: String,
        enum: ['Mr','Mrs','Miss'],
        required: [true, 'title must be provided'],
        trim: true
    },
    fname: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    lname: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
        lowercase: true,
        trim: true,
    },
    password: { 
        type: String,
        required: [true, "Password is required"]
    }
}, { timestamps: true })

// hashing the password
authorSchema.pre('save', async function(next) {
    try{
        const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUND))
        const hashedPassword = await bcrypt.hash(this.password, salt)
        this.password = hashedPassword
        next()
    } catch(err){
        next(err)
    }
})

module.exports = mongoose.model('Author', authorSchema)