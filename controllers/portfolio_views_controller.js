const { RouteError } = require("../errors/errors");
const PortfolioViewModel = require("../models/portfolio_views_model");
const ObjectId = require("mongoose").Types.ObjectId;

exports.addUSerView = async function (req, res) {
  try {
    let new_view = false;
    const USER = req.body.user;
    const ITEM_TYPE = req.body.type;
    const ITEM = req.body.item;
    const VIEW = {
      user: USER,
      date: new Date().toISOString(),
    };
    // Find current item's views
    let result = await PortfolioViewModel.find({ item: ITEM });
    result = result[0];
    // If the item has not being create it, creates it
    if (!result) result = await createPortfolioViewsObject(ITEM, ITEM_TYPE);
    // Item object to be updated in the database
    const BODY = {
      ...result._doc,
      lastUpdated: new Date().toISOString(),
    };
    // Validates if user's view already exists in item's view
    const VIEW_BY_USER = BODY.views.find((item) => {
      return item.user.equals(new ObjectId(USER));
    });
    if (!VIEW_BY_USER) {
      // If user view doesn't exists, adds it
      BODY.views.push(VIEW);
      new_view = true;
    } else {
      // If user view already exists, just updates the date
      BODY.views.find((item) => {
        if (item.user === USER) item.date = new Date().toISOString();
      });
    }
    // Finally updates item
    const RESULT_UPDATED = await PortfolioViewModel.findByIdAndUpdate(
      BODY._id,
      { $set: BODY },
      { new: true }
    );
    return res.json({
      success: true,
      message: new_view
        ? "User view added"
        : "User view already exists (updated)",
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

async function createPortfolioViewsObject(item, type) {
  const BODY = {
    item: item,
    type: type,
  };
  try {
    const portfolio_views_to_create = new PortfolioViewModel(BODY);
    let res = await portfolio_views_to_create.save();
    return res;
  } catch (error) {
    throw error;
  }
}
