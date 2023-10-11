import blog from "../model/BlogModel.js";
import BlogRepository from "../repository/BlogRepository.js";

class blogController {
  async createBlog(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { title, Content, topicID } = req.body;
    try {
      const newBlog = await BlogRepository.createBlog({ title, Content, topicID });
      res.status(200).json({
        message: "Create new blog successfully, please create publish request",
        data: newBlog,
      });
    } catch (error) {
      res.status(500).json({ message: error.toString() });
    }
  }
  async getBlogDetail(req, res) {
    const blogId = req.params.id;
    try {
      const blogDetail = await blog.findById(blogId).exec();
      if(blogDetail){

      }
      res.status(200).json({
        data: blogDetail,
      });
    } catch (error) {
      res.status(500).json({ message: error.toString() });
    }
  }
}
export default new blogController();
