const BannerModel = require("../models/banner_model");

exports.getByID = async function (req, res) {
  BannerModel.getOne(req.params.id, function (err, result) {
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
