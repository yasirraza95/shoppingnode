const { validationResult } = require("express-validator");
const Wishlist = require("../models/Wishlist");

exports.addWishlist = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const user_id = req.body.user_id;
  const prod_id = req.body.prod_id;

  Wishlist.findOne({ user_id: user_id, prod_id: prod_id })
    .then((data) => {
      if (data) {
        const error = new Error("Already in wishlist");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
      } else {
        const wishlist = new Wishlist({
          user_id: user_id,
          prod_id: prod_id,
        });
        return wishlist.save();
      }
    })
    .then((result) => {
      if (result) {
        res.status(201).json({
          status: "TRUE",
          message: "Added to Wishlist",
          data: { wishlistId: result._id },
        });
      } else {
        res.status(500).json({
          status: "FALSE",
          message: "Error adding to wishlist",
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

exports.getByUserId = (req, res, next) => {
  const id = req.params.id;
  Wishlist.find({ user_id: id })
    .populate("prod_id", "name image price")
    .then((data) => {
      if (data.length > 0) {
        res.status(200).json({
          status: true,
          message: "Data retrieved",
          data: { wishlist: data },
        });
      } else {
        res.status(404).json({
          status: false,
          message: "Sorry no data found",
          data: {},
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

exports.existItem = (req, res, next) => {
  const userId = req.body.user_id;
  const prodId = req.body.prod_id;
  Wishlist.findOne({ user_id: userId, prod_id: prodId })
    .then((data) => {
      if (data !== null) {
        res.status(409).json({
          status: false,
          message: "This product already exists in wishilist",
          data: {},
        });
      } else {
        res.status(200).json({
          status: true,
          message: "This product not found in wishlist",
          data: {},
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

exports.deleteById = (req, res, next) => {
  const id = req.params.id;
  Wishlist.findByIdAndRemove(id)
    .then((wishlist) => {
      if (wishlist) {
        res.status(200).json({
          status: "TRUE",
          message: "Record removed",
          data: { wishlist: wishlist },
        });
      } else {
        return res
          .status(404)
          .json({ status: "FALSE", message: "No data found", data: [] });
      }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteUserWishlist = (req, res, next) => {
  const id = req.params.id;
  Wishlist.deleteMany({ user_id: id })
    .then((wishlist) => {
      if (wishlist) {
        res.status(200).json({
          status: "TRUE",
          message: "Record removed",
          data: { wishlist: wishlist },
        });
      } else {
        return res
          .status(404)
          .json({ status: "FALSE", message: "No data found", data: [] });
      }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
