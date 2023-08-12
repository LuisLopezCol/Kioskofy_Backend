const mongoose = require('mongoose');
  
// Schema  
const Address = mongoose.Schema({
    country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country' },
    state: { type: String, require: true }, 
    city: { type: String, require: true }, 
    address: { type: String, require: true },
    principal: { type: Boolean, require: true },
    zipCode: { type: String, require: true }, 
    additionalDetails: { type: String, require: false }, 
    createdAt: { type: Date, required: false, default: Date.now() },
    lastUpdated: { type: Date, require: false, default: Date.now() },
});

module.exports = mongoose.model('Address', Address);