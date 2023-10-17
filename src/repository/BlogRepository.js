import blog from "../model/BlogModel.js";

class BlogRepository {
  async createBlog({ blogTitle, blogContent, blogTopicID, userOwnerID }) {
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
      UserOwnerID: userOwnerID,
    });

    // Clone a new user
    return {
      ...newBlog._doc,
    };
  }
  async updateBlog({ blogTitle, blogContent, blogTopicID, blogID }) {
    const blogDetail = await blog.findById(blogId).exec();
    if (blogDetail) {
      throw new Error("Blog isn't exist");
    }
    const blogTitleExists = await blog.find({ Title: blogTitle }).count().exec();
    if (blogTitleExists > 0) {
      throw new Error("Blog title already exists, please give it a new title");
    }

    const updateBlog = await blog.update(
      {
        id: blogID,
      },
      {
        $set: {
          Title: blogTitle,
          Content: blogContent,
          PublicStatus: false,
          TopicID: blogTopicID,
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
