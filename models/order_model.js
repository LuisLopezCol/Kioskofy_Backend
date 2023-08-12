const mongoose = require("mongoose");

// Schema
const Order = mongoose.Schema({
  order_id: {
    type: Number,
    require: true,
  },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
  item_type: { type: String, require: true, enum: ["product", "service"] },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Products",
    require: true,
  },
  qty: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  price_discount: {
    type: Number,
    require: true,
    default: 0,
  },
  status: {
    type: String,
    require: true,
    default: "pending",
    enum: ["pending", "separate", "completed", "cancelled"],
  },
  createdAt: { type: Date, required: false, default: Date.now() },
  deleted: { type: Date, require: false, default: null },
  lastUpdated: { type: Date, require: false, default: Date.now() },
});

Order.statics = {
  getOrdersByQuery: async function (QUERY, LIMIT, PAGE, SORT) {
    const SKIP = (PAGE - 1) * LIMIT;
    const [count_data, data] = await Promise.all([
      this.countDocuments(QUERY),
      this.find(QUERY)
        .skip(SKIP)
        .limit(LIMIT)
        .collation({ locale: "en" })
        .sort(SORT)
        .lean()
        .populate({
          path: "seller",
          model: "User",
          select: "name last_name profile_picture",
        })
        .populate({
          path: "item",
          model: "Products",
          select: "name images condition price price_discount stock",
        }),
    ]);
    if (!data) throw new NotFoundError("Not found orders for this query");
    return {
      success: true,
      count: data.length,
      data,
      pages: Math.ceil(count_data / LIMIT),
      total: count_data,
    };
  },
};

module.exports = mongoose.model("Order", Order);
