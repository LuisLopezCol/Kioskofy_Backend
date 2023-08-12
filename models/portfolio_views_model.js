const mongoose = require("mongoose");
let ObjectId = require("mongoose").Types.ObjectId;

// Schema
const ProductViewsSchema = mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
    }, // Product, service or store ID
    type: {
      type: String,
      required: true,
      enum: ["product", "service", "store"],
    },
    views: {
      type: [{ user: mongoose.Schema.Types.ObjectId, date: Date }],
      required: true,
      default: [],
    },
    createdAt: { type: Date, required: false, default: Date.now() },
    lastUpdated: { type: Date, require: false, default: Date.now() },
  },
  { toJSON: { virtuals: true } }
);

// References the item id to more than one model (https://stackoverflow.com/questions/66469430/how-to-ref-to-multiple-models-mongoose-mongodb)
ProductViewsSchema.virtual("from_products", {
  ref: "Products",
  localField: "item",
  foreignField: "_id",
  justOne: true,
});
ProductViewsSchema.virtual("from_services", {
  ref: "Services",
  localField: "item",
  foreignField: "_id",
  justOne: true,
});
ProductViewsSchema.virtual("from_stores", {
  ref: "Stores",
  localField: "item",
  foreignField: "_id",
  justOne: true,
});

ProductViewsSchema.statics = {
  getOne: function (id, callback) {
    this.findOne({ _id: new ObjectId(id) }, callback);
  },
};
module.exports = mongoose.model("Product_Views", ProductViewsSchema);
