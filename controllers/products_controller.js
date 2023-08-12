const { RouteError } = require("../errors/errors");
const ProductsModel = require("../models/products_model");
const PortfolioViewssModel = require("../models/portfolio_views_model");
const ObjectId = require("mongoose").Types.ObjectId;

exports.getProductBySlugOrID = async function (req, res) {
  try {
    let slug_id = req.params.slug_id;
    let result = await ProductsModel.getProductBySlugOrID(slug_id);
    return res.json({
      success: true,
      message: "Product found",
      data: result,
    });
  } catch (error) {
    let code = 400;
    let message = "Not found product for this query";
    if (error instanceof RouteError) {
      code = error.code;
      message = error.message;
    }
    return res
      .status(code)
      .json({ statusCode: code, success: false, msg: message });
  }
};

exports.delete = async function (req, res) {
  ProductsModel.delete(req, function (err, result) {
    if (!err) {
      res.status(201).json({
        success: true,
        message: "Product deleted",
        data: result,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Error when deleting the product",
        data: err,
      });
    }
  });
};

exports.create = async function (req, res) {
  try {
    let product = req.body;
    product.slug = await getProductSlug(product.name);
    const RESULT = await ProductsModel.create(product);
    return res.json({
      success: true,
      message: "Product created",
      data: RESULT,
    });
  } catch (error) {
    let code = 400;
    let message = "Error when creating the pruduct";
    if (error instanceof RouteError) {
      code = error.code;
      message = error.message;
    }
    return res
      .status(code)
      .json({ statusCode: code, success: false, msg: message });
  }
};

exports.update = async function (req, res) {
  ProductsModel.update(req, function (err, result) {
    if (!err) {
      res.status(201).json({
        success: true,
        message: "Product updated",
        data: result,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Error when updating the product",
        data: err,
      });
    }
  });
};

exports.getAll = async function (req, res) {
  try {
    const PAGE = parseInt(req.query.page) || 1;
    const LIMIT = parseInt(req.query.limit) || 24;
    const SORT = _getQuerySort(req.query.sort_by) || { order_id: -1 };
    const RANDOM = _getQueryRandom(req.query.random) || 0;
    const SEARCH_TEXT = _getQuerySearchText(req.query.search_text);
    const STOCK = _getQueryStock(req.query.stock);
    const QUERY = _getQueries(req.query);
    const PRICE = _getQueryPrice(req.query.price);
    const CONDITION = _getQueryCondition(req.query.condition);
    const LOCATION = JSON.parse(req.query.location || "{}");
    const RESULT = await ProductsModel.getOrdersByQuery(
      LIMIT,
      PAGE,
      SORT,
      RANDOM,
      STOCK,
      SEARCH_TEXT,
      PRICE,
      CONDITION,
      QUERY,
      LOCATION
    );
    return res.json({ success: true, data: RESULT[0] });
  } catch (error) {
    let code = 400;
    let message = "Error when retrieving the orders";
    if (error instanceof RouteError) {
      code = error.code;
      message = error.message;
    }
    return res
      .status(code)
      .json({ statusCode: code, success: false, msg: message });
  }
};

exports.getByID = async function (req, res) {
  ProductsModel.getByID(req, function (err, result) {
    if (!err) {
      res.status(201).json({
        success: true,
        message: "Product retrieve by id",
        data: result,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Error when retrieving the product",
        data: err,
      });
    }
  });
};

/**
 * Search products by name coincidence
 * Home bar search
 * @param {*} req
 * @param {*} res
 */
exports.onGetBarSearch = async (req, res) => {
  try {
    const limit = Number(req.query["limit"]) | 30;
    const page = Number(req.query["page"]) | 1;
    const searchText = req.params["search"];
    if (!searchText)
      res
        .status(400)
        .json({ success: false, msg: "Not search text founded", data: null });
    const productsInfo = await ProductsModel.onGetProductsForBar({
      searchText,
      limit,
      page,
    });
    let result = {
      list: productsInfo.length ? productsInfo[0].data : [],
      totalItems: productsInfo.length ? productsInfo[0].count.count : 0,
    };
    result = {
      ...result,
      totalReturned: result.list.length,
      totalPages: Math.ceil(result.totalItems / limit),
    };
    res
      .status(200)
      .json({ success: true, msg: "Request correctly retrived", data: result });
  } catch (error) {
    console.error("Error getting searchbar results: ", error);
  }
};

