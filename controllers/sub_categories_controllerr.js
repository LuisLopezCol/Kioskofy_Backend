const { RouteError } = require("../errors/errors");
const SubCategoriesModel = require("../models/sub_categories_model");

const createSubCategory = async (req, res) => {
  try {
    const body = req.body;
    body.slug = await getSubCatSlug(body.title);
    const subCategoryToCreate = new SubCategoriesModel(body);
    await subCategoryToCreate.save();

    res.status(200).json({
      success: true,
      data: subCategoryToCreate,
      msg: "Sub category successfully created",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating product",
      data: error,
    });
  }
};

const getAll = async (req, res) => {
  try {
    const statusList = ["active", "inactive", "all"];
    const typeList = ["product", "service"];
    const status = req.params.status;
    const category = req.params.category;
    const type = req.query.type;

    if (!statusList.includes(status))
      throw new Error("list type is not correct");

    let query = {};
    // In case type list came, will be included
    if (type && typeList.includes(type)) query = { type };
    // In case status is different to all
    if (status != "all") query = { ...query, status };
    // In case status is different to all
    if (category != "all") query = { ...query, category };

    let categories = await SubCategoriesModel.find(query);

    res.status(200).json({
      success: true,
      data: categories,
      msg: "All sub categories successfully found",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error getting sub categories",
      data: error.message,
    });
  }
};

const getSubCategory = async (req, res) => {
  try {
    const sub_category_ID = req.params.id;
    const data = await SubCategoriesModel.findById(sub_category_ID);

    res.status(200).json({
      success: true,
      data: data,
      msg: "Sub category successfully Found",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error getting sub category",
      data: error,
    });
  }
};

const updateSubCategory = async (req, res) => {
  try {
    const body = req.body;
    const sub_category_ID = req.params.id;
    const data = await SubCategoriesModel.findByIdAndUpdate(
      sub_category_ID,
      body,
      { new: true }
    );
    res.status(200).json({
      success: true,
      data: data,
      msg: "Sub category updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating sub category",
      data: error,
    });
  }
};

const deleteSubCategory = async (req, res) => {
  try {
    const sub_category_ID = req.params.id;
    const data = await SubCategoriesModel.findByIdAndDelete(sub_category_ID);
    res.status(200).json({
      success: true,
      data: data,
      msg: "Sub category deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error deleting sub category",
      data: error,
    });
  }
};

const getSubCategoriesByQuery = async (req, res) => {
  try {
    const QUERY = getQuerySubCategories(req.query);
    const LIMIT = parseInt(req.query.limit) || 10000;
    const PAGE = parseInt(req.query.page) || 1;
    const SORT = _getQuerySort(req.query) || { title: -1 };
    const RESULT = await SubCategoriesModel.getSubCategoriesByQuery(
      QUERY,
      LIMIT,
      PAGE,
      SORT
    );
    return res.json({ success: true, data: RESULT });
  } catch (error) {
    let code = 400;
    let message = "Error when retrieving the sub categories";
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
  createSubCategory,
  updateSubCategory,
  getSubCategory,
  deleteSubCategory,
  getAll,
  getSubCategoriesByQuery,
};

/**********************************************************************************
 **************************** Category's query handlers ***************************
 *********************************************************************************/

function getQuerySubCategories(query_param) {
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

async function getSubCatSlug(sub_category_name) {
  let new_slug = sub_category_name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  const old_slugs = await SubCategoriesModel.find().select("slug -_id").lean();
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
