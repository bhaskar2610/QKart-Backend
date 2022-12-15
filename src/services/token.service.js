const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { tokenTypes } = require("../config/tokens");

/**
 * Generate jwt token
 * - Payload must contain fields
 * --- "sub": `userId` parameter
 * --- "type": `type` parameter
 *
 * - Token expiration must be set to the value of `expires` parameter
 *
 * @param {ObjectId} userId - Mongo user id
 * @param {Number} expires - Token expiration time in seconds since unix epoch
 * @param {string} type - Access token type eg: Access, Refresh
 * @param {string} [secret] - Secret key to sign the token, defaults to config.jwt.secret
 * @returns {string}
 */
const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  // try{
  //   const Payload={"sub":userId,"type":type};
  //   const options={"expiresIn":expires};
  //   const token=jwt.sign(Payload,secret,options);
  //   // console.log(expires);
  //   // console.log(token);
  //  // const date = new Date(expires);
  //   //return {"expires":date,"token":token}
  //   return token;
  // }catch(error){
  //   throw error;
  // }
    const payload={
    sub:userId,
    type:type,
    iat:Math.floor(Date.now()/1000),
    exp:expires
  }
  return jwt.sign(payload,secret);


};

/**
 * Generate auth token
 * - Generate jwt token
 * - Token type should be "ACCESS"
 * - Return token and expiry date in required format
 *
 * @param {User} user
 * @returns {Promise<Object>}
 *
 * Example response:
 * "access": {
 *          "token": "eyJhbGciOiJIUzI1NiIs...",
 *          "expires": "2021-01-30T13:51:19.036Z"
 * }
 */
const generateAuthTokens = async (user) => {
 // console.log(user);
  // var date = new Date(timestamp);
  // console.log(date.getTime())
  // console.log(date)
  const expires =
        Math.floor(Date.now() / 1000) + config.jwt.accessExpirationMinutes * 60;
  try{
    const token=generateToken(user._id,expires,tokenTypes.ACCESS);
    //return {"access":result}
    return{
      "access":{
        "token":token,
        "expires":new Date(expires*1000),
      }
    }
  }catch(error){
    throw error;
  }

};

module.exports = {
  generateToken,
  generateAuthTokens,
};
