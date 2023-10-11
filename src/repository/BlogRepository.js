import blog from "../model/BlogModel.js";

class BlogRepository {
  async createBlog({ blogTitle, blogContent, blogTopicID }) {
    const blogTitleExists = await blog.find({ Title: blogTitle }).count().exec();
    if (blogTitleExists > 0) {
      throw new Error("Blog title already exists, please give it a new title");
    }

    const newBlog = await blog.create({
      Title: blogTitle,
      Content: blogContent,
      PublicStatus: false,
      NumberOfFav: 0,
      CreateAt: new Date.now(),
      TopicID: blogTopicID,
    });

    // Clone a new user
    return {
      ...newBlog._doc,
    };
  }
}

export default new BlogRepository;
