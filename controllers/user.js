const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const WishlistController = require("./wishlist");

var transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const name = req.body.name;
  const email = req.body.email;
  User.findOne({ email: email })
    .then((result) => {
      if (result) {
        res.status(422).json({
          status: true,
          message: "Email already exists",
          data: {},
        });
        next();
      }
    })
    .catch((error) => {
      next(error);
    });
  const username = req.body.username;
  User.findOne({ username: username })
    .then((result) => {
      if (result) {
        res.status(422).json({
          status: true,
          message: "Username already exists",
          data: {},
        });
        next();
      }
    })
    .catch((error) => {
      next(error);
    });
  const phone = req.body.phone;
  const password = req.body.password;
  bcrypt
    .hash(password, 12)
    .then((hashedPass) => {
      const user = new User({
        email: email,
        password: hashedPass,
        name: name,
        username: username,
        phone: phone,
      });
      return user.save();
    })
    .then((result) => {
      let userName = result.username;
      let activationUrl = process.env.TEST_URL + "activation/" + userName;

      let emailData = {
        from: process.env.EMAIL_FROM,
        to: result.email,
        subject: "Account Registration",
        html: `Congratulations! Your account has been created. Kindly visit the link to activate your account
             <a href="${activationUrl}">${activationUrl}</a>`,
      };
      transporter.sendMail(emailData, (err, info) => {
        if (err) {
          res.status(500).json({
            status: false,
            message: "User created but error in sending email",
            data: {},
          });
        } else {
          res.status(201).json({
            status: true,
            message: "Account created. Check your email inbox",
            data: {},
          });
        }
      });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

exports.login = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  let loadedUser;
  User.findOne({ username: username, type: "USER" })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          status: false,
          message: "Username or password is wrong",
          data: [],
        });
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        return res.status(401).json({
          status: false,
          message: "Username or password is wrong",
          data: [],
        });
      }
      if (loadedUser.status == "INACTIVE") {
        return res.status(401).json({
          status: false,
          message: "Activate your account",
          data: [],
        });
      }

      const token = jwt.sign(
        {
          id: loadedUser._id,
          role: loadedUser.type,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY }
      );
      res.status(200).json({
        status: true,
        message: "User successfully logged in",
        data: {
          role: loadedUser.type,
          userId: loadedUser._id.toString(),
          username: loadedUser.username,
          email: loadedUser.email,
          name: loadedUser.name,
          phone: loadedUser.phone,
        },
        token: token,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.adminLogin = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  let loadedUser;
  User.findOne({ username: username, type: "ADMIN" })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          status: false,
          message: "Username or password is wrong",
          data: [],
        });
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        return res.status(401).json({
          status: false,
          message: "Username or password is wrong",
          data: [],
        });
      }

      const token = jwt.sign(
        {
          id: loadedUser._id,
          role: loadedUser.type,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY }
      );
      res.status(200).json({
        status: true,
        message: "Admin successfully logged in",
        data: {
          role: loadedUser.type,
          userId: loadedUser._id.toString(),
          username: loadedUser.username,
          email: loadedUser.email,
          name: loadedUser.name,
          phone: loadedUser.phone,
        },
        token: token,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getProfile = (req, res, next) => {
  const id = req.params.id;
  User.findById(id)
    .then((user) => {
      if (!user) {
        res.status(404).json({
          status: false,
          message: "No user found against requested id",
          data: [],
        });
      } else {
        res.status(200).json({
          status: "TRUE",
          message: "User found successfully",
          data: { user: user },
        });
      }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateProfile = (req, res, next) => {
  const id = req.params.id;
  const name = req.body.name;
  const phone = req.body.phone;

  User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          status: false,
          message: "No user found against requested id",
          data: user,
        });
      }
      user.name = name;
      user.phone = phone;
      return user.save();
    })
    .then((result) => {
      res.status(200).json({
        status: true,
        message: "Profile update successfully",
        data: {
          role: result.type,
          userId: result._id,
          username: result.username,
          email: result.email,
          name: result.name,
          phone: result.phone,
        },
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.forgotPassword = (req, res, next) => {
  const email = req.body.email;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          status: "TRUE",
          message: "No user found against requested email",
          user: result,
        });
      }
      let token = Math.random(new Date()).toString();
      user.reset_password_token = token.split(".")[1];
      return user.save();
    })
    .then((result) => {
      if (result) {
        let emailData = {
          from: process.env.EMAIL_FROM,
          to: result.email,
          subject: "Forgot Password",
          html: `Hi ${result.name}! You have requested a forgot password request. Kindly visit the link to generate new password. <a href="${process.env.TEST_URL}">${process.env.TEST_URL}</a>`,
        };

        transporter.sendMail(emailData, (err, info) => {
          if (err) {
            res.status(500).json({
              status: false,
              message: "Error sending email",
              data: err,
            });
          } else {
            res.status(200).json({
              status: true,
              message: "An email has been sent. Kindly check your inbox",
              data: info,
            });
          }
        });
      } else {
        res.status(500).json({
          status: false,
          message: "Error initializing forgot request",
          data: [],
        });
      }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.checkForgotToken = (req, res, next) => {
  const token = req.query.token;
  User.findOne({ reset_password_token: token })
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          status: false,
          message: "No data found against token",
          data: [],
        });
      } else {
        res
          .status(200)
          .json({ status: true, message: "Token found", data: [] });
      }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.activateAccount = (req, res, next) => {
  const username = req.params.username;

  User.findOne({ username: username })
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .json({ status: false, message: "No user found", data: [] });
      } else if (user.status == "ACTIVE") {
        return res.status(422).json({
          status: false,
          message: "User already activated",
          data: [],
        });
      } else {
        user.status = "ACTIVE";
        user.save();
        res.status(200).json({
          status: true,
          message: "User activated successfully",
          data: [],
        });
      }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.contact = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const subject = req.body.subject;
  const message = req.body.message;

  let emailData = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_ADMIN,
    subject: "Contact Us",
    html: `<h4>Name:</h4> ${name} <br/><h4>Email:</h4> ${email} <br/><h4>Subject:</h4> ${subject}
         <br><h4>Message:</h4> ${message}`,
  };

  transporter.sendMail(emailData, (err, info) => {
    if (err) {
      res
        .status(500)
        .json({ status: false, message: "Error sending email", data: err });
    } else {
      res.status(200).json({
        status: true,
        message: "Your query has been sent",
        data: info,
      });
    }
  });
};
