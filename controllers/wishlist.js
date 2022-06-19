const { validationResult } = require("express-validator");
const Wishlist = require("../models/Wishlist");

exports.addWishlist = (req, res, next) => {
    const user_id = req.body.user_id;
    const prod_id = req.body.prod_id;
    const quantity = req.body.quantity;
    let newQty = 0;
    Wishlist.findOne({user_id:user_id, prod_id:prod_id}).then(data => {
        if(data) {
            const error = new Error("Already in wishlist");
            error.statusCode = 404;
            throw error;
        } else {
            const wishlist = new Wishlist({
                user_id: user_id,
                prod_id: prod_id
            });
            return wishlist.save();
        }
    }).then(result => {
        if(result) {
            res.status(201).json({message:"Added to Wishlist", wishlistId: result._id})
        } else {
            res.status(500).json({message:"Error adding to wishlist"})
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
    Wishlist.findOne({user_id:id}).populate("prod_id", "name image price")
    .then(data => {
        res.status(200).json({message:"Data retrieved", wishlist: data})
    }).catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.deleteById = (req, res, next) => {
    const id = req.params.id;
    Wishlist.findByIdAndRemove(id)
    .then(wishlist => {
        if(wishlist) {
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

exports.deleteUserWishlist = (req, res, next) => {
    const id = req.params.id;
    Wishlist.deleteMany({user_id:id})
    .then(wishlist => {
        if(wishlist) {
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