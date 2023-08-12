const { RouteError } = require("../errors/errors");
const FavoritesModel = require("../models/favorites_model");

exports.addFavorite = async function (req, res) {
  try {
    let new_view = false;
    const USER = req.params.id;
    const ITEM = req.body.item;
    // Find current user's favorites
    let result = await FavoritesModel.find({ user: USER });
    result = result[0];
    // If the user favorites has not being create it, creates it
    if (!result) result = await createUsersFavoritesObject(USER);
    // Item object to be updated in the database
    const BODY = {
      ...result._doc,
      lastUpdated: new Date().toISOString(),
    };
    // Validates if user's favorite already exists in item's favorites
    const FAVORITES_BY_USER = BODY.favorites.find((item) => {
      return item.user === USER;
    });
    if (!FAVORITES_BY_USER) {
      // If user favorites doesn't exists, adds it
      BODY.favorites.push(ITEM);
      new_view = true;
    }
    // Finally updates item
    const RESULT_UPDATED = await FavoritesModel.findByIdAndUpdate(
      BODY._id,
      { $set: BODY },
      { new: true }
    );
    return res.json({
      success: true,
      message: new_view
        ? "User favorite added"
        : "User favorite already exists",
      data: RESULT_UPDATED,
    });
  } catch (error) {
    let code = 400;
    let message = "Error while updating";
    if (error instanceof RouteError) {
      code = error.code;
      message = error.message;
    }
    return res
      .status(code)
      .json({ statusCode: code, success: false, msg: message });
  }
};

async function createUsersFavoritesObject(user) {
  const BODY = {
    user: user,
    favorites: [],
  };
  try {
    const favorites_to_create = new FavoritesModel(BODY);
    let res = await favorites_to_create.save();
    return res;
  } catch (error) {
    throw error;
  }
}
