const mongoose = require("mongoose");
let ObjectId = require("mongoose").Types.ObjectId;
const UTIL_OBJECT = require("../utils/agregate_querys");

// Schema
const QuestionSchema = mongoose.Schema(
  {
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: false,
      ref: "User",
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: false,
    }, // Product, service or store ID
    is_reply_comment: { type: Boolean, default: false, required: true },
    reply_question: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "Question",
    },
    status: {
      type: String,
      require: false,
      default: "active",
      enum: ["active", "blocked"],
    },
    createdAt: { type: Date, required: false, default: Date.now() },
    lastUpdated: { type: Date, require: false, default: Date.now() },
  },
  { toJSON: { virtuals: true } }
);

// References the item id to more than one model (https://stackoverflow.com/questions/66469430/how-to-ref-to-multiple-models-mongoose-mongodb)
QuestionSchema.virtual("from_products", {
  ref: "Products",
  localField: "item",
  foreignField: "_id",
  justOne: true,
});
QuestionSchema.virtual("from_services", {
  ref: "Services",
  localField: "item",
  foreignField: "_id",
  justOne: true,
});

QuestionSchema.statics = {
  getOne: function (id, callback) {
    this.findOne({ _id: new ObjectId(id) }, callback);
  },
  getQuestionByItem: async function (query) {
    return await this.aggregate([
      {
        $match: {
          item: new ObjectId(query),
          is_reply_comment: false,
        },
      },
      UTIL_OBJECT.LOOK_UP_QUESTIONS,
      UTIL_OBJECT.LOOK_UP_USER,
    ]);
  },
};
module.exports = mongoose.model("Question", QuestionSchema);
