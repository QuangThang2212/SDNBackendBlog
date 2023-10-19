import blog from "../model/BlogModel.js";

class BlogRepository {

  async createBlog({ title, content, topicID, userid }) {
    const blogTitleExists = await blog.find({ title }).count().exec();
    if (blogTitleExists > 0) {
      throw new Error("Blog title already exists, please give it a new title");
    }
    console.log({ title, content, topicID, userid });
    const newBlog = await blog.create({
      Title: title,
      Content:content,
      PublicStatus: false,
      TopicID: topicID,
      UserOwnerID: userid,
    });

    return {
      ...newBlog._doc,
    };

  }
  async updateBlog({ title, content, topicID, blogId }) {
    const blogDetail = await blog.findById(blogId);
    if (blogDetail===null) {
      throw new Error("Blog isn't exist");
    }
    const updateBlog = await blog.updateOne(
      {
        _id: blogId,
      },
      {
        $set: {
          Title: title,
          Content: content,
          PublicStatus: false,
          TopicID: topicID,
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
