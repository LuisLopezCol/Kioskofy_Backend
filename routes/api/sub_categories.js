const SubCategoriesController = require("../../controllers/sub_categories_controllerr");

module.exports = function (router) {
  router.delete("/sub_category/:id", SubCategoriesController.deleteSubCategory);
  router.post("/sub_category", SubCategoriesController.createSubCategory);
  router.put("/sub_category/:id", SubCategoriesController.updateSubCategory);
  router.get(
    "/sub_categories/:status/category/:category",
    SubCategoriesController.getAll
  );
  router.get("/sub_category/:id", SubCategoriesController.getSubCategory);
  router.get(
    "/sub_categories",
    SubCategoriesController.getSubCategoriesByQuery
  );
};
