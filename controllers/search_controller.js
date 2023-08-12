const { RouteError } = require("../errors/errors");
const ProductsModel = require("../models/products_model");

exports.searchText = async function (req, res) {
  try {
    let text = req.query.text;
    let result = await ProductsModel.getProductsBySearchText(text);
    return res.json({
      success: true,
      message: "Search success",
      data: result,
    });
  } catch (error) {
    let code = 400;
    let message = "Not found items for this search query";
    if (error instanceof RouteError) {
      code = error.code;
      message = error.message;
    }
    return res
      .status(code)
      .json({ statusCode: code, success: false, msg: message });
  }
};
