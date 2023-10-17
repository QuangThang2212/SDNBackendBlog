import express from "express";
import { body } from "express-validator";
import AccountController from "../controller/AccountController.js";

const AccountRouter = express.Router();

AccountRouter.post(
  "/register",
  body("email").isEmail().withMessage("Email invalid format."),
  body("password").isLength({ min: 8 }).withMessage("Password length greater than 8"),
  AccountController.register
);

AccountRouter.post(
  "/login",
  body("email").isEmail().withMessage("Email invalid format."),
  body("password").isLength({ min: 5 }).withMessage("Password length greater than 5"),
  AccountController.login
);

export default AccountRouter;