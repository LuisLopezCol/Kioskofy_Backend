const mongoose = require("mongoose");
const { NotFoundError } = require("../errors/errors");

// Schema
const Country = mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  isoCode: { type: String, required: true },
  flag: { type: String, require: true },
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

Country.statics = {
  getCountriesByQuery: async function (QUERY, LIMIT, PAGE, SORT) {
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

module.exports = mongoose.model("Country", Country);
