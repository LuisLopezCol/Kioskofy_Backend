const ProductsController = require("../../controllers/search_controller");

module.exports = function (router) {
  router.get("/search", ProductsController.searchText);
};
