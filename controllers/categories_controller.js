const { RouteError } = require("../errors/errors");
const CategoriesModel = require("../models/categories_model");

/**
 * Create a category
 * All require properties in the model
 * @param {*} req
 * @param {*} res
 */
const createCategory = async (req, res) => {
  try {
    const body = req.body;
    body.slug = await getCategorySlug(body.title);
    const categoryToCreate = new CategoriesModel(body);
    await categoryToCreate.save();

    res.status(200).json({
      success: true,
      data: categoryToCreate,
      msg: "Category created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating product",
      data: error,
    });
  }
};

/**
 * Get all categories.
 * by status | active, inactive or all - It's a param (status)
 * by type | product, service - It's a query, in case not send this query returns both
 */
const getAll = async (req, res) => {
  try {
    const statusList = ["active", "inactive", "all"];
    const typeList = ["product", "service"];
    const status = req.params.status;
    const type = req.query.type;

    if (!statusList.includes(status))
      throw new Error("list type is not correct");

    let query = {};
    // In case type list came, will be included
    if (type && typeList.includes(type)) query = { type };
    // In case status is different to all
    if (status != "all") query = { ...query, status };

    let categories = await CategoriesModel.find(query);

    res.status(200).json({
      success: true,
      data: categories,
      msg: "All categories successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error getting categories",
      data: error.message,
    });
  }
};

/**
 * Get a category by id
 * @param {*} req | params id its the mongo category id
 * @param {*} res
 */
const getCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await CategoriesModel.findById(categoryId);

    res.status(200).json({
      success: true,
      data: category,
      msg: "Category successfully Found",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error getting category",
      data: error,
    });
  }
};

/**
 * Updates a category by id
 * @param {*} req | param id its the mongo category id
 * @param {*} res
 */
const updateCategory = async (req, res) => {
  try {
    const body = req.body;
    const categoryId = req.params.id;

    const messageUpdated = await CategoriesModel.findByIdAndUpdate(
      categoryId,
      body,
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: messageUpdated,
      msg: "Category updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating category",
      data: error,
    });
  }
};

/**
 * Delete a category
 * @param {*} req | params id its the mongo category id
 * @param {*} res
 */
const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await CategoriesModel.findByIdAndDelete(categoryId);

    res.status(200).json({
      success: true,
      data: category,
      msg: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Erro creating a category: ", error);
    res.status(400).json({
      success: false,
      message: "Error deleting category",
      data: error,
    });
  }
};

const getCategoriesByQuery = async (req, res) => {
  try {
    const QUERY = getQueryCategories(req.query);
    const LIMIT = parseInt(req.query.limit) || 10000;
    const PAGE = parseInt(req.query.page) || 1;
    const SORT = _getQuerySort(req.query) || { title: -1 };
    const RESULT = await CategoriesModel.getCategoriesByQuery(
      QUERY,
      LIMIT,
      PAGE,
      SORT
    );
    return res.json({ success: true, data: RESULT });
  } catch (error) {
    let code = 400;
    let message = "Error when retrieving the categories";
    if (error instanceof RouteError) {
      code = error.code;
      message = error.message;
    }
    return res
      .status(code)
      .json({ statusCode: code, success: false, msg: message });
  }
};

module.exports = {
  createCategory,
  updateCategory,
  getCategory,
  deleteCategory,
  getAll,
  getCategoriesByQuery,
};

/**********************************************************************************
 **************************** Category's query handlers ***************************
 *********************************************************************************/

function getQueryCategories(query_param) {
  let query = {};
  query = {
    ..._getQueryTitle(query_param),
    ..._getQueryType(query_param),
    ..._getQueryStatus(query_param),
  };
  return query;
}

function _getQueryTitle(query_param) {
  let res = {};
  if (query_param.title && query_param.title != "")
    res = { title: query_param.title };
  return res;
}

function _getQueryType(query_param) {
  let res = {};
  if (query_param.type && query_param.type != "")
    res = { type: query_param.type };
  return res;
}

function _getQueryStatus(query_param) {
  let res = {};
  if (query_param.status && query_param.status != "")
    res = { status: query_param.status };
  return res;
}

function _getQuerySort(query_param) {
  let res = {};
  if (
    query_param.sort &&
    query_param.sort != "" &&
    query_param.sort_order &&
    query_param.sort_order != ""
  )
    res[query_param.sort] = query_param.sort_order;
  return res;
}

/****************************************************************
 ***************************** UTILS ****************************
 ***************************************************************/

async function getCategorySlug(category_name) {
  let new_slug = category_name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  const old_slugs = await CategoriesModel.find().select("slug -_id").lean();
  new_slug = await compareNewSlugWithOldSlugs(new_slug, old_slugs);
  return new_slug;
}

function compareNewSlugWithOldSlugs(new_slug, old_slugs) {
  for (const old_slug of old_slugs) {
    // If finds one equal, transform modify the new slug adding a random number
    if (old_slug.slug && old_slug.slug === new_slug) {
      new_slug = new_slug + Math.floor(Math.random() * 5000);
      // Starts again the comparison with the new slug re-generated
      new_slug = compareNewSlugWithOldSlugs(new_slug, old_slugs);
      return new_slug;
    }
  }
  return new_slug;
}
