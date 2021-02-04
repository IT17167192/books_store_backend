const User = require('../models/User');
const {errorHandler} = require('../validators/dbErrorHandler');

//for token generation
const jwt = require('jsonwebtoken');

//create user
exports.createUser = (req, res) => {
    //get user body
    const user = new User(req.body);

    //save in the db
    user.save((err, user) => {
        if(err) {
            //send error
            return res.status(400).json({error: true, message: errorHandler(err)})
        }

        //generate token
        const token = jwt.sign({_id: user._id, name: user.name, email: user.email, role: user.role}, process.env.JWT_SECRET);

        //save the token in the cookie
        res.cookie('t', token, {expire: new Date() + 3600});

        //hash password and salt removing from the response
        user.hashed_password = undefined;
        user.salt = undefined;

        const {email, name, role, _id} = user;
        return res.status(200).json({error: false, token: token, user: {email, name, role, _id}});
    })
};

//create user
exports.createAdminUser = (req, res) => {
    //get user body
    const user = new User(req.body);

    //save in the db
    user.save((err, user) => {
        if(err) {
            //send error
            return res.status(400).json({error: true, message: errorHandler(err)})
        }

        //hash password and salt removing from the response
        user.hashed_password = undefined;
        user.salt = undefined;

        return res.status(200).json({error: false, message: user});
    })
};

//login user
exports.login = (req, res) => {
    //find user by email
    const {email, password} = req.body;

    User.findOne({email}, (err, user) => {
        if (err||!user)
            return res.status(400).json({error: true, message: 'User doesn\'t exist!'})

        //if the user exists
        //check password
        if(!user.authenticate(password))
            return res.status(401).json({error: true, message: 'Incorrect Password!'})

        //generate token
        const token = jwt.sign({_id: user._id, name: user.name, email: user.email, role: user.role}, process.env.JWT_SECRET);

        //save the token in the cookie
        res.cookie('t', token, {expire: new Date() + 3600});

        //remove hash password and salt from the response
        user.hashed_password = undefined;
        user.salt = undefined;
        const {email, name, role, _id} = user;
        return res.status(200).json({error: false, token: token, user: {email, name, role, _id}});
    })
}

exports.logout = (req, res) => {
    res.clearCookie("t");
    res.json({error: false, message: "Logout success!"});
}

exports.getUserByIdMiddleware = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if(err || !user)
            return res.status(400).json({error: true, message: "User not found!"})

        user.hashed_password = undefined;
        user.salt = undefined;

        req.userObj = user;

        next();
    })
}

exports.getUserById = (req, res) => {
    console.log(req.userObj._id);
    User.findById(req.userObj._id).exec((err, user) => {
        if(err || !user)
            return res.status(400).json({error: true, message: "User not found!"})

        user.hashed_password = undefined;
        user.salt = undefined;

        return res.status(200).json({error: true, message: user})
    })
}

exports.getAllUsers = (req, res) => {
    let orderBy = req.query.orderBy ? req.query.orderBy:'ASC';
    let sortBy = req.query.sortBy ? req.query.sortBy:'_id';

    User.find()
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