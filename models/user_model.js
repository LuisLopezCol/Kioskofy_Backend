const mongoose = require("mongoose");
let ObjectId = require("mongoose").Types.ObjectId;
const UTIL_OBJECT = require("../utils/agregate_querys");

// Schema
const UserSchema = mongoose.Schema({
  name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  profile_picture: { type: String, required: false },
  type: {
    type: String,
    required: true,
    enum: ["regular"],
    default: "regular",
  },
  status: {
    type: String,
    required: true,
    enum: ["active", "inactive", "blocked"],
    default: "active",
  },
  phone: { type: String, required: true, default: null },
  accepted_terms_conditions: { type: Boolean, required: true, default: true },
  address: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
  favorite_products: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Products" },
  ],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
    default: null,
  },
  pending_purchase: { type: Number, required: true, default: 0 },
  canceled_purchase: { type: Number, required: true, default: 0 },
  success_purchase: { type: Number, required: true, default: 0 },
  deleted: { type: Date, require: false, default: null },
  createdAt: { type: Date, required: false, default: Date.now() },
  lastUpdated: { type: Date, require: false, default: Date.now() },
});

UserSchema.statics = {
  removeById: function (removeData, callback) {
    this.findOneAndRemove(removeData, callback);
  },

  removeAll: function (query, callback) {
    this.remove(query).exec(callback);
  },

  getOne: function (id, callback) {
    this.findOne({ _id: new ObjectId(id) }, callback);
  },

  getUserConfidential: async function (ID, callback) {
    return await this.aggregate([
      { $match: { _id: new ObjectId(ID) } },
      UTIL_OBJECT.LOOK_UP_USER_FAVORITES,
      UTIL_OBJECT.PROJECT_USER_LEAN,
    ]).exec(callback);
  },

  getAll: function (id, callback) {
    this.find({}, callback);
  },

  create: async function (data) {
    const product = new this(data);
    const response = await product.save();
    return response;
  },

  updateById: function (req, callback) {
    this.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true },
      callback
    );
  },
};
module.exports = mongoose.model("User", UserSchema);
