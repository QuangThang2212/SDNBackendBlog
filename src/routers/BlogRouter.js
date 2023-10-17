import express from "express";
import { body } from "express-validator";
import BlogController from "../controller/BlogController.js";

const BlogRouter = express.Router();

BlogRouter.get("/:id", BlogController.getBlogDetail);

BlogRouter.post(
  "/create/:id",
  body("title")
    .isLength({ min: 1, max: 20 })
    .withMessage("Title for blog must be at least 1 characters and less than 20 characters"),
  body("content").isLength({ min: 10 }).withMessage("Content for blog must be at least 10 characters"),
  BlogController.createBlog
);


export default BlogRouter;
