const mongoose = require("mongoose");
// NOTE - "validator" external library and not the custom middleware at src/middlewares/validate.js
const validator = require("validator");
const config = require("../config/config");
const bcrypt = require('bcryptjs');
//const { has } = require("core-js/core/dict");
//const { is } = require("core-js/core/object");
// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Complete userSchema, a Mongoose schema for "users" collection
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      }
    },
    password: {
      type: String,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            "Password must contain at least one letter and one number"
          );
        }
      },
    },
    walletMoney: {
      type: Number,
      required: true,
      default: config.default_wallet_money,
    },
    address: {
      type: String,
      default: config.default_address,
    },
  },
  // Create createdAt and updatedAt fields automatically
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  const user = this;
  try {
    if (!user.isModified("password")) {
      //  console.log("hey");
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(user.password, salt);
     // console.log(hashPassword);
      user.password = hashPassword;
    }
    return next();

  } catch (error) {
    next(error);
  }
});

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement the isEmailTaken() static method
/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email) {
  try {
    const result = await this.findOne({ "email": email });
    if (result)
      return true;
    return false;
  } catch (error) {
    throw error;
  }
};

/**
 * Check if entered password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.hasSetNonDefaultAddress = async function () {
  const user = this;
   return user.address !== config.default_address;
};

userSchema.methods.isPasswordMatch = async function (password) {
  // console.log(email, password);
  // try {
  //   const result = await this.findOne({ "email": email });
  //   console.log(result.password);
  //   const isValid = await bcrypt.compare(password, result.password);
  //   if (isValid)
  //     return true;
  //   return false;
  //   // return bcrypt.compare(password,this.password);
  // } catch (error) {
  //   // console.log("hello");
  //   throw error;
  // }
   const result=await bcrypt.compare(password, this.password);
  return result;
};



// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS
/*
 * Create a Mongoose model out of userSchema and export the model as "User"
 * Note: The model should be accessible in a different module when imported like below
 * const User = require("<user.model file path>").User;
 */
/**
 * @typedef User
 */
const User = mongoose.model("users", userSchema);
//  console.log(User);
module.exports = { User };
// module.exports.User = User;
// module.exports = {
//   User,
// };


