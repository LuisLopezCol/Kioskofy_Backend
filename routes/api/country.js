const CategoriesController = require("../../controllers/country_controller");

module.exports = function (router) {
  router.delete("/country_delete/:id", CategoriesController.deleteCountry);
  router.post("/country_create", CategoriesController.createCountry);
  router.put("/country_update/:id", CategoriesController.updateCountry);
  router.get("/country/all/:status", CategoriesController.getAll);
  router.get("/country/:id", CategoriesController.getCountry);
  router.get("/countries", CategoriesController.getCountriesByQuery);
};
