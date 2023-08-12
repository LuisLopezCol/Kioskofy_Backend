const mongoose = require("mongoose");
let ObjectId = require("mongoose").Types.ObjectId;

// Schema
const FavoritesSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "User",
    }, // Product, service or store ID
    favorites: { type: [String], required: true }, // Product, service or store ID
    createdAt: { type: Date, required: false, default: Date.now() },
    lastUpdated: { type: Date, require: false, default: Date.now() },
  },
  { toJSON: { virtuals: true } }
);

// References the item id to more than one model (https://stackoverflow.com/questions/66469430/how-to-ref-to-multiple-models-mongoose-mongodb)
FavoritesSchema.virtual("from_products", {
  ref: "Products",
  localField: "item",
  foreignField: "_id",
  justOne: true,
});
FavoritesSchema.virtual("from_services", {
  ref: "Services",
  localField: "item",
  foreignField: "_id",
  justOne: true,
});
FavoritesSchema.virtual("from_stores", {
  ref: "Stores",
  localField: "item",
  foreignField: "_id",
  justOne: true,
});

FavoritesSchema.statics = {
  getOne: function (id, callback) {
    this.findOne({ _id: new ObjectId(id) }, callback);
  },
};
module.exports = mongoose.model("Favorites", FavoritesSchema);
