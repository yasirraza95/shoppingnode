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

exports.addSubcat = (req, res, next) => {
    const name = req.body.name;
    const cat_id = req.body.cat_id;
    Subcategory.findOne({name: name}).then(data => {
        if(data) {
            return res.status(201).json({status:"FALSE", message:"Name already exists", data:[]})
        }
        const subcategory = new Subcategory({
            name: name,
            cat_id: cat_id
        });
        return subcategory.save();
    }).then(result => {
        if(result) {
            res.status(201).json({status:"TRUE", message:"Sub Category Added", data:{subcategoryId: result._id}})
        } else {
            res.status(500).json({status:"FALSE", message:"Error adding sub category", data:[]})
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
    .then(result => {
        res.status(200).json({status:"TRUE", message:"Data retrieved", data:{subcategory: result}})
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
            res.status(200).json({status:"TRUE", message:"Data updated", data:{subcategory: subcategory}})
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

exports.deleteSubcat = (req, res, next) => {
    const id = req.params.id;
    Subcategory.findByIdAndRemove(id)
    .then(subcategory => {
        if(subcategory) {
            res.status(200).json({status:"TRUE", message:"Record removed", data:[]})
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