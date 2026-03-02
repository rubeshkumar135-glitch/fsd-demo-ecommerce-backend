import Product from '../Models/Products.js';

// Create a new product
export const createProduct = async (req, res) => {
  try {
    // Create a new product in the database using the request body
    const product = await Product.create(req.body);   
    // Return the created product in the response
    res.status(201).json(product);
    } catch (error) {   
    res.status(500).json({ message: "Error creating product", error });
  } 
};

// Get all products
export const getAllProducts = async (req, res) => {
  try { 
    // Fetch all products from the database
    const products = await Product.findAll();
    // Return the products in the response
    res.status(200).json({ data: products });
    } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
    }
};
// Update a product by ID
export const updateProduct = async (req, res) => {
    try {
        // Get the product ID from the request parameters and the updated data from the request body
        const productId = req.params.id;
        const { name, description, price, category, stock, imageUrl } = req.body;
        // Find the product by ID and update it
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { name, description, price, category, stock, imageUrl },
            { new: true }
        );
        // If the product is not found, return a 404 error
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        // Return a success message with the updated product data
        res.status(200).json({ message: "Product updated successfully", data: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: "Error updating product", error });
    }
};

// Delete a product by ID
export const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        // Find the product by ID and delete it
        const deletedProduct = await Product.findByIdAndDelete(productId);

        // If the product is not found, return a 404 error
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        // Return a success message
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error });
    }
};