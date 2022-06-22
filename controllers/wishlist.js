const { validationResult } = require("express-validator");
const Wishlist = require("../models/Wishlist");

exports.addWishlist = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({status:"FALSE", message:"Validation failed", data:errors.array()})
    }

    const user_id = req.body.user_id;
    const prod_id = req.body.prod_id;

    Wishlist.findOne({user_id:user_id, prod_id:prod_id}).then(data => {
        if(data) {
            return res.status(422).json({status:"FALSE", message:"Already in wishlist", data: []})
        } else {
            const wishlist = new Wishlist({
                user_id: user_id,
                prod_id: prod_id
            });
            return wishlist.save();
        }
    }).then(result => {
        if(result) {
            res.status(201).json({status:"TRUE", message:"Added to Wishlist", data: {wishlistId: result._id}})
        } else {
            res.status(500).json({status:"FALSE", message:"Error adding to wishlist", data:[]})
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
        res.status(200).json({status:"TRUE", message:"Data retrieved", data:{wishlist: data}})
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
            res.status(200).json({status:"TRUE", message:"Record removed", data:{wishlist:wishlist}})
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

exports.deleteUserWishlist = (req, res, next) => {
    const id = req.params.id;
    Wishlist.deleteMany({user_id:id})
    .then(wishlist => {
        if(wishlist) {
            res.status(200).json({status:"TRUE", message:"Record removed", data:{wishlist:wishlist}})
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