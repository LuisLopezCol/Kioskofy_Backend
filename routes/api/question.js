const QuestionsController = require("../../controllers/question_controller");

module.exports = function (router) {
  router.post("/question", QuestionsController.addQuestion);
  router.get("/question/item/:item", QuestionsController.getQuestionByItem);
};
