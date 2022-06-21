const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({status:"FALSE", message:"Validation failed", data:[]})
    }
    const name = req.body.name;
    const email = req.body.email;
    User.findOne({email: email}).then(result => {
        if(result) {
            return res.status(422).json({status:"FALSE", message:"Email already exists", data:[]})
        }
    }).catch(error => {
        next(error);
    });
    const username = req.body.username;
    User.findOne({username: username}).then(result => {
        if(result) {
            return res.status(422).json({status:"FALSE", message:"Username already exists", data:[]})
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
        return res.status(201).json({status:"TRUE", message:"User created", data: {userId: result._id}})
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
            return res.status(401).json({status:"FALSE", message:"No user found against this username", data:[]})
        }
        loadedUser = user;
        return bcrypt.compare(password, user.password);
    }).then(isEqual => {
        if(!isEqual) {
            return res.status(401).json({status:"FALSE", message:"Wrong Password", data:[]})
        }

        if(loadedUser.status == "INACTIVE") {
            return res.status(401).json({status:"FALSE", message:"Activate your account", data:[]})
        }

        const token = jwt.sign({
            username: loadedUser.username,
            userId: loadedUser._id.toString()
        }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRY});
        res.status(200).json({status:"TRUE", message:"", data: {token: token, userId: loadedUser._id.toString()}});
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
            return res.status(404).json({status:"FALSE", message:"No user found against requested id", data:[]})
        }

        res.status(200).json({status:"TRUE", message: "User found successfully", data:{user:user}})
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
            return res.status(404).json({status:"FALSE", message: "No user found against requested id", user:user})
        }
        user.name = name;
        user.phone = phone;
        return user.save();
    })
    .then(result => {
        res.status(200).json({status:"TRUE", message: "Profile update successfully", user:result})
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
            return res.status(404).json({status:"TRUE", message: "No user found against requested email", user:result})
        }
        let token = Math.random(new Date()).toString();
        user.reset_password_token = token.split(".")[1];
        return user.save();
    })
    .then(result => {
        if(result) {
            res.status(200).json({status:"TRUE", message: "An email has been sent. Kindly check your inbox", data:[]})
        } else {
            res.status(500).json({status:"FALSE", message: "Error sending email", data:[]})
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
            return res.status(404).json({status:"FALSE", message: "No data found against token", data:[]})
        } else {
            res.status(200).json({status:"TRUE", message: "Token found", data:[]})
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
            return res.status(404).json({status:"FALSE", message: "No user found", data:[]})
        } else if(user.status == "ACTIVE") {
            return res.status(422).json({status:"FALSE", message: "User already activated", data:[]})
        } else {
            user.status = "ACTIVE";
            user.save();
            res.status(200).json({status:"TRUE", message: "User activated successfully", data:[]})
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
    res.status(200).json({status:"TRUE", message: "Your query has been sent", data:[]})
}