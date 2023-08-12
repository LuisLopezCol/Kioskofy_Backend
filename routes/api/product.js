const ProductsController = require("../../controllers/products_controller");

module.exports = function (router) {
  router.get("/products", ProductsController.getAll);
  router.get("/product/:id", ProductsController.getByID);
  router.post("/product", ProductsController.create);
  router.put("/product/:id", ProductsController.update);
  router.delete("/product", ProductsController.delete);

  router.get(
    "/product/slug_id/:slug_id",
    ProductsController.getProductBySlugOrID
  );
  router.delete("/products/delete/:id", ProductsController.delete);
  router.post("/products/create", ProductsController.create);
  router.put("/products/update/id/:id", ProductsController.update);
  router.get("/products/get/all", ProductsController.getAll);
  router.get("/products/get/id/:id", ProductsController.getByID);
  router.get("/products/get/id/:id", ProductsController.getByID);
  router.get("/products/bar_search/:search", ProductsController.onGetBarSearch);
};
