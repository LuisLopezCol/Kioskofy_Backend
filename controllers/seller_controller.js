const SellerModel = require('../models/seller_model')

const createSeller = async (userId) => {
    try {
        if (!userId) throw new Error('User ID is required');
        const sellerCreation = new SellerModel({user: userId});
        await sellerCreation.save();
        return sellerCreation
    } catch (error) {
        console.error('Error creating seller', error);
        return false
    }
}

module.exports = {
    createSeller
}