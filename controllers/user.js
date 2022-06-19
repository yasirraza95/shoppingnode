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
    User.findOne({username:username})
    .then(user => {
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

        if(loadedUser.status == "INACTIVE") {
            const error = new Error("Activate your account");
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({
            username: loadedUser.username,
            userId: loadedUser._id.toString()
        }, "somesupersecret", {expiresIn: "10h"});
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

exports.forgotPassword = (req, res, next) => {
    const email = req.body.email;

    User.findOne({email: email})
    .then(user => {
        if(!user) {
            const error = new Error("No user found against requested email");
            error.statusCode = 404;
            throw error;
        }
        let token = Math.random(new Date()).toString();
        user.reset_password_token = token.split(".")[1];
        return user.save();
    })
    .then(result => {
        if(result) {
            res.status(200).json({message: "An email has been sent. Kindly check your inbox"})
        } else {
            res.status(200).json({message: "Error sending email"})
        }
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.checkForgotToken = (req, res, next) => {
    const token = req.query.token;
    User.findOne({reset_password_token: token})
    .then(user => {
        if(!user) {
            const error = new Error("No data found against token");
            error.statusCode = 404;
            throw error;
        } else {
            res.status(200).json({message: "Token found"})
        }
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.activateAccount = (req, res, next) => {
    const username = req.params.username;
    User.findOne({username: username})
    .then(user => {
        if(!user) {
            const error = new Error("No user found");
            error.statusCode = 404;
            throw error;
        } else if(user.status == "ACTIVE") {
            const error = new Error("User already activated");
            error.statusCode = 422;
            throw error;
        } else {
            user.status = "ACTIVE";
            user.save();
            res.status(200).json({message: "User activated successfully"})
        }
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.contact = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const subject = req.body.subject;
    const message = req.body.message;
    //TODO send email
    res.status(200).json({message: "Your query has been sent"})
}