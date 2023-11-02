import BlogRepository from "../repository/BlogRepository.js";

class ContentManagermentController {
  async publicPost(req, res) {
    const blogId = req.params.id;
    BlogRepository.publicBlog(blogId);
    res.status(200).json({ message: 'Public successfully!'});
  }
}

export default new ContentManagermentController();