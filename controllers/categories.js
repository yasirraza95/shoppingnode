const { validationResult } = require("express-validator");
const Category = require("../models/Category");

exports.getAllCategories = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 10;
    let totalItems;
    Category.find().countDocuments()
    .then(count => {
        totalItems = count;
        return Category.find().skip((currentPage - 1) * perPage).limit(perPage);
    })
    .then(data => {
        if(data.length > 0) {
            res.status(200).json({
                status: "TRUE", message: "Data retrieved", data: {items: data, totalItems: totalItems, perPage: perPage}, 
            });
        } else {
            res.status(200).json({
                status: "FALSE", message: "No data found", data: {}
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

exports.addCategory = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    
    const name = req.body.name;
    Category.findOne({name: name}).then(data => {
        if(data) {
            const error = new Error('Name already exists');
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }
        const category = new Category({
            name: name
        });
        return category.save();
    }).then(result => {
        if(result) {
            res.status(201).json({status:"TRUE", message:"Category Added", data:{categoryId: result._id}})
        } else {
            res.status(500).json({status:"FALSE", message:"Error adding category", data:[]})
        }
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.getCategory = (req, res, next) => {
    const id = req.params.id;
    Category.findById(id)
    .then(result => {
        res.status(200).json({status:"TRUE", message:"Data retrieved", data:{category: result}})
    }).catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.updateCategory = (req, res, next) => {
    const id = req.params.id;
    const name = req.body.name;
    Category.findById(id)
    .then(category => {
        if(category) {
            category.name = name;
            category.save();
            res.status(200).json({status:"TRUE", message:"Data updated", data: {category: category}})
        } else {
            return res.status(404).json({status:"FALSE", message:"No data found", data: []})
        }
    }).catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.deleteCategory = (req, res, next) => {
    const id = req.params.id;
    Category.findByIdAndRemove(id)
    .then(category => {
        if(category) {
            res.status(200).json({status:"TRUE", message:"Record removed", data:[]})
        } else {
            return res.status(200).json({status:"FALSE", message:"No data found", data:[]})
        }
    }).catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}
