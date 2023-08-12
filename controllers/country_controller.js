const { RouteError } = require("../errors/errors");
const CountryModel = require("../models/country_model");

/**
 * Create a country
 * All require properties in the model
 * @param {*} req
 * @param {*} res
 */
const createCountry = async (req, res) => {
  try {
    const body = req.body;
    const countryToCreate = new CountryModel(body);
    await countryToCreate.save();

    res.status(200).json({
      success: true,
      data: countryToCreate,
      msg: "Country created successfully",
    });
  } catch (error) {
    console.error("Erro creating a country: ", error);
    res.status(400).json({
      success: false,
      message: "Error creating country",
      data: error,
    });
  }
};

/**
 * Get all countries.
 * by status | active, inactive or all - It's a param (status)
 */
const getAll = async (req, res) => {
  try {
    const statusList = ["active", "inactive", "all"];
    const status = req.params.status;

    if (!statusList.includes(status))
      throw new Error("list type is not correct");

    let query = {};
    if (status != "all") query = { status };

    const countries = await CountryModel.find(query);

    res.status(200).json({
      success: true,
      data: countries,
      msg: "All categories successfully",
    });
  } catch (error) {
    console.error("Erro creating a country: ", error);
    res.status(400).json({
      success: false,
      message: "Error getting country",
      data: error.message,
    });
  }
};

/**
 * Get a country by id
 * @param {*} req | params id its the mongo country id
 * @param {*} res
 */
const getCountry = async (req, res) => {
  try {
    const countryId = req.params.id;
    const country = await CountryModel.findById(countryId);

    res.status(200).json({
      success: true,
      data: country,
      msg: "Country successfully",
    });
  } catch (error) {
    console.error("Erro creating a country: ", error);
    res.status(400).json({
      success: false,
      message: "Error getting country",
      data: error,
    });
  }
};

/**
 * Updates a country by id
 * @param {*} req | param id its the mongo country id
 * @param {*} res
 */
const updateCountry = async (req, res) => {
  try {
    const body = req.body;
    const countryId = req.params.id;

    const messageUpdated = await CountryModel.findByIdAndUpdate(
      countryId,
      body,
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: messageUpdated,
      msg: "Country updated successfully",
    });
  } catch (error) {
    console.error("Erro creating a country: ", error);
    res.status(400).json({
      success: false,
      message: "Error updating country",
      data: error,
    });
  }
};

/**
 * Delete a country
 * @param {*} req | params id its the mongo country id
 * @param {*} res
 */
const deleteCountry = async (req, res) => {
  try {
    const countryId = req.params.id;
    const country = await CountryModel.findByIdAndDelete(countryId);

    res.status(200).json({
      success: true,
      data: country,
      msg: "Country deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error deleting country",
      data: error,
    });
  }
};

const getCountriesByQuery = async (req, res) => {
  try {
    const QUERY = getQueryCategories(req.query);
    const LIMIT = parseInt(req.query.limit) || 10000;
    const PAGE = parseInt(req.query.page) || 1;
    const SORT = _getQuerySort(req.query) || { title: -1 };
    const RESULT = await CountryModel.getCountriesByQuery(
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
  createCountry,
  getAll,
  getCountry,
  getCountriesByQuery,
  updateCountry,
  deleteCountry,
};

/**********************************************************************************
 **************************** Country's query handlers ****************************
 *********************************************************************************/

function getQueryCategories(query_param) {
  let query = {};
  query = {
    ..._getQueryName(query_param),
    ..._getQueryCode(query_param),
    ..._getQueryIsoCode(query_param),
    ..._getQueryFlag(query_param),
    ..._getQueryStatus(query_param),
  };
  return query;
}

function _getQueryName(query_param) {
  let res = {};
  if (query_param.name && query_param.name != "")
    res = { name: query_param.name };
  return res;
}

function _getQueryCode(query_param) {
  let res = {};
  if (query_param.code && query_param.code != "")
    res = { code: query_param.code };
  return res;
}

function _getQueryIsoCode(query_param) {
  let res = {};
  if (query_param.isoCode && query_param.isoCode != "")
    res = { isoCode: query_param.isoCode };
  return res;
}

function _getQueryFlag(query_param) {
  let res = {};
  if (query_param.flag && query_param.flag != "")
    res = { flag: query_param.flag };
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
