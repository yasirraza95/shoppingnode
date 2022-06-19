const { validationResult } = require("express-validator");
const Subcategory = require("../models/Subcategory");

exports.getAllSubcat = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 10;
    let totalItems;
    Subcategory.find().countDocuments()
    .then(count => {
        totalItems = count;
        return Subcategory.find().populate("cat_id", "name").skip((currentPage - 1) * perPage).limit(perPage);
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

exports.addSubcat = (req, res, next) => {
    const name = req.body.name;
    const cat_id = req.body.cat_id;
    Subcategory.findOne({name: name}).then(data => {
        if(data) {
            const error = new Error("Name already exists");
            error.statusCode = 422;
            throw error;
        }
        const subcategory = new Subcategory({
            name: name,
            cat_id: cat_id
        });
        return subcategory.save();
    }).then(result => {
        if(result) {
            res.status(201).json({message:"Sub Category Added", subcategoryId: result._id})
        } else {
            res.status(500).json({message:"Error adding sub category"})
        }
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.getSubcat = (req, res, next) => {
    const id = req.params.id;
    Subcategory.findById(id).populate("cat_id", "name")
    .then(data => {
        res.status(200).json({message:"Data retrieved", subcategory: data})
    }).catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.updateSubcat = (req, res, next) => {
    const id = req.params.id;
    const name = req.body.name;
    Subcategory.findById(id).populate("cat_id", "name")
    .then(subcategory => {
        if(subcategory) {
            subcategory.name = name;
            subcategory.save();
            res.status(200).json({message:"Data updated", subcategory: subcategory})
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

exports.deleteSubcat = (req, res, next) => {
    const id = req.params.id;
    Subcategory.findByIdAndRemove(id)
    .then(subcategory => {
        if(subcategory) {
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