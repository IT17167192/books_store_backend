//for check validity of the token
const expressJwt = require('express-jwt');

exports.create_user_validator = (req, res, next) => {
    req.check('name', 'Name is required!').notEmpty();
    req.check('email', 'Email is required!')
        .notEmpty()
        .matches(/.+\@.+\..+/)
        .withMessage("Must be a valid email address");
    req.check('password', 'Password is required!')
        .notEmpty()
        .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
        .withMessage("Password must be at least 6 characters, one letter and one number");

    //grab all the errors
    const errors = req.validationErrors();

    if(errors){
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({error: true, message: errors});
    }

    next();
}

exports.user_login_validator = (req, res, next) => {
    req.check('email', 'Email is required!')
        .notEmpty()
        .matches(/.+\@.+\..+/)
        .withMessage("Must be a valid email address");
    req.check('password', 'Password is required!')
        .notEmpty()

    //grab all the errors
    const errors = req.validationErrors();

    if(errors){
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({error: true, message: errors});
    }

    next();
}

//category validations
exports.category_validator = (req, res, next) => {
    req.check('name', 'Category must be added!').notEmpty()
        .isLength({
            min: 1,
        })
        .withMessage('Category name cannot be empty')

    //grab all the errors
    const errors = req.validationErrors();

    if (errors) {
        return res.status(400).json({error: true, message: errors});
    }
    next();
};

exports.add_book_validator = (req, res, next) => {
    console.log(req.body);
    req.check('name', 'Name cannot be empty!').notEmpty()
    req.check('price', 'Price cannot be empty!').notEmpty()
    req.check('category', 'Category cannot be empty!').notEmpty()
    req.check('addedBy', 'addedBy cannot be empty!').notEmpty()

    //grab all the errors
    const errors = req.validationErrors();

    if (errors) {
        return res.status(400).json({error: true, message: errors});
    }
    next();
}

exports.required_login = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: "authorize"
});

exports.is_admin = (req, res, next) => {
    if(req.authorize.role !== 1)
        return res.status(403).json({error: true, message: "Access Denied!"});

    next();
};

exports.is_auth = (req, res, next) => {
    //if admin, give access
    if(req.authorize.role === 1){
       next();
    }else{
        //else only the actual user can access the resource
        let user = (req.userObj._id == req.authorize._id);

        if(!user)
            return res.status(403).json({error: true, message: "Unauthorized Access!"})

        next();
    }
}
