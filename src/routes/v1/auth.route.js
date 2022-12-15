const express = require("express");
const validate = require("../../middlewares/validate");
const authValidation = require("../../validations/auth.validation");
const authController = require("../../controllers/auth.controller");

const router = express.Router();
const {register,login}=authController;
// TODO: CRIO_TASK_MODULE_AUTH - Implement "/v1/auth/register" and "/v1/auth/login" routes with request validation
// const validateRegister=validate(authValidation.register);
// const validateLogin=validate(authValidation.login);
router.post('/register',validate(authValidation.register),register);
router.post('/login',validate(authValidation.login),login);

module.exports = router;
