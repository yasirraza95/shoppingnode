const { validationResult } = require("express-validator");
const Product = require("../models/Product");

exports.getAllProducts = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 10;
    let totalItems;
    Product.find().countDocuments()
    .then(count => {
        totalItems = count;
        return Product.find().populate("sub_cat_id", "name").skip((currentPage - 1) * perPage).limit(perPage);
    })
    .then(data => {
        res.status(200).json({
            message: "Data retrieved",
            data: data,
            totalItems: totalItems,
            perPage: perPage
        });
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.addProduct = (req, res, next) => {
    const name = req.body.name;
    const image = req.body.image;
    const price = req.body.price;
    const sub_cat_id = req.body.sub_cat_id;
    Product.findOne({name: name}).then(data => {
        if(data) {
            const error = new Error("Name already exists");
            error.statusCode = 422;
            throw error;
        }
        const product = new Product({
            name: name,
            image: image,
            price: price,
            sub_cat_id: sub_cat_id
        });
        return product.save();
    }).then(result => {
        if(result) {
            res.status(201).json({message:"Product Added", productId: result._id})
        } else {
            res.status(500).json({message:"Error adding product"})
        }
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.getProduct = (req, res, next) => {
    const id = req.params.id;
    Product.findById(id).populate("sub_cat_id", "name")
    .then(data => {
        res.status(200).json({message:"Data retrieved", product: data})
    }).catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.updateProduct = (req, res, next) => {
    const id = req.params.id;
    const name = req.body.name;
    Product.findById(id).populate("cat_id", "name")
    .then(product => {
        if(product) {
            product.name = name;
            product.save();
            res.status(200).json({message:"Data updated", product: product})
        } else {
            const error = new Error("No data found");
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

exports.deleteProduct = (req, res, next) => {
    const id = req.params.id;
    Product.findByIdAndRemove(id)
    .then(product => {
        if(product) {
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