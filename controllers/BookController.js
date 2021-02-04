const Book = require('../models/Book');
const formidable = require('formidable');
const {errorHandler} = require('../validators/dbErrorHandler');
const fs = require('fs');
const lodash = require('lodash');

//get book by Id
exports.getBookByIdMiddleware = (req, res, next, id) => {
    Book.findById(id).populate('category').populate('addedBy').exec((err, book) => {
        if(err || !book){
            return res.status(400).json({
                error: true,
                message: "Book not found"
            });
        }

        req.book = book;
        next();
    });
};

exports.addBook = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if(err){
            return res.status(400).json({
                error: true,
                message: "Image could not be uploaded"
            });
        }

        // Check for all the variables
        const {name, description, category, price, rating, addedBy} = fields;

        // Validating the variables
        if(!name || !description || !category || !price || !rating || !addedBy){
            return res.status(400).json({
                error: true,
                message: "Complete all fields!"
            });
        }

        let book = new Book(fields);

        // Image validation
        if(files.image){
            if(files.image.size > 5000000){
                return res.status(400).json({
                    error: true,
                    message: "Image size is too large. Upload an image <5MB"
                });
            }
            book.image.data = fs.readFileSync(files.image.path);
            book.image.contentType = files.image.type;
        }

        book.save((err, success) => {
            if(err){
                return res.status(400).json({
                    error: true,
                    message: errorHandler(err)
                });
            }

            res.status(200).json({error: false, message: success});
        });
    });
};

exports.getAllBooks = (req, res) => {
    let orderBy = req.query.orderBy ? req.query.orderBy:'ASC';
    let sortBy = req.query.sortBy ? req.query.sortBy:'_id';

    Book.find()
        .select("-image")
        .populate('category', '_id name')
        .populate('addedBy', 'name')
        .sort([[sortBy, orderBy]])
        .exec((err, data) => {
            if(err){
                res.status(400).json({
                    error: true, message: 'No data found!'
                });
            }

            return res.status(200).json({error: false, message: data});
        });
};

//get products by category
exports.getBooksByCategory = (req, res) => {

    let limitTo = req.query.limitTo ? parseInt(req.query.limitTo):10;
    Book.find({category: req.category})
        .select("-image")
        .populate('category', '_id name')
        .populate('addedBy', 'name')
        .limit(limitTo)
        .exec((err, data) => {
            if(err){
                res.status(400).json({
                    error: true, message: 'No data found!'
                });
            }

            return res.status(200).json({error: false, message: data});
        });
};

// Delete Product
exports.deleteBook = (req, res) => {
    let book = req.book;
    book.remove((err, dlt) => {
        if(err){
            return res.status(400).json({
                error: true,
                message: errorHandler(err)
            });
        }

        return res.json({ error: false, message: 'Book deleted!' });
    });
};

exports.getPopularBooks = (req, res) => {
    let limitTo = 6;
    Book.find()
        .select("-image")
        .populate('category', '_id name')
        .populate('addedBy', 'name')
        .sort({ rating : -1 } )
        .limit(limitTo)
        .exec((err, data) => {
            if(err){
                res.status(400).json({
                    error: true, message: 'No data found!'
                });
            }

            return res.status(200).json({error: false, message: data});
        });
}

//get book image
exports.getImage = (req, res, next) => {
    if(req.book.image.data){
        res.set('Content-Type', req.book.image.contentType);
        return res.send(req.book.image.data);
    }
    next();
};

// Update Book
exports.updateBookById = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if(err){
            return res.status(400).json({
                error: true, message: "Image could not be uploaded"
            });
        }

        // Accessing the existing book
        let book = req.book;

        // Replace existing Book info
        book = lodash.extend(book, fields);
        console.log(book);

        // Image validation
        if(files.image){

            if(files.image.size > 5000000){
                return res.status(400).json({
                    error: true,
                    message: "Image size is too large. Upload an image <5MB"
                });
            }
            book.image.data = fs.readFileSync(files.image.path);
            book.image.contentType = files.image.type;
        }

        book.save((err, success) => {
            if(err){
                console.log(err);

                return res.status(400).json({
                    error: true, message: errorHandler(err)
                });
            }

            res.status(200).json({error: false, message: success});
        });
    });
};