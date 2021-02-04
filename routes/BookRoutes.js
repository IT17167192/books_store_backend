const express = require('express');
const router = express.Router();

const {add_book_validator, required_login, is_admin} = require('../validators/index');
const {addBook, getAllBooks, getBooksByCategory, deleteBook, getPopularBooks, getImage, updateBookById, getBookByIdMiddleware} = require('../controllers/BookController');
const {getCategoryByIdMiddleware} = require('../controllers/CategoryController');

router.post('/book/create', required_login, is_admin, addBook);
router.get('/book/all', getAllBooks);
router.get('/book/popular', getPopularBooks);
router.get('/book/by/category/:categoryId', getBooksByCategory);
router.get('/book/image/:bookId', getImage);

router.put('/book/:bookId', required_login, is_admin, updateBookById);

router.delete('/book/:bookId', required_login, is_admin, deleteBook);

router.param("categoryId", getCategoryByIdMiddleware);
router.param("bookId", getBookByIdMiddleware);

module.exports = router;