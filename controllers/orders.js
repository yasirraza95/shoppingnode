const { validationResult } = require("express-validator");
const Order = require("../models/Orders");
const Cart = require("../models/Cart");

exports.addOrder = (req, res, next) => {
    const user_id = req.body.user_id;
    const address = req.body.address;
    const email = req.body.email;
    const phone = req.body.phone;

    Cart.find({user_id:user_id})
    .countDocuments()
    .then(count => {
        if(count) {
            return Cart.find({user_id:user_id}).populate("prod_id", "price");
        } else {
            const error = new Error("No cart exists");
            error.statusCode = 404;
            throw error;           
        }
    }).then(data => {
        if(data) {
            let totalPrice = 0;
            let ordDet = {
                prod_id: "",
                quantity: "",
                price: "",
                total_price: ""
            };

            data.forEach(element => {
                let prodId = element.prod_id._id; 
                let price = element.prod_id.price;
                let quantity = element.quantity;
                let prodPrice = price * quantity;
                totalPrice += prodPrice;

                ordDet["prod_id"] = prodId;
                ordDet["quantity"] = quantity;
                ordDet["price"] = price;
                ordDet["total_price"] = quantity * price;
            });

            const order = new Order({
                user_id:user_id,
                address:address,
                email:email,
                phone:phone,
                price:totalPrice,
                order_detail: ordDet
            });
            //TODO delete cart
            return order.save();
        } else {
            res.status(500).json({message:"Error placing order"})
        }
    }).then(result => {
        if(result) {
            res.status(201).json({message:"Order placed", orderId: result._id})
        } else {
            res.status(201).json({message:"Failed to place order"})
        }

    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.getByUserId = (req, res, next) => {
    const id = req.params.id;
    Order.find({user_id:id})
    .then(data => {
        res.status(200).json({message:"Data retrieved", order: data})
    }).catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}


exports.deleteById = (req, res, next) => {
    const id = req.params.id;
    Order.findByIdAndRemove(id)
    .then(order => {
        if(order) {
            res.status(200).json({message:"Record removed"})
        } else {
            const error = new Error("No record found");
            error.statusCode = 404;
            throw error;           
        }
    }).catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}