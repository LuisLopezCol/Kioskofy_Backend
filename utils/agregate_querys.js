const LOOK_UP_CATEGORY = {
  $lookup: {
    from: "categories",
    localField: "category",
    foreignField: "_id",
    as: "category",
  },
};

const LOOK_UP_CATEGORY_LEAN = {
  $lookup: {
    from: "categories",
    localField: "category",
    foreignField: "_id",
    pipeline: [
      {
        $project: {
          title: "$title",
          slug: "$slug",
          image: "$image",
        },
      },
    ],
    as: "category",
  },
};

const LOOK_UP_SUBCATEGORY = {
  $lookup: {
    from: "sub_categories",
    localField: "sub_category",
    foreignField: "_id",
    as: "sub_category",
  },
};

const LOOK_UP_SUBCATEGORY_LEAN = {
  $lookup: {
    from: "sub_categories",
    localField: "sub_category",
    foreignField: "_id",
    pipeline: [
      {
        $project: {
          title: "$title",
          slug: "$slug",
        },
      },
    ],
    as: "sub_category",
  },
};

const LOOK_UP_COUNTRY = {
  $lookup: {
    from: "countries",
    localField: "country",
    foreignField: "_id",
    as: "country",
  },
};

const LOOK_UP_COUNTRY_LEAN = {
  $lookup: {
    from: "countries",
    localField: "country",
    foreignField: "_id",
    pipeline: [
      {
        $project: {
          title: "$name",
          isoCode: "$isoCode",
          flag: "$flag",
        },
      },
    ],
    as: "country",
  },
};

const LOOK_UP_QUESTIONS = {
  $lookup: {
    from: "questions",
    localField: "_id",
    foreignField: "reply_question",
    pipeline: [
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
    ],
    as: "reply_question",
  },
};

const LOOK_UP_USER = {
  $lookup: {
    from: "users",
    localField: "user",
    foreignField: "_id",
    as: "user",
  },
};

const LOOK_UP_USER_FAVORITES = {
  $lookup: {
    from: "favorites",
    localField: "_id",
    foreignField: "user",
    as: "favorites",
  },
};

const PROJECT_PORTFOLIO_ITEM = {
  $project: {
    _id: "$_id",
    name: "$name",
    slug: "$slug",
    description: "$description",
    status: "$status",
    images: "$images",
    price: "$price",
    price_discount: "$price_discount",
    condition: "$condition",
    category: { $arrayElemAt: ["$category", 0] },
    sub_category: { $arrayElemAt: ["$sub_category", 0] },
    country: { $arrayElemAt: ["$country", 0] },
    pickup_administrative_area_level_1: "$pickup_administrative_area_level_1",
    recommended: "$recommended",
    start_up: "$start_up",
    non_profit: "$non_profit",
    hand_craft: "$hand_craft",
    best_seller: "$best_seller",
    trending: "$trending",
    distance: "$distance",
    createdAt: "$createdAt",
  },
};

const PROJECT_USER_LEAN = {
  $project: {
    _id: "$_id",
    name: "$name",
    last_name: "$last_name",
    email: "$email",
    type: "$type",
    status: "$status",
    phone: "$phone",
    address: "$address",
    createdAt: "$createdAt",
    favorites: { $arrayElemAt: ["$favorites.favorites", 0] },
  },
};

const GROUP_PORTFOLIO_ITEM = {
  $group: {
    _id: "$_id",
    name: { $first: "$name" },
    slug: { $first: "$slug" },
    description: { $first: "$description" },
    status: { $first: "$status" },
    images: { $first: "$images" },
    price: { $first: "$price" },
    price_discount: { $first: "$price_discount" },
    condition: { $first: "$condition" },
    stock: { $first: "$stock" },
    seller: { $first: "$seller" },
    category: { $first: "$category" },
    sub_category: { $first: "$sub_category" },
    country: { $first: "$country" },
    pickup_locations: { $first: "$pickup_locations" },
    pickup_main_location: { $first: "$pickup_main_location" },
    pickup_country: { $first: "$pickup_country" },
    pickup_administrative_area_level_1: {
      $first: "$pickup_administrative_area_level_1",
    },
    recommended: { $first: "$recommended" },
    start_up: { $first: "$start_up" },
    non_profit: { $first: "$non_profit" },
    hand_craft: { $first: "$hand_craft" },
    best_seller: { $first: "$best_seller" },
    trending: { $first: "$trending" },
    distance: { $first: "$distance" },
    is_name_found: { $first: "$is_name_found" },
    createdAt: { $first: "$createdAt" },
    last_updated: { $first: "$last_updated" },
    deleted: { $first: "$deleted" },
  },
};

module.exports = {
  LOOK_UP_CATEGORY,
  LOOK_UP_CATEGORY_LEAN,
  LOOK_UP_SUBCATEGORY,
  LOOK_UP_SUBCATEGORY_LEAN,
  LOOK_UP_COUNTRY,
  LOOK_UP_COUNTRY_LEAN,
  LOOK_UP_QUESTIONS,
  LOOK_UP_USER,
  LOOK_UP_USER_FAVORITES,
  PROJECT_PORTFOLIO_ITEM,
  PROJECT_USER_LEAN,
  GROUP_PORTFOLIO_ITEM,
};
