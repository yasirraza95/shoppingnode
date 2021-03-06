const { validationResult } = require("express-validator");
const Product = require("../models/Product");
const path = require("path");

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
        if(data.length > 0) {
            res.status(200).json({
                status: "TRUE", message: "Data retrieved", data: {items: data, totalItems: totalItems, perPage: perPage}, 
            });
        } else {
            res.status(404).json({
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

exports.addProduct = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const name = req.body.name;
    const file = req.files.image;
    const price = req.body.price;
    const sub_cat_id = req.body.sub_cat_id;

    Product.findOne({name: name}).then(result => {
        if(result) {
            const error = new Error('Name already exists');
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }
        const product = new Product({
            name: name,
            image: file.name,
            price: price,
            sub_cat_id: sub_cat_id
        });
        const filePath =  "./uploads/" + file.name;
        const extension = path.extname(file.name);
        const allowedExtensions = [".png", ".jpg", ".jpeg"];
        if(!allowedExtensions.includes(extension)) {
            const error = new Error('File type not allowed');
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        } else {
            file.mv(filePath, (err) => {
                if(err) {
                    const error = new Error('Failed to upload image');
                    error.statusCode = 500;
                    error.data = errors.array();
                    throw error;
                }
            });
 
            return product.save();
        }
    }).then(result => {
        if(result) {
            res.status(201).json({status:"TRUE", message:"Product Added", data:{productId: result._id}})
        } else {
            const error = new Error('Error adding product');
            error.statusCode = 500;
            error.data = errors.array();
            throw error;
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
    .then(result => {
        res.status(200).json({status:"TRUE", message:"Data retrieved", data:{product: result}})
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
            res.status(200).json({status:"TRUE", message:"Data updated", data:{product: product}})
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

exports.deleteProduct = (req, res, next) => {
    const id = req.params.id;
    Product.findByIdAndRemove(id)
    .then(product => {
        if(product) {
            res.status(200).json({status:"TRUE", message:"Record removed", data:{product:product}})
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
