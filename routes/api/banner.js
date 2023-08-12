const BannerController = require("../../controllers/banner_controller");

module.exports = function (router) {
  router.get("/banner/:id", BannerController.getByID);
};
