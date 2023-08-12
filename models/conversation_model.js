const mongoose = require("mongoose");

// Schema
const Conversation = mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Order", require: true }, // Order ID
  history: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,
      },
      message: { type: String, require: true },
      createdAt: { type: Date, require: false },
    },
  ],
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
  status: {
    type: String,
    require: false,
    default: "opened",
    enum: ["opened", "finished"],
  },
  createdAt: { type: Date, required: false, default: Date.now() },
  deleted: { type: Date, require: false, default: null },
  lastUpdated: { type: Date, require: false, default: Date.now() },
});

Conversation.statics = {
  getConversation: async function (query) {
    try {
      let data = await this.findOne(query)
        .populate({
          path: "seller",
          model: "User",
          select: "name last_name profile_picture",
        })
        .populate({
          path: "buyer",
          model: "User",
          select: "name last_name profile_picture",
        });
      if (!data)
        throw new NotFoundError("Not found conversation for this query");
      return data;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = mongoose.model("Conversation", Conversation);
