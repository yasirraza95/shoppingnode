const { validationResult } = require("express-validator");
const Order = require("../models/Orders");
const Cart = require("../models/Cart");

exports.addOrder = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({status:"FALSE", message:"Validation failed", data:errors.array()})
    }
    
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
            return res.status(404).json({status:"FALSE", message:"No cart exists", data:[]})
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
            res.status(500).json({status:"FALSE", message:"Error placing order", data:[]})
        }
    }).then(result => {
        if(result) {
            res.status(200).json({status:"TRUE", message:"Order placed", data:{orderId: result._id}})
        } else {
            res.status(500).json({status:"FALSE", message:"Failed to place order", data:[]})
        }

    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}


exports.getAllOrders = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 10;
    let totalItems;
    Order.find().countDocuments()
    .then(count => {
        totalItems = count;
        return Order.find().skip((currentPage - 1) * perPage).limit(perPage);
    })
    .then(data => {
        if(data.length > 0) {
            res.status(200).json({
                status: "TRUE", message: "Data retrieved", data: {items: data, totalItems: totalItems, perPage: perPage}, 
            });
        } else {
            res.status(200).json({
                status: "FALSE", message: "No data found", data: []
            });
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
    .then(result => {
        res.status(200).json({status:"TRUE", message:"Data retrieved", data: {order: result}})
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
            res.status(200).json({status:"TRUE", message:"Record removed", data:{order:order}})
        } else {
            return res.status(404).json({status:"FALSE", message:"No data found", data:[]})
        }
    }).catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}
