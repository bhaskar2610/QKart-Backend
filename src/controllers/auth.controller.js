const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { authService, userService, tokenService } = require("../services");

/**
 * Perform the following steps:
 * -  Call the userService to create a new user
 * -  Generate auth tokens for the user
 * -  Send back
 * --- "201 Created" status code
 * --- response in the given format
 *
 * Example response:
 *
 * {
 *  "user": {
 *      "_id": "5f71b31888ba6b128ba16205",
 *      "name": "crio-user",
 *      "email": "crio-user@gmail.com",
 *      "password": "$2a$08$bzJ999eS9JLJFLj/oB4he.0UdXxcwf0WS5lbgxFKgFYtA5vV9I3vC",
 *      "createdAt": "2020-09-28T09:55:36.358Z",
 *      "updatedAt": "2020-09-28T09:55:36.358Z",
 *      "__v": 0
 *  },
 *  "tokens": {
 *      "access": {
 *          "token": "eyJhbGciOiJIUz....",
 *          "expires": "2020-10-22T09:29:01.745Z"
 *      }
 *  }
 *}
 *
 */
const register = catchAsync(async (req, res) => {
  // console.log(req.body);
  // try {
  //   const newUserDetails = await userService.createUser(req.body);
  //   console.log(newUserDetails);
  //   const newUserToken = await tokenService.generateAuthTokens(newUserDetails);
  //   // const result={"user":newUserDetails,"token":newUserToken};
  //   res.status(httpStatus.CREATED).send({
  //     user: newUserDetails,
  //     token: newUserToken
  //   });
  //   // const newUser=
  // } catch (error) {
  //   //  console.log("error");
  //   if (error.code === 11000) {
  //     res.status(409).json({
  //       message: "Failed to create new user",
  //       reason: "Already exist in DB"
  //     })
  //   } else {
  //     // console.log("this error");
  //     res.status(httpStatus.OK).json({ message: "Failed to create new user", error });
  //   }
  // }
   const data = await userService.createUser(req.body);
  const authToken = await tokenService.generateAuthTokens(data);
  res.status(201).send({
    "user" : data,
    "tokens" : authToken
  });



});

/**
 * Perform the following steps:
 * -  Call the authservice to verify is password and email is valid
 * -  Generate auth tokens
 * -  Send back
 * --- "200 OK" status code
 * --- response in the given format
 *
 * Example response:
 *
 * {
 *  "user": {
 *      "_id": "5f71b31888ba6b128ba16205",
 *      "name": "crio-user",
 *      "email": "crio-user@gmail.com",
 *      "password": "$2a$08$bzJ999eS9JLJFLj/oB4he.0UdXxcwf0WS5lbgxFKgFYtA5vV9I3vC",
 *      "createdAt": "2020-09-28T09:55:36.358Z",
 *      "updatedAt": "2020-09-28T09:55:36.358Z",
 *      "__v": 0
 *  },
 *  "tokens": {
 *      "access": {
 *          "token": "eyJhbGciOiJIUz....",
 *          "expires": "2020-10-22T09:29:01.745Z"
 *      }
 *  }
 *}
 *
 */
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  // console.log(email);
  //console.log(password);
  // try {
  //   const user = await authService.loginUserWithEmailAndPassword(email, password);
  //   const newUserToken = await tokenService.generateAuthTokens(user);

  //   res.status(httpStatus.OK).send({
  //     user: user,
  //     token: newUserToken
  //   });
  // } catch (error) {
  //   throw error;
  // }
      const user = await authService.loginUserWithEmailAndPassword(req.body.email,req.body.password);
  const authToken = await tokenService.generateAuthTokens(user);
  res.status(200).send({
    "user" : user,
    "tokens" : authToken
  });

});

module.exports = {
  register,
  login,
};
