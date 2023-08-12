const mongoose = require("mongoose");
const { NotFoundError } = require("../errors/errors");

// Schema
const Sub_Category = mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, required: true },
  description: { type: String, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Sub_Category",
  },
  status: {
    type: String,
    require: false,
    default: "active",
    enum: ["active", "inactive"],
  },
  createdAt: { type: Date, required: false, default: Date.now() },
  deleted: { type: Date, require: false, default: null },
  lastUpdated: { type: Date, require: false, default: Date.now() },
});

Sub_Category.statics = {
  getSubCategoriesByQuery: async function (QUERY, LIMIT, PAGE, SORT) {
    const SKIP = (PAGE - 1) * LIMIT;
    const [countData, data] = await Promise.all([
      this.countDocuments(QUERY),
      this.find(QUERY)
        .skip(SKIP)
        .limit(LIMIT)
        .collation({ locale: "en" })
        .sort(SORT)
        .lean(),
    ]);
    if (!data) throw new NotFoundError("Not found categories for this query");
    return {
      success: true,
      count: data.length,
      data,
      pages: Math.ceil(countData / LIMIT),
      total: countData,
    };
  },
};

module.exports = mongoose.model("Sub_Category", Sub_Category);
