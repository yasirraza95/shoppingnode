const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error = new Error("Validation failed");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const name = req.body.name;
    const email = req.body.email;
    User.findOne({email: email}).then(result => {
        if(result) {
            const error = new Error("Email already exists");
            error.statusCode = 422;
            throw error;
        }
    }).catch(error => {
        next(error);
    });
    const username = req.body.username;
    User.findOne({username: username}).then(result => {
        if(result) {
            const error = new Error("Username already exists");
            error.statusCode = 422;
            throw error;
        }
    }).catch(error => {
        next(error);
    });
    const phone = req.body.phone;
    const password = req.body.password;
    bcrypt.hash(password, 12).then(hashedPass => {
        const user = new User({
            email: email,
            password: hashedPass,
            name: name,
            username: username,
            phone: phone
          });
          return user.save();
    }).then(result => {
        res.status(201).json({message:"User created", userId: result._id})
    }).catch(error => {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    })
}

exports.login = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    let loadedUser;
    User.findOne({username:username}).then(user => {
        if(!user) {
            const error = new Error("No user found against this username");
            error.statusCode = 401;
            throw error;
        }
        loadedUser = user;
        return bcrypt.compare(password, user.password);
    }).then(isEqual => {
        if(!isEqual) {
            const error = new Error("Wrong password");
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({
            username: loadedUser.username,
            userId: loadedUser._id.toString()
        }, "somesupersecret", {expiresIn: "1h"});
        res.status(200).json({token: token, userId: loadedUser._id.toString()});
    }).catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.getProfile = (req, res, next) => {
    const id = req.params.id;
    User.findById(id)
    .then(user => {
        if(!user) {
            const error = new Error("No user found against requested id");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({message: "User found successfully", user:user})
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.updateProfile = (req, res, next) => {
    const id = req.params.id;
    const name = req.body.name;
    const phone = req.body.phone;

    User.findById(id)
    .then(user => {
        if(!user) {
            const error = new Error("No user found against requested id");
            error.statusCode = 404;
            throw error;
        }
        user.name = name;
        user.phone = phone;
        return user.save();
    })
    .then(result => {
        res.status(200).json({message: "Profile update successfully", user:result})
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}