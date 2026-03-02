import Product from "../Models/Products.js";
import Cart from "../Models/Cart.js";


// Add a product to the cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    // Find the product by ID    
    const product = await Product.findById(productId);
    // If the product is not found, return a 404 error
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    // Find the user's cart or create a new one if it doesn't exist
    let cart = await Cart.findOne({ user: req.user._id });
    // If the cart doesn't exist, create a new cart
    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [],
        totalPrice: 0,
      });
    }

    // Check if the product is already in the cart
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );
     // If the product is already in the cart, update the quantity and total price
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      // If the product is not in the cart, add it as a new item
      cart.items.push({ product: productId, quantity: quantity });
    }
     // Update the total price of the cart
    cart.totalPrice += product.price * quantity;
    // Save the cart to the database
    await cart.save();
    res.status(200).json({ message: "Product added to cart successfully", cart });
  } catch (error) {
    res.status(500).json({ message: "Error adding product to cart", error });
  }
};


// view cart items
export const viewCart = async (req, res) => {
  try {
    // Find the user's cart and populate product details
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    // If the cart is not found, return an empty cart response
    if (!cart) {
      return res.status(200).json({ message: "Cart is empty", cart: { items: [] } });
    }
    res.status(200).json({ message: "Cart retrieved successfully", data: cart });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving cart", error });
  }
};


// Remove a product from the cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    let cart = await Cart.findOne({ user: req.user._id });
    // If the cart is not found, return a 404 error
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    // Find the index of the product in the cart
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );
    // If the product is not found in the cart, return a 404 error
    if (itemIndex > -1) {
      // Update the total price of the cart
      const removedItem = cart.items.splice(itemIndex, 1)[0];
      cart.totalPrice -= removedItem.quantity * (await Product.findById(productId)).price;
      // Save the updated cart to the database
      await cart.save();
      res.status(200).json({ message: "Product removed from cart successfully", cart });
    }
    else {
      res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error removing product from cart", error });
  }
};


// Update the quantity of a product in the cart
export const updateCartItem = async (req, res) => {
  try {
    // Get the product ID from the request parameters and the quantity change from the request body
    const { productId } = req.params;
    const { change } = req.body; // +1 or -1
    // Find the user's cart
    let cart = await Cart.findOne({ user: req.user._id });
     // If the cart is not found, return a 404 error
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
  // Find the index of the product in the cart
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    // If the product is not found in the cart, return a 404 error
    if (itemIndex > -1) {
      // Update the quantity of the product in the cart
      cart.items[itemIndex].quantity += change;
      // Ensure the quantity does not go below 1
      if (cart.items[itemIndex].quantity <= 0) {
        cart.items.splice(itemIndex, 1); // Remove the item if quantity is zero or less
      }
      // Update the total price of the cart
      cart.totalPrice += change * (await Product.findById(productId)).price; 
      // Save the updated cart to the database
      await cart.save();
      res.status(200).json({ message: "Cart item updated successfully", cart });
    } else {
      res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating cart item", error });
  }
};
