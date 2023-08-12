const PortfolioViewsController = require("../../controllers/portfolio_views_controller");

module.exports = function (router) {
  router.put("/portfolio_view/add_view", PortfolioViewsController.addUSerView);
};
