import Order from "../Models/Order.js";
import Cart from "../Models/Cart.js";
import sendEmail from "../Utils/emailService.js";


// Place an order
export const placeOrder = async (req, res) => {
    try {
        // Get the user's cart and populate product details
        const cart = await Cart.findOne({ user: req.user._id }).populate(
            "items.product"
        );
        // If the cart is empty, return an error
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }
        // Calculate the total price of the order
        const totalPrice = cart.items.reduce(
            (acc, item) => acc + item.product.price * item.quantity, 0);
        // Create a new order with the cart items and total price
        const order = new Order({
            user: req.user._id,
            products: cart.items,
            totalPrice,
            status: "Pending",
        });
        // Save the order to the database
        await order.save();
        // if once order the product then delete the cart
        if (cart) {
            await Cart.findByIdAndDelete({ user: req.user._id });
        }  
        // Send order confirmation email to the user
        try {
            // Assuming the user's email is stored in the user object
            const userEmail = req.user.email; 
            // Send an email with the order confirmation and total price
            await sendEmail(
                userEmail,
                "Order Confirmation",
                `Your order of $${totalPrice} has been placed successfully!`
            );
        } catch (emailError) {
            console.log("Failed to send order confirmation email:", emailError.message);
        } 
        res.status(200).json({ message: "Order placed successfully", order });
    } catch (error) {
        res.status(500).json({ message: "Failed to place order", error });
    }
};

// Get all orders for the authenticated user
export const getUserOrders = async (req, res) => {
    try {
       const orders = await Order.find()
            .populate("user")
            .populate("products.product");

        res.status(200).json({ message: "All orders fetched successfully", data: orders });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch orders", error });
    }
};

// Get Orders By User
export const getMyOrders = async (req, res) => {
    try {
        // populate the user and product details in the order
       const oreders = await Order.find({user:req.user._id}).populate(
        "products.product",
       );
       res.status(200).json({ message: "My Order", data: oreders });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch order", error });
    }
};

// Update order status (e.g., for admin use)
export const updateOrderStatus = async (req, res) => {
    try {
        // Get the order ID from the request parameters
        const orderId = req.params.id;
        // Get the new status from the request body
        const { status } = req.body;
        // Update the order status
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId, 
            { status }, 
            { new: true }
        );
        // If the order is not found, return a 404 error
        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({ message: "Order status updated successfully", data: updatedOrder });
    } catch (error) {
        res.status(500).json({ message: "Failed to update order status", error });
    }
};