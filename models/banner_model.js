const mongoose = require("mongoose");
let ObjectId = require("mongoose").Types.ObjectId;

// Schema
const BannerSchema = mongoose.Schema({
  name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },

  aspect_ratio: { type: String, required: true },
  location: { type: String, required: true }, // String that will be the flag of the location of the banner e.g. landing-main-banner
  platform: {
    type: String,
    required: true,
    enum: ["web", "app", "multi"],
    default: "regular",
  },
  status: {
    type: String,
    required: true,
    enum: ["active", "inactive", "blocked"],
    default: "active",
  },
  date_start: { type: Date, required: true },
  date_end: { type: Date, required: true },
  createdAt: { type: Date, required: false, default: Date.now() },
  lastUpdated: { type: Date, require: false, default: Date.now() },
});

BannerSchema.statics = {
  getOne: function (id, callback) {
    this.findOne({ _id: new ObjectId(id) }, callback);
  },
};
module.exports = mongoose.model("Banner", BannerSchema);
