const express = require("express");
const passwordRoute = express.Router();
const asyncHandler = require("express-async-handler");
const { getForgetPasswordView, sendForgetPasswordLink, getRecetPasswordView, resetThePassword } = require("../controllers/passwordController");

passwordRoute.route("/forget-password")
             .get(asyncHandler(getForgetPasswordView))
             .post(asyncHandler(sendForgetPasswordLink));

passwordRoute.route("/reset-password/:id/:token")
             .get(asyncHandler(getRecetPasswordView))
             .post(asyncHandler(resetThePassword));


module.exports = passwordRoute