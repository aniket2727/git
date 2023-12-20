




const mongoose = require('mongoose');
const locationSchema = new mongoose.Schema({ email: String, location: String });
const locations = mongoose.model('location', locationSchema);
module.exports = locations;
