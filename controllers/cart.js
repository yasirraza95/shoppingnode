const { validationResult } = require("express-validator");
const Cart = require("../models/Cart");

exports.addCart = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    
    const user_id = req.body.user_id;
    const prod_id = req.body.prod_id;
    const quantity = req.body.quantity;
    let newQty = 0;
    Cart.findOne({user_id:user_id, prod_id:prod_id}).then(data => {
        if(data) {
            newQty = data.quantity;
            newQty++;
            
            const filter = {user_id:user_id};
            const update = {quantity:newQty};
            return Cart.findOneAndUpdate(filter, update);
        } else {
            const cart = new Cart({
                user_id: user_id,
                prod_id: prod_id,
                quantity: quantity
            });
            return cart.save();
        }
    }).then(result => {
        if(result) {
            //TODO increase quantity message
            res.status(201).json({status:"TRUE", message:"Added to Cart", data: {cartId: result._id} })
        } else {
            res.status(500).json({status:"FALSE", message:"Error adding to cart", data:[]})
        }
    }).catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.getByUserId = (req, res, next) => {
    const id = req.params.id;
    Cart.findOne({user_id:id}).populate("prod_id", "name image price")
    .then(data => {
        res.status(200).json({status:"TRUE", message:"Data retrieved", data: {cart: data}})
    }).catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.addQuantity = (req, res, next) => {
    const id = req.params.id;
    let newQty = 0;
    Cart.findById(id).then(data => {
        newQty = data.quantity;
    }).catch(err => {
        throw err;
    });

    newQty++;
    const filter = {_id:id};
    const update = {quantity:newQty};

    Cart.findOneAndUpdate(filter, update).then(result => {
        res.status(200).json({status:"TRUE", message:"Quantity increased", data:{result:result}})
    }).catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.removeQuantity = (req, res, next) => {
    const id = req.params.id;
    let newQty = 0;
    Cart.findById(id).then(data => {
        newQty = data.quantity;
    }).catch(err => {
        throw err;
    });

    newQty--;
    const filter = {_id:id};
    const update = {quantity:newQty};

    Cart.findOneAndUpdate(filter, update).then(result => {
        res.status(200).json({status:"TRUE", message:"Quantity decreased", data:{result:result}})
    }).catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.deleteById = (req, res, next) => {
    const id = req.params.id;
    Cart.findByIdAndRemove(id)
    .then(cart => {
        if(cart) {
            res.status(200).json({status:"TRUE", message:"Record removed", data:{cart:cart}})
        } else {
            return res.status(404).json({status:"FALSE", message:"No record found", data:[]})
        }
    }).catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.deleteUserCart = (req, res, next) => {
    const id = req.params.id;
    Cart.deleteMany({user_id:id})
    .then(cart => {
        if(cart) {
            res.status(200).json({status:"TRUE", message:"Record removed", data:{cart:cart}})
        } else {
            return res.status(404).json({status:"FALSE", message:"No record found", data:[]})
        }
    }).catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}
