const UserModel = require("../models/user_model");
const bcryptjs = require("bcryptjs");
const infoValidator = require("../utils/info_validator");
const sellerController = require("./seller_controller");
const jwt = require("jsonwebtoken");
const configDataBase = require("../config/database");

/**
 * Create a category
 * All require properties in the model
 * @param {*} req
 * @param {*} res
 */
const createUser = async (req, res) => {
  try {
    const body = req.body;
    if (
      !infoValidator.onCheckPassword(body.password) ||
      !infoValidator.validateEmail(body.email)
    ) {
      throw new Error(
        "Email or password not formatted correctly or doesnt not exist"
      );
    }
    // check is user exist
    let checkExistingUser = await UserModel.findOne({ email: body.email });
    if (checkExistingUser) throw new Error("User already exist");

    const hash = await bcryptjs.hash(body.password, 10);
    body.password = hash;

    const userToCreate = new UserModel(body);
    await userToCreate.save();

    if (!userToCreate)
      throw new Error("Something went wrong creating the user, try again");

    // In case was created successfully, lets create the seller profile
    const seller = await sellerController.createSeller(userToCreate._id);
    // In case seller was not created successfully, will delete the user profile to avoid duplicated documents
    if (!seller) {
      await UserModel.findByIdAndDelete(userToCreate._id);
      throw new Error("Error creating user seller profile");
    }
    // Update user seller property when all its ok.
    await UserModel.findByIdAndUpdate(userToCreate._id, {
      $set: { seller: seller._id },
    });

    const tokenUser = {
      _id: userToCreate._id,
      name: userToCreate.name,
      last_name: userToCreate.last_name,
      email: userToCreate.email,
    };

    // Register successfully, login.
    const token = jwt.sign({ tokenUser }, configDataBase.jwtKey, {
      expiresIn: 604800,
    });

    res.status(200).json({
      success: true,
      data: tokenUser,
      token,
      msg: "User created successfully",
    });
  } catch (error) {
    console.error("Error creating a user", error);
    res.status(400).json({
      success: false,
      message: error.message,
      data: error,
    });
  }
};

/**
 * Login a user
 * @param {*} req | email, password
 * @param {*} res | token and basic info information
 */
const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) throw new Error("Email or password is missing");
    if (
      !infoValidator.validateEmail(email) ||
      !infoValidator.onCheckPassword(password)
    )
      throw new Error("Email or password are formatted incorrectly");

    email = email.toLowerCase();
    const user = await UserModel.findOne({ email });
    if (!user) throw new Error("User doesnt exist.");

    const checkPassword = await bcryptjs.compare(password, user.password);
    if (!checkPassword) throw new Error("Given password is incorrect");

    const tokenUser = {
      _id: user._id,
      name: user.name,
      last_name: user.last_name,
      email: user.email,
    };

    // Register successfully, login.
    const token = jwt.sign({ tokenUser }, configDataBase.jwtKey, {
      expiresIn: 604800,
    });

    res.status(200).json({
      success: true,
      data: tokenUser,
      token,
      msg: "User successfully logged",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      data: error,
    });
  }
};

module.exports = {
  createUser,
  login,
};
