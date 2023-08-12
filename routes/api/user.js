const UserController = require("../../controllers/user_controller");
const AuthController = require("../../controllers/auth_controller");

module.exports = function (router) {
  router.get("/user/:id", UserController.getByID);
  router.get("/user/confidential/:id", UserController.getUserConfidential);
  router.get("/users", UserController.getAll);
  router.put("/user/:id", UserController.updateById);
  router.delete("/user/:id", UserController.delete);

  // Authentication
  router.post("/user", AuthController.createUser);
  router.post("/user/login", AuthController.login);
};
