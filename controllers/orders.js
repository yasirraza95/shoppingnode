const { validationResult } = require("express-validator");
const Order = require("../models/Orders");
const Cart = require("../models/Cart");

exports.addOrder = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const user_id = req.body.user_id;
  const address = req.body.address;
  const email = req.body.email;
  const phone = req.body.phone;
  const price = req.body.price;
  const orderDtl = req.body.order_detail;

  const order = new Order({
    user_id: user_id,
    address: address,
    email: email,
    phone: phone,
    price: price,
    order_detail: orderDtl.map((x) => ({
      ...x,
      product: x._id,
      total_price: x.price * x.quantity,
    })),
  });
  order
    .save()
    .then((response) => {
        res.status(200).json({
            status: true,
            message: "Order placed",
            data: { response },
          });
    })
    .catch((err) => {
        res.status(200).json({
            status: false,
            message: "Failed to place order",
            data:  err.message ,
          });
          next();
    });

  
};

exports.getAllOrders = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 10;
  let totalItems;
  Order.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Order.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((data) => {
      if (data.length > 0) {
        res.status(200).json({
          status: "TRUE",
          message: "Data retrieved",
          data: { items: data, totalItems: totalItems, perPage: perPage },
        });
      } else {
        res.status(200).json({
          status: "FALSE",
          message: "No data found",
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
  Order.find({ user_id: id })
    .then((result) => {
      res.status(200).json({
        status: "TRUE",
        message: "Data retrieved",
        data: { order: result },
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getOrderDetail = (req, res, next) => {
  const id = req.params.id;
  Order.find({ _id: id })
    .then((result) => {
      res.status(200).json({
        status: "TRUE",
        message: "Data retrieved",
        data: { order: result },
      });
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
  Order.findByIdAndRemove(id)
    .then((order) => {
      if (order) {
        res.status(200).json({
          status: "TRUE",
          message: "Record removed",
          data: { order: order },
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
