const mongoose = require('mongoose');

// Define the schema for purchased products
const purchasedProductSchema = new mongoose.Schema({
    name: String,
    email: String,
    totalprice: Number,
    count: Number
});

// Create a Mongoose model named 'shoping' using the schema
const purchasedProduct = mongoose.model('shoping', purchasedProductSchema);

// Export the model for use in other parts of the application
module.exports = purchasedProduct;
