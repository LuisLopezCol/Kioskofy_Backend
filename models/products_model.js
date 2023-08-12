const mongoose = require("mongoose");
const { NotFoundError } = require("../errors/errors");
const UTIL_OBJECT = require("../utils/agregate_querys");

const ProductsSchema = mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ["pending", "accepted", "suspended", "denied", "deleted", "blocked"],
  },
  images: { type: [String], required: true, default: "" },
  price: { type: Number, required: true, default: 0 },
  price_discount: { type: Number, required: false, default: 0 },
  condition: {
    type: String,
    required: true,
    default: "not_specified",
    enum: ["not_specified", "new", "used"],
  },
  stock: { type: Number, required: true, default: 0 },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "User",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Category",
  },
  sub_category: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Sub_Category",
  },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Country",
  },
  pickup_locations: {
    type: [{ lat: Number, lng: Number }],
    required: true,
  },
  pickup_main_location: {
    type: { lat: Number, lng: Number },
    required: true,
  },
  pickup_country: { type: String, required: true, default: false },
  pickup_administrative_area_level_1: {
    type: String,
    required: true,
  },
  // Badges
  recommended: { type: Boolean, required: true, default: false },
  start_up: { type: Boolean, required: true, default: false },
  non_profit: { type: Boolean, required: true, default: false },
  hand_craft: { type: Boolean, required: true, default: false },
  best_seller: { type: Boolean, required: true, default: false },
  trending: { type: Boolean, required: true, default: false },
  createdAt: { type: Date, required: false, default: Date.now },
  last_updated: { type: Date, require: false, default: Date.now },
  deleted: { type: Date, require: false, default: null },
});

ProductsSchema.statics = {
  removeById: function (removeData, callback) {
    this.findOneAndRemove(removeData, callback);
  },
  removeAll: function (query, callback) {
    this.remove(query).exec(callback);
  },

  getById: function (id, callback) {
    this.findOne({ _id: id }, callback);
  },

  getAll: function (id, callback) {
    this.find({}, callback);
  },

  getProductsBySearchText: async function (SEARCH_TEXT) {
    return await this.aggregate([
      { $match: { status: "accepted" } },
      UTIL_OBJECT.LOOK_UP_CATEGORY_LEAN,
      {
        $addFields: {
          // Adds a boolean to validate if search text match the name of the item by using regex (only if the search value is not empty)
          is_name_found: {
            $cond: [
              { $ne: [SEARCH_TEXT, ""] },
              {
                $regexMatch: {
                  input: "$name",
                  regex: SEARCH_TEXT,
                  options: "i",
                },
              },
              true,
            ],
          },
        },
      },
      { $match: { is_name_found: true } },
      { $sort: { trending: 1, recommended: 1 } },
      {
        $project: {
          title: "$name",
          price: {
            $cond: [
              { $gt: ["$price_discount", 0] },
              "$price_discount",
              "$price",
            ],
          },
          description: {
            $concat: [
              { $arrayElemAt: ["$category.title", 0] },
              " | ",
              "$pickup_administrative_area_level_1",
            ],
          },
          image: { $arrayElemAt: ["$images", 0] },
          type: "product",
        },
      },
    ]);
  },

  getOrdersByQuery: async function (
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
  ) {
    const SKIP = (PAGE - 1) * LIMIT;
    const data = await this.aggregate([
      /**
       * Create a separate object for each pickup location to find the distance
       * between each location and the search location if the distance between the
       * to points is less than the radius, the product is between the search area
       */
      { $unwind: "$pickup_locations" },
      {
        $addFields: {
          // Adds and calculates the distance between each product pickup location and the search location
          distance: {
            $multiply: [
              {
                $sqrt: {
                  $add: [
                    {
                      $pow: [
                        { $subtract: ["$pickup_locations.lat", LOCATION.lat] },
                        2,
                      ],
                    },
                    {
                      $pow: [
                        { $subtract: ["$pickup_locations.lng", LOCATION.lng] },
                        2,
                      ],
                    },
                  ],
                },
              },
              100000,
            ],
          },
          // Adds a boolean to validate if search text match the name of the item by using regex (only if the search value is not empty)
          is_name_found: {
            $cond: [
              { $ne: [SEARCH_TEXT, ""] },
              {
                $regexMatch: {
                  input: "$name",
                  regex: SEARCH_TEXT,
                  options: "i",
                },
              },
              true,
            ],
          },
        },
      },
      {
        $match: {
          ...CONDITION,
          ...PRICE,
          ...STOCK,
          ...QUERY,
          distance: { $lte: LOCATION.radius },
          is_name_found: true,
        },
      },
      UTIL_OBJECT.GROUP_PORTFOLIO_ITEM,
      UTIL_OBJECT.LOOK_UP_CATEGORY_LEAN,
      UTIL_OBJECT.LOOK_UP_SUBCATEGORY_LEAN,
      UTIL_OBJECT.LOOK_UP_COUNTRY_LEAN,
      UTIL_OBJECT.PROJECT_PORTFOLIO_ITEM,
      {
        $facet: {
          count: [{ $match: QUERY }, { $count: "count" }],
          data: [{ $sort: SORT }, { $skip: SKIP }, { $limit: LIMIT }],
          random: [{ $sample: { size: RANDOM } }],
        },
      },
    ]);
    let result = { data: [], count: 0 };
    if (data.length) {
      result = data;
    }
    return result;
  },

  create: async function (data) {
    const product = new this(data);
    const response = await product.save();
    return response;
  },

  onGetProductsForBar: async function (
    searchInfo = { searchText, limit, page }
  ) {
    const query = {
      status: "accepted",
      stock: { $gt: 0 },
    };
    const skip = (searchInfo.page - 1) * searchInfo.limit;
    return await this.aggregate([
      {
        $match: query,
      },
      {
        $addFields: {
          result: {
            $regexMatch: {
              input: "$name",
              regex: searchInfo.searchText,
              options: "i",
            },
          },
        },
      },
      {
        $match: {
          result: true,
        },
      },
      {
        $project: {
          _id: "$_id",
          name: "$name",
          image: {
            $first: "$images",
          },
          slug: "$slug",
        },
      },
      {
        $facet: {
          count: [
            {
              $count: "count",
            },
          ],
          data: [
            {
              $skip: skip,
            },
            {
              $limit: searchInfo.limit,
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$count",
        },
      },
    ]);
  },

  // Try first to find by slug, if not tries by ID, finally if not responses with error
  getProductBySlugOrID: async function (slug_id) {
    try {
      let data = await this.findOne({ slug: slug_id })
        .populate({
          path: "seller",
          model: "User",
          select: "name last_name profile_picture",
        })
        .populate({
          path: "category",
          model: "Category",
          select: "title",
        })
        .populate({
          path: "sub_category",
          model: "Sub_Category",
          select: "title",
        })
        .populate({
          path: "country",
          model: "Country",
          select: "name flag",
        });
      if (!data)
        data = await this.findOne({ _id: slug_id })
          .populate({
            path: "seller",
            model: "User",
            select: "name last_name profile_picture",
          })
          .populate({
            path: "category",
            model: "Category",
            select: "title",
          })
          .populate({
            path: "sub_category",
            model: "Sub_Category",
            select: "title",
          })
          .populate({
            path: "country",
            model: "Country",
            select: "name flag",
          });
      if (!data) throw new NotFoundError("Not found product for this query");
      return data;
    } catch (error) {
      throw error;
    }
  },
};

const Products = (module.exports = mongoose.model("Products", ProductsSchema));
