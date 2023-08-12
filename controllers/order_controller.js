const { RouteError } = require("../errors/errors");
const OrderModel = require("../models/order_model");
const ConversationModel = require("../models/conversation_model");

/**
 * Create a country
 * All require properties in the model
 * @param {*} req
 * @param {*} res
 */
const createOrder = async (req, res) => {
  try {
    // Creates the order
    let body = req.body;
    body.order_id = Number(new Date()); // Transform the date to number to get the unique order ID
    const orderToCreate = new OrderModel(body);
    await orderToCreate.save();
    // Create the chat room
    let room_body = {
      room: orderToCreate._id,
      history: [],
      buyer: orderToCreate.buyer,
      seller: orderToCreate.seller,
    };
    const ConversationtoToCreate = new ConversationModel(room_body);
    await ConversationtoToCreate.save();
    // Reponse to the FE
    res.status(200).json({
      success: true,
      data: orderToCreate,
      msg: "Order created successfully",
    });
  } catch (error) {
    console.error("Error creating a country: ", error);
    res.status(400).json({
      success: false,
      message: "Error creating country",
      data: error,
    });
  }
};

const findOrdersByQuery = async (req, res) => {
  try {
    const QUERY = getQueries(req.query);
    const LIMIT = parseInt(req.query.limit) || 10000;
    const PAGE = parseInt(req.query.page) || 1;
    const SORT = _getQuerySort(req.query) || { order_id: -1 };
    const RESULT = await OrderModel.getOrdersByQuery(QUERY, LIMIT, PAGE, SORT);
    return res.json({ success: true, data: RESULT });
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

module.exports = {
  createOrder,
  findOrdersByQuery,
};

/**********************************************************************************
 **************************** Category's query handlers ***************************
 *********************************************************************************/

function getQueries(query_param) {
  let query = {};
  query = {
    ..._getQuery("seller", query_param),
    ..._getQuery("buyer", query_param),
    ..._getQuery("item", query_param),
    ..._getQuery("item_type", query_param),
    ..._getQuery("status", query_param),
    ..._getQuery("order_id", query_param),
  };
  return query;
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

function _getQuerySort(query_param) {
  const OBJ_KEY = _getQuery("sort", query_param);
  const OBJ_VALUE = _getQuery("sort_order", query_param);
  let res = {};
  if (OBJ_KEY["sort"] && OBJ_VALUE["sort_order"]) {
    res[OBJ_KEY["sort"]] = OBJ_VALUE["sort_order"];
    return res;
  } else return { order_id: -1 };
}
