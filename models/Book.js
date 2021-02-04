const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const bookSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxLength: 255,
    },
    authorName: {
        type: String,
        trim: true,
        maxLength: 255,
    },
    description: {
        type: String,
        maxLength: 5000
    },
    image: {
        data: Buffer,
        contentType: String
    },
    price: {
        type: Number,
        trim: true,
        required: true,
        maxLength: 32
    },
    category: {
        type: ObjectId,
        ref: 'Category',
        required: true
    },
    addedBy: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
}, {timestamps: true});

module.exports = mongoose.model("Book", bookSchema);