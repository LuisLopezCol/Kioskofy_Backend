const ConversationController = require("../../controllers/conversation_controller");

module.exports = function (router) {
  router.post("/conversation", ConversationController.createConversation);
  router.get(
    "/conversation/:query/:value",
    ConversationController.getConversation
  );
  router.put("/conversation/:room", ConversationController.updateConversation);
  router.post(
    "/conversation/sent-message/id/:id",
    ConversationController.sendMessage
  );

  /** las rutas basicas del crud deben ser con el nombre del modelo solamente y se dirfrencia con el metodo y si traen todos los datos con la s al final */
  // router.post("/create_conversation", ConversationController.createConversation);
  // router.get("/get_conversation/:id", ConversationController.getAConversation);
  // router.put("/update_conversation/:id", ConversationController.getAConversation);
  // router.post("/send_message/:id", ConversationController.onSentMessage);
};
