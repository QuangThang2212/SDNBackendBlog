import express from "express";
import { body } from "express-validator";
import BlogController from "../controller/BlogController.js";
import CommentController from "../controller/CommentController.js";

const BlogRouter = express.Router();
BlogRouter.get('/public-requested', BlogController.getPublicRequestedPosts);
BlogRouter.get('/user', BlogController.getBlogsByUser);
BlogRouter.get("/getall/:search/:limit/:offset/:tag/:sortby/:orderby", BlogController.getAllBlog);
BlogRouter.post("/react", BlogController.reactBlog);
BlogRouter.get("/blogDetail/:id", BlogController.getBlogDetail);
BlogRouter.post(
  "/create",
  body("title")
    .isLength({ min: 1, max: 20 })
    .withMessage("Title for blog must be at least 1 characters and less than 20 characters"),
  body("content").isLength({ min: 10 }).withMessage("Content for blog must be at least 10 characters"),
  BlogController.createBlog

);
BlogRouter.put('/requested', BlogController.requestPublic);
BlogRouter.get("/filter/:TopicName", BlogController.getTopicByTopicName);

BlogRouter.get("/blogDetail/:id/comments", CommentController.getAllComments);


export default BlogRouter;
