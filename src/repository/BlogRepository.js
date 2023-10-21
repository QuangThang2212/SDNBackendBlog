import blog from "../model/BlogModel.js";

class BlogRepository {
  async createBlog({ Title, Content, TopicID, Userid }) {
    const newBlog = await blog.create({
      Title: Title,
      Content: Content,
      PublicStatus: false,
      TopicID: TopicID,
      UserOwnerID: Userid,
    });

    return {
      ...newBlog._doc,
    };
  }
  async updateBlog({ Title, Content, TopicID, BlogId }) {
    const blogDetail = await blog.findById(BlogId);
    if (blogDetail === null) {
      throw new Error("Blog isn't exist");
    }
    const updateBlog = await blog.updateOne(
      {
        _id: BlogId,
      },
      {
        $set: {
          Title: Title,
          Content: Content,
          PublicStatus: false,
          TopicID: TopicID,
        },
      }
    );

    // Clone a new user
    return {
      ...updateBlog._doc,
    };
  }
}

export default new BlogRepository();
