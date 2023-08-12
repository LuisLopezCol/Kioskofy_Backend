const FavoritesController = require("../../controllers/favorites_controller");

module.exports = function (router) {
  router.put("/favorites/user/:id", FavoritesController.addFavorite);
};
