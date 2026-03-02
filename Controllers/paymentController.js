import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Controller function to create a payment intent
export const createCheckOutSession = async (req, res) => {
    try {
        // Extract items from the request body
        const { items } = req.body;
        // Log the received items for debugging purposes
        console.log("Received items:", items);
        // Check the product data for each item and create line items for Stripe
        const lineItems = items.map((item) => {
            if (!item.product || !item.product.price) {
                throw new Error("Invalid product data - Missing product or price information");
            }
            return {
                price_data: {
                    currency: "usd",
                    product_data: { name: item.product.name },
                    // Convert to cents
                    unit_amount: Math.round(item.product.price * 100), 
                },
                quantity: item.quantity,
            };
        });

        // Create a checkout session with the line items
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,  
            mode: "payment",
            // Use environment variables for the success and cancel URLs
            success_url: "http://localhost:5173/success",
            cancel_url: "http://localhost:5173/cancel",
        });
        res.status(200).json({ url: session.url });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({ message: error.message });
    }
};