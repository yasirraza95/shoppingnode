const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");

const dotenv = require("dotenv");
dotenv.config();

const cartRoutes = require("./routes/cart");
const categoryRoutes = require("./routes/categories");
const productRoutes = require("./routes/products");
const subcatRoutes = require("./routes/subcategories");
const userRoutes = require("./routes/user");
const wishlistRoutes = require("./routes/wishlist");
const orderRoutes = require("./routes/orders");
const app = express();


app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

app.use(fileUpload({
    currentParentPath: true,
    limits: {
        fileSize: 1024 * 1024
    },
    abortOnLimit: true
}));

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
    res.status(status).json({status: "FALSE", data: data, message: message});
});

let dbConnection = process.env.NODE_ENV === 'production' ? process.env.LIVE_CONNECTION : process.env.TEST_CONNECTION;

mongoose.connect(dbConnection, { useNewUrlParser: true, useUnifiedTopology: true })
.then(result => {
    if(result) {
        app.listen(process.env.PORT || 8080);
        console.log(`Server Connected on port ${process.env.PORT}`);
    } else {
        console.log("Error connecting to database");
    }

})
.catch(error => console.log(error));