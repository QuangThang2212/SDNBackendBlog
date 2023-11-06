import * as express from "express";
import { body } from "express-validator";
import AccountController from "../controller/AccountController.js";

const AccountRouter = express.Router();

AccountRouter.post(
  "/register",
  body("usename").notEmpty().withMessage("Họ Tên không được trống"),
  body("email")
    .notEmpty()
    .withMessage("Email không được trống")
    .isString()
    .trim()
    .withMessage("Email phải đúng định dạng"),
  body("password")
    .notEmpty()
    .withMessage("Mật khẩu không được trống")
    .isLength({ min: 8 })
    .withMessage("Mật khẩu phải lớn hơn 8 kí tự"),
  AccountController.register
);

AccountRouter.post(
  "/login",
  body("email")
    .notEmpty()
    .withMessage("Email không được trống")
    .isString()
    .trim()
    .withMessage("Email phải đúng định dạng"),
  body("password")
    .notEmpty()
    .withMessage("Mật khẩu không được trống")
    .isLength({ min: 8 })
    .withMessage("Mật khẩu phải lớn hơn 8 kí tự"),
  AccountController.login
);

AccountRouter.post(
  "/updateAccountRole/:accountId",
  AccountController.updateRole
);

AccountRouter.get('/', AccountController.findAll);
AccountRouter.put('/userUpdate', AccountController.updateProfile);
AccountRouter.get("/search/:usename", AccountController.searchUser);
AccountRouter.get("/filter/:Role", AccountController.filterRole);


export default AccountRouter;
