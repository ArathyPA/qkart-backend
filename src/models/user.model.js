const { number } = require("joi");
const mongoose = require("mongoose");
// NOTE - "validator" external library and not the custom middleware at src/middlewares/validate.js
const validator = require("validator");
const config = require("../config/config");
const bcrypt = require("bcryptjs");

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
      unique: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength:8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            "Password must contain at least one letter and one number"
          );
        }
      },
    },
    walletMoney: {
      type:Number,    
      default:500,
      required:true,
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

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement the isEmailTaken() static method


/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @returns {Promise<boolean>}
 */
 userSchema.statics.isEmailTaken = async function (email) {
  const emailExists = await this.findOne({ email });
  return emailExists;
};


/**
 * Check if entered password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
 userSchema.methods.isPasswordMatch = async function (password) {
  // CRIO_SOLUTION_START_MODULE_AUTH
  const user = this;
  
  return bcrypt.compare(password, this.password);
  // CRIO_SOLUTION_END_MODULE_AUTH
};

// CRIO_SOLUTION_START_MODULE_AUTH
// userSchema.pre("save", async function (next) {
//   const user = this;
//   if (user.isModified("password")) {
//     user.password = await bcrypt.hash(user.password, 10);
//   }
//   next();
// });
// CRIO_SOLUTION_END_MODULE_AUTH

userSchema.methods.hasSetNonDefaultAddress = async function () {
  const user = this;  
  return user.address !== config.default_address; 
};

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS
/*
 * Create a Mongoose model out of userSchema and export the model as "User"
 * Note: The model should be accessible in a different module when imported like below
 * const User = require("<user.model file path>").User;
 */
const User = new mongoose.model("User",userSchema)
module.exports={User}
/**
 * @typedef User
 */
