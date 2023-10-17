import blog from "../model/BlogModel.js";
import BlogRepository from "../repository/BlogRepository.js";

class blogController {
  async createBlog(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { title, Content, topicID } = req.body;
    const userid = req.user.id;
    const blogId = req.params.id;

    try {
      if (blogId) {
        const blog = await BlogRepository.update({ title, Content, topicID, blogId });
      } else {
        const blog = await BlogRepository.createBlog({ title, Content, topicID, userid });
      }
      res.status(200).json({
        message: "New blog has been updated successfully, please create publish request",
        data: blog,
      });
    } catch (error) { 
      res.status(500).json({ message: error.toString() });
    }
  }
  async getBlogDetail(req, res) {
    const blogId = req.params.id;
    try {
      const blogDetail = await blog.findById(blogId).exec();
      if (blogDetail) {
        res.status(500).json({ message: "Blog isn't exist" });
      }
      const roleVertify =
        blogDetail.PublicStatus === true ||
        blogDetail.UserOwnerID === req.user.id ||
        req.user.role === process.env.ROLE_ADMIN ||
        req.user.role === process.env.ROLE_CONTENT_MANAGER;
      if (roleVertify) {
        res.status(200).json({
          data: blogDetail,
        });
      }
      res.status(500).json({
        message: "Invalid permissions to access",
      });
    } catch (error) {
      res.status(500).json({ message: error.toString() });
    }
  }
}
export default new blogController();