/****************************************************************
 ***************************** UTILS ****************************
 ***************************************************************/

async function getProductSlug(product_name) {
  let new_slug = product_name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  const old_slugs = await ProductsModel.find().select("slug -_id").lean();
  new_slug = await compareNewSlugWithOldSlugs(new_slug, old_slugs);
  return new_slug;
}

function compareNewSlugWithOldSlugs(new_slug, old_slugs) {
  for (const old_slug of old_slugs) {
    // If finds one equal, transform modify the new slug adding a random number
    if (old_slug.slug && old_slug.slug === new_slug) {
      new_slug = new_slug + Math.floor(Math.random() * 500000);
      // Starts again the comparison with the new slug re-generated
      new_slug = compareNewSlugWithOldSlugs(new_slug, old_slugs);
      return new_slug;
    }
  }
  return new_slug;
}

/**********************************************************************************
 **************************** Category's query handlers ***************************
 *********************************************************************************/

function _getQueries(query_param) {
  return {
    ..._getQuery("status", query_param),
    ..._getQueryForArray("country", query_param.countries),
    ..._getQueryForArray("category", query_param.categories),
    ..._getQueryForArray("sub_category", query_param.sub_categories), // test
    ..._getQueryBoolean("best_seller", query_param),
    ..._getQueryBoolean("trending", query_param),
    ..._getQueryBoolean("hand_craft", query_param),
    ..._getQueryBoolean("recommended", query_param),
    ..._getQueryBoolean("start_up", query_param),
    ..._getQueryBoolean("non_profit", query_param),
    ..._getQuery("buyer", query_param), // test
    ..._getQuery("item", query_param), // test
    ..._getQuery("item_type", query_param), // test
  };
}

function _getQuery(key, query_param) {
  let res = {};
  if (
    query_param[key] &&
    query_param[key] != "" &&
    query_param[key] != "undefined" &&
    query_param[key] != undefined
  )
    res = { [key]: query_param[key] };
  return res;
}

function _getQuerySearchText(query_param) {
  return query_param && query_param !== "undefined" ? query_param : "";
}

function _getQueryBoolean(key, query_param) {
  let res = {};
  if (
    query_param[key] &&
    query_param[key] != "" &&
    query_param[key] != "undefined" &&
    query_param[key] != undefined
  )
    res = { [key]: query_param[key] === "true" };
  return res;
}

function _getQueryForArray(key, arr) {
  if (
    !arr ||
    arr === "undefined" ||
    !Array.isArray(arr.split(",")) ||
    arr.split(",").length == 0
  )
    return {};
  arr = arr.split(",").map((element) => ObjectId(element));
  return { [key]: { $in: arr } };
}

function _getQuerySort(query_param) {
  const OBJ_KEY = query_param.split("_")[0];
  const OBJ_VALUE = query_param.split("_")[1];
  let res = {};
  if (OBJ_KEY && OBJ_VALUE) {
    res[OBJ_KEY] = Number(OBJ_VALUE);
    return res;
  } else return { order_id: -1 };
}

function _getQueryRandom(query_param) {
  if (query_param && query_param !== "undefined") {
    return Number(query_param);
  }
  return 0;
}

function _getQueryPrice(query_param) {
  let res = {};
  if (query_param && query_param !== "undefined") {
    query_param = query_param.split("-");
    let res = {
      price: { $gte: Number(query_param[0]), $lte: Number(query_param[1]) },
    };
    return res;
  }
  return res;
}

function _getQueryCondition(arr) {
  if (
    !arr ||
    arr === "undefined" ||
    !Array.isArray(arr.split(",")) ||
    arr.split(",").length == 0
  )
    return {};
  arr = arr.replace(/condition_/g, "");
  return { ["condition"]: { $in: arr.split(",") } };
}

function _getQueryStock(stock) {
  if (!stock) return {};
  else return { stock: { $gt: 0 } };
}
