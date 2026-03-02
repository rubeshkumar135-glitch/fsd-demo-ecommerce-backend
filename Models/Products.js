import mongoose from "mongoose";

// Define the Product schema
const ProductSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    category: String,
    stock: Number,
    imageUrl: String,
});

const Product = mongoose.model("Product", ProductSchema);

export default Product;