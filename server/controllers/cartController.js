const pool = require('../db.js');

// Initialize cart if it doesn't exist
const initializeCart = (req, res) => {
    if (!req.session.cart) {
        req.session.cart = [];
    }
    res.send({ message: "Cart initialized", cart: req.session.cart });
};

const addItemToCart = (req, res) => {
    const { variationId, quantity } = req.body;

    // Initialize cart if it doesn't exist
    if (!req.session.cart) {
        req.session.cart = [];
    }

    // Add or update item in the cart
    const cart = req.session.cart;
    const existingItem = cart.find(item => item.variationId === variationId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ variationId, quantity });
    }

    req.session.cart = cart;  // Save updated cart to session
    res.send({ message: "Item added to cart", cart });
};

const viewCart = (req, res) => {
    if (!req.session.cart) {
        return res.send({ message: "Cart is empty" });
    }

    res.send({ cart: req.session.cart });
};

const checkoutCart = (req, res) => {
    if (!req.session.cart || req.session.cart.length === 0) {
        return res.send({ message: "Cart is empty" });
    }

    const cart = req.session.cart;

    // Logic to store the cart items into your orders table would go here

    // Clear the cart after successful checkout
    req.session.cart = [];
    res.send({ message: "Checkout successful", cart });
};

module.exports = {
    initializeCart,
    addItemToCart,
    viewCart,
    checkoutCart
};