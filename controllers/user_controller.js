const { RouteError } = require("../errors/errors");
const UserModel = require("../models/user_model");

exports.getByID = async function (req, res) {
  UserModel.getOne(req.params.id, function (err, result) {
    if (!err) {
      res.status(201).json({
        success: true,
        message: "User retrieve by id",
        data: result,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Error when retrieving the user",
        data: err,
      });
    }
  });
};

exports.getUserConfidential = async function (req, res) {
  try {
    const RESULT = await UserModel.getUserConfidential(req.params.id);
    return res.json({ success: true, data: RESULT });
  } catch (error) {
    let code = 400;
    let message = "Error when retrieving the user";
    if (error instanceof RouteError) {
      code = error.code;
      message = error.message;
    }
    return res
      .status(code)
      .json({ statusCode: code, success: false, msg: message });
  }
};

exports.getAll = async function (req, res) {
  UserModel.getAll(req, function (err, result) {
    if (!err) {
      res.status(201).json({
        success: true,
        message: "sSers retrieved",
        data: result,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Error when retrieving products",
        data: err,
      });
    }
  });
};

exports.updateById = async function (req, res) {
  UserModel.updateById(req, function (err, result) {
    if (!err) {
      res.status(201).json({
        success: true,
        message: "User updated",
        data: result,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Error when updating the user",
        data: err,
      });
    }
  });
};

exports.delete = async function (req, res) {
  UserModel.delete(req, function (err, result) {
    if (!err) {
      res.status(201).json({
        success: true,
        message: "User deleted",
        data: result,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Error when deleting the product",
        data: err,
      });
    }
  });
};
