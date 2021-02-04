const Category = require('../models/Category');
const {errorHandler} = require('../validators/dbErrorHandler');

// Get Category by ID
exports.getCategoryByIdMiddleware = (req, res, next, id)  => {
    Category.findById(id).exec((err, cat) => {
        if(err || !cat){
            return res.status(400).json({
                error: true, message: "Category not found"
            });
        }

        req.category = cat;
        next();
    });
};

// Create Category
exports.create = (req, res) => {
    const category = new Category(req.body);
    category.save((err, data) => {
        if(err){
            return res.status(400).json({
                error: true,
                message: errorHandler(err)
            });
        }

        return res.status(200).json({error:false, message: data})
    });
};

// Get Category by ID
exports.getCategoryByIdMiddleware = (req, res, next, id)  => {
    Category.findById(id).exec((err, cat) => {
        if(err || !cat){
            return res.status(400).json({
                error: "Not a Category!"
            });
        }

        req.category = cat;
        next();
    });
};

exports.getAllCategories = (req, res) => {
    Category.find().exec((err, data) => {
        if(err){
            return res.status(400).json({
                error: true,
                message: errorHandler(err)
            });
        }
        res.status(200).json({error: false, message: data});

    });
}

//Delete Category by ID
exports.deleteCategoryById = (req, res) => {
    const category = req.category;
    category.remove((err, data) => {
        if(err){
            return res.status(400).json({
                error: true,
                message: errorHandler(err)
            });
        }
        res.status(200).json({
            error: false,
            message: "Category deleted"
        });
    });
};

//update Category Using the ID
exports.updateCategoryById = (req, res) => {
    const category = req.category;
    category.name = req.body.name;
    category.save((err, data) => {
        console.log(err);
        console.log(data);
        if(err){
            return res.status(400).json({
                error: true, message: errorHandler(err)
            });
        }
        res.status(200).json({error: false, message: data});
    });
};