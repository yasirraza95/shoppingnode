const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");

const cartRoutes = require("./routes/cart");
const categoryRoutes = require("./routes/categories");
const productRoutes = require("./routes/products");
const subcatRoutes = require("./routes/subcategories");
const userRoutes = require("./routes/user");
const wishlistRoutes = require("./routes/wishlist");
const orderRoutes = require("./routes/orders");

const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + "-" + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

app.use(bodyParser.json());
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single("image"));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

app.use("/cart", cartRoutes);
app.use("/category", categoryRoutes);
app.use("/product", productRoutes);
app.use("/subcategory", subcatRoutes);
app.use("/user", userRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/order", orderRoutes);


app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({message: message, data: data});
});
let liveConnection = "mongodb+srv://shoppingnode_users:GOLWZbST1ohI74RJ@cluster0.ujkook2.mongodb.net/shoppingnode?retryWrites=true&w=majority";
let testConnection = "mongodb://localhost:27017/shoppingnode";
mongoose.connect(liveConnection, { useNewUrlParser: true, useUnifiedTopology: true })
.then(result => {
    if(result) {
        app.listen(8181);
        console.log("Server Connected");
    } else {
        console.log("Error connecting to database");
    }

})
.catch(error => console.log(error));