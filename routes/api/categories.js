const CategoriesController = require("../../controllers/categories_controller");

module.exports = function (router) {
  router.delete("/category_delete/:id", CategoriesController.deleteCategory);
  router.post("/category_create", CategoriesController.createCategory);
  router.put("/category_update/:id", CategoriesController.updateCategory);
  router.get("/categories_all/:status", CategoriesController.getAll);
  router.get("/category/:id", CategoriesController.getCategory);
  router.get("/categories", CategoriesController.getCategoriesByQuery);
};
