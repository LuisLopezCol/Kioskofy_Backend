"use strict";
const S3 = require("../utils/s3");
const { v4: uuidv4 } = require("uuid");

/**
 * Uploads files to S3
 * @param {*} req.files | Files in the request. Key is 'image'
 * @param {*} res | { success: boolean, msg: string, data: routes}
 * @returns
 */
exports.uploadImages = async function (req, res) {
  try {
    const formFiles = req.files;
    let images = formFiles["images"];
    if (!Array.isArray(images)) images = [images];
    if (images && images.length > 0) {
      let routes = [];
      for (let image of images) {
        const file = {
          mimetype: image.mimetype,
          data: image.data,
        };
        routes.push(
          await S3.uploadFile({
            folder: "portfolio",
            file: file,
            file_name:
              "kioskofy" + "-" + uuidv4() + "-" + file.mimetype.split("/")[1],
          })
        );
      }
      return res.status(200).json({
        success: true,
        msg: "Images loaded successfully",
        data: routes,
      });
    } else {
      return res
        .status(400)
        .json({ success: false, msg: "Not file added to the request" });
    }
  } catch (error) {
    console.error("Error loading images", error);
    return res
      .status(500)
      .json({ success: false, msg: "Error loading images" });
  }
};
