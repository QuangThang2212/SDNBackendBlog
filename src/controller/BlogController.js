import { validationResult } from "express-validator";
import BlogRepository from "../repository/BlogRepository.js";

class blogController {
  async createBlog(req, res) {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }
    const { Title, Content, TopicID } = req.body;
    const Userid = req.user.data._id;
    const BlogId = req.body.blogId;

    try {
      var messages;
      var blog;
      if (BlogId) {
        blog = await BlogRepository.updateBlog({ Title, Content, TopicID, BlogId });
        messages = "Blog has been updated successfully, please create publish request";
      } else {
        blog = await BlogRepository.createBlog({ Title, Content, TopicID, Userid });
        messages = "New blog has been created successfully, please create publish request";
      }
      res.status(200).json({
        message: messages,
        blog: blog,
      });
    } catch (error) {
      console.log(error.toString());
      res.status(500).json({ message: error.toString() });
    }
  }
  async getBlogDetail(req, res) {
    const blogId = req.params.id;
    const userId = req?.user?.data?._id;
    const role = req?.user?.role;
    try {
      const blogDetail = await BlogRepository.getBlogById(blogId, role, userId);

      res.status(200).json({
        blogDetail,
      });
    } catch (error) {
      console.log(error.toString() + ", location: getBlogDetail");
      res.status(500).json({ message: error.toString() });
    }
  }
}
export default new blogController();
