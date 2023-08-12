const mongoose = require('mongoose');
  
// Schema  
const Seller = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  
    rating: { type: Number, required: false, default: 0 },
    // Sales 
    pendingSales: { type: Number, required: true, default: 0 },
    successSales: { type: Number, required: true, default: 0 },
    canceledSales: { type: Number, required: true, default: 0 },
    totalEarn: { type: Number, required: true, default: 0 },
    // Documents
    verificationPicture: { type: String, required: false, default: null },
    docType: { type: String, required: false, default: null },
    docId: { type: String, required: false, default: null },
    verificationDocFront: { type: String, required: false, default: null },
    verificationDocBack: { type: String, required: false, default: null },
    // Bank
    bankData: { type: mongoose.Schema.Types.ObjectId, ref: 'BankData', default: null },
    createdAt: { type: Date, required: false, default: Date.now() },
    deleted: { type: Date, require: false, default: null },
    lastUpdated: { type: Date, require: false, default: Date.now() },
});

module.exports = mongoose.model('Seller', Seller);