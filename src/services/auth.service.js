const httpStatus = require("http-status");
const userService = require("./user.service");
const ApiError = require("../utils/ApiError");
const { authService } = require(".");
const { use } = require("passport");
// const { User } = require("../models");
const {User}=require('../models');

/**
 * Login with username and password
 * - Utilize userService method to fetch user object corresponding to the email provided
 * - Use the User schema's "isPasswordMatch" method to check if input password matches the one user registered with (i.e, hash stored in MongoDB)
 * - If user doesn't exist or incorrect password,
 * throw an ApiError with "401 Unauthorized" status code and message, "Incorrect email or password"
 * - Else, return the user object
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  // try{
  //   const user = await userService.getUserByEmail(email);
  //  // console.log(user);
  //   const isValidPassword = await User.isPasswordMatch(email, password);
  //  // console.log(isValidPassword);
  //   if(!isValidPassword) throw new ApiError(httpStatus.UNAUTHORIZED,"Incorrect password");
  //   else return user;
  // }catch(error){
  //   throw new ApiError(httpStatus.UNAUTHORIZED,"User Incorrect email or password are found");
  // }
    const user = await userService.getUserByEmail(email);
  if(!user) throw new ApiError(httpStatus.UNAUTHORIZED,"Incorrect email")
  const isMatch = await user.isPasswordMatch(password);
 // console.log(isMatch)
  if(!isMatch) throw new ApiError(httpStatus.UNAUTHORIZED,"Incorrect password");
  else return user;
};

module.exports = {
  loginUserWithEmailAndPassword,
};
