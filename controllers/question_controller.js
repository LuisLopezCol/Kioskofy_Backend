const { RouteError } = require("../errors/errors");
const QuestionModel = require("../models/question_mode");

exports.addQuestion = async function (req, res) {
  try {
    const QUESTION = new QuestionModel(req.body);
    let result = await QUESTION.save();
    return res.json({
      success: true,
      message: "Comment created",
      data: result,
    });
  } catch (error) {
    let code = 400;
    let message = "Error while creating comment";
    if (error instanceof RouteError) {
      code = error.code;
      message = error.message;
    }
    return res
      .status(code)
      .json({ statusCode: code, success: false, msg: message });
  }
};

exports.getQuestionByItem = async function (req, res) {
  try {
    const conversation = await QuestionModel.getQuestionByItem(req.params.item);
    res.status(200).json({
      success: true,
      data: conversation,
      msg: "Question successfully founded",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error getting question",
      data: error,
    });
  }
};
