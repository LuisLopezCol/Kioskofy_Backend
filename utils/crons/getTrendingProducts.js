const PortfolioViewModel = require("../../models/portfolio_views_model");

//
const UPDATE_TRENDING_PRODUCTS = async function getTrendingProducts() {
  const TOTAL_DAYS_TO_COUNT = 30; // Total previous days where the view will be taking into account
  const TARGET_DATE = new Date();
  TARGET_DATE.setDate(TARGET_DATE.getDate() - TOTAL_DAYS_TO_COUNT);

  const ITEMS_VIEWS = await PortfolioViewModel.find();

  let total_view_per_products = getTotalViews(ITEMS_VIEWS, TARGET_DATE);

  await resetAllProductsToTrendingFalse();
  updateProducts(total_view_per_products);
};

module.exports = {
  UPDATE_TRENDING_PRODUCTS,
};

/***********************************************************************************
 ************************************** UTILS **************************************
 **********************************************************************************/

/**
 * This function updates multiple documents in a MongoDB collection to set the trending property to true for each document.
 * The information about which documents to update and their corresponding trending values is provided in the FINAL_TOTAL_VIEWS array.
 * @param {*} FINAL_TOTAL_VIEWS An array of objects containing information about products and their corresponding trending values.
 * Each object should have at least two properties:
 *     product_id: The ID or identifier of the product to update.
 *     total_views: The total number of views for the product.
 */
function updateProducts(FINAL_TOTAL_VIEWS) {
  for (const ITEM of FINAL_TOTAL_VIEWS) {
    PortfolioViewModel.findOneAndUpdate(
      { _id: ITEM.product_id },
      { $set: { trending: true } },
      { new: true }
    );
  }
}

// This asynchronous function updates multiple documents in a MongoDB collection to set the trending property to false.
async function resetAllProductsToTrendingFalse() {
  await PortfolioViewModel.updateMany({}, { $set: { trending: false } });
}

/**
 * This function calculates the total number of views for each product in the PRODUCTS_VIEWS array that occurred after the specified TARGET_DATE.
 * It returns an array of the top 2 products with the highest total views, sorted in descending order based on the total views.
 * @param {*} PRODUCTS_VIEWS An array of objects representing product views. Each object should have at least two properties:
        item: The product ID or identifier.
        views: An array of view objects, each having a date property representing the date of the view.
 * @param {*} TARGET_DATE A JavaScript Date object representing the starting date. The function will count the number of views that occurred after this date for each product.
 * @returns The function returns an array containing the top TARGET products with the highest total views, sorted in descending order based on the total views.
 */
function getTotalViews(PRODUCTS_VIEWS, TARGET_DATE) {
  const FINAL_TOTAL_VIEWS = [];
  for (const PRODUCT of PRODUCTS_VIEWS) {
    let total_views = getTotalViewsAfterGivenDate(PRODUCT, TARGET_DATE);
    FINAL_TOTAL_VIEWS.push({
      product_id: PRODUCT.item,
      total_views: total_views,
    });
  }
  sortByProperty(FINAL_TOTAL_VIEWS, "total_views");
  return FINAL_TOTAL_VIEWS.slice(0, 2);
}

/**
 * This function calculates the total number of views for a given PRODUCT that occurred after a specified date_start
 * @param {*} PRODUCT An object representing a product. It should have a property named views, which is an array of objects representing individual views of the product. Each view object should have a date property representing the date of the view.
 * @param {*} date_start A JavaScript Date object representing the starting date. The function will count the number of views that occurred after this date.
 * @returns The function returns the total number of views that occurred after the specified
 */
function getTotalViewsAfterGivenDate(PRODUCT, date_start) {
  let total = 0;
  for (const view of PRODUCT.views) if (view.date > date_start) total++;
  return total;
}

/**
 * This function sorts an array of objects in place based on a specified property of the objects.
 * @param {*} arr The array of objects to be sorted.
 * @param {*} property The name of the property based on which the sorting will be done. This property should exist in each object of the array.
 * @returns The function does not return anything explicitly, as it sorts the arr array in place.
 */
function sortByProperty(arr, property) {
  arr.sort((a, b) => {
    if (a[property] > b[property]) {
      return -1;
    } else if (a[property] < b[property]) {
      return 1;
    } else {
      return 0;
    }
  });
}
