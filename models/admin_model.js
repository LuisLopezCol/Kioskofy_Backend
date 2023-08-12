const mongoose = require('mongoose');
  
// Schema  
const Admin = mongoose.Schema({
    name: { type: String, required: true },
    profilePicture: { type: String, required: false, default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' },
    email: { type: String, required: true },
    password: { type: String, required: true },
    docType: { type: String, required: false },
    docNumber: { type: String, required: false },
    status: { type: String, required: true, default: 'active', enum: ['active', 'inactive', 'blocked'] },
    createdAt: { type: Date, required: false, default: Date.now() },
    lastLogin: { type: Date, required: false },
    deleted: { type: Date, require: false, default: null },
    lastUpdated: { type: Date, require: false, default: Date.now() },
});

module.exports = mongoose.model('Admin', Admin);