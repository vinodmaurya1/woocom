const Product = require("../models/productModel");
const responseHandler = require("../utils/responseHandler");

exports.createProduct = async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const imageUrl = req.file ? req.file.path : null;
// console.log( name, description, price , imageUrl)
        const newProduct = new Product({
            seller: req.user._id,
            name,
            description,
            price,
            imageUrl
        });

        await newProduct.save();
        return responseHandler(res, 201, true, "Product created successfully", newProduct);
    } catch (err) {
        return responseHandler(res, 500, false, "Error creating product", err.message);
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const user = req.user;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const total = await Product.countDocuments({ seller: user._id });

        const products = await Product.find({ seller: user._id })
            .populate("seller", "name email")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        return responseHandler(res, 200, true, "Products retrieved successfully", {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
            products
        });
    } catch (err) {
        console.error("Error fetching products:", err);
        return responseHandler(res, 500, false, "Error fetching products", err.message || err);
    }
};



exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("seller", "name email");
        if (!product) return responseHandler(res, 404, false, "Product not found");
        return responseHandler(res, 200, true, "Product retrieved", product);
    } catch (err) {
        return responseHandler(res, 500, false, "Error fetching product", err.message);
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return responseHandler(res, 404, false, "Id not found");
        }
        // console.log(id)
        const product = await Product.findById(id);
        if (!product) return responseHandler(res, 404, false, "Product not found");
        // console.log(product)

        if (product.seller.toString() !== req.user._id.toString())
            return responseHandler(res, 403, false, "Unauthorized");

        const { name, description, price } = req.body;
        if (name) product.name = name;
        if (description) product.description = description;
        if (price) product.price = price;
        if (req.file) product.imageUrl = req.file.path;

        await product.save();
        return responseHandler(res, 200, true, "Product updated", product);
    } catch (err) {
        return responseHandler(res, 500, false, "Error updating product", err.message);
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return responseHandler(res, 404, false, "Product not found");
        if (product.seller.toString() !== req.user._id.toString())
            return responseHandler(res, 403, false, "Unauthorized");

        await Product.findByIdAndDelete(req.params.id);
        return responseHandler(res, 200, true, "Product deleted");
    } catch (err) {
        return responseHandler(res, 500, false, "Error deleting product", err.message);
    }
};
