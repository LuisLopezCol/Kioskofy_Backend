const ConversationModel = require("../models/conversation_model");

const createConversation = async (req, res) => {
  try {
    const conversationToCreate = new ConversationModel(req.body);
    await conversationToCreate.save();
    res.status(200).json({
      success: true,
      data: conversationToCreate,
      msg: "Conversation created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating conversation",
      data: error,
    });
  }
};

const getConversation = async (req, res) => {
  try {
    let query = {};
    query[req.params.query] = req.params.value;
    const conversation = await ConversationModel.getConversation(query);
    res.status(200).json({
      success: true,
      data: conversation,
      msg: "Conversation successfully founded",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error getting conversation",
      data: error,
    });
  }
};

/**
 * Updates a conversation
 * @param {*} req | body with the conversation update | params.id == conversation document id
 * @param {*} res | conservation updated
 */
const updateConversation = async (req, res) => {
  try {
    const body = {
      ...req.body,
      lastUpdated: Date.now(),
    };
    const room = req.params.room;
    const conversation = await ConversationModel.findByIdAndUpdate(
      room,
      { $set: body },
      { new: true }
    );
    res.status(200).json({
      success: true,
      data: conversation,
      msg: "Conversation successfully founded",
    });
  } catch (error) {
    console.error("Error updating a conversation: ", error);
    res.status(400).json({
      success: false,
      message: "Error updating conversation",
      data: error,
    });
  }
};

/**
 * Update a conversation messages
 * @param {*} req | req.body { user: userID, message: string } | req.params.id == conversation _id
 * @param {*} res
 */
const sendMessage = async (req, res) => {
  try {
    const ID = req.params.id;
    const BODY = {
      ...req.body,
      createdAt: Date.now(),
    };
    const UPDATED = await ConversationModel.findByIdAndUpdate(
      ID,
      { $set: { lastUpdated: Date.now() }, $push: { history: BODY } },
      { new: true }
    );
    res.status(200).json({
      success: true,
      data: UPDATED,
      msg: "Conversation updated successfully",
    });
  } catch (error) {
    console.error("Error sending a message: ", error);
    res.status(400).json({
      success: false,
      message: "Error sending message",
      data: error,
    });
  }
};

module.exports = {
  createConversation,
  getConversation,
  updateConversation,
  sendMessage,
};
