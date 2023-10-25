import blog from "../model/BlogModel.js";
import bookmarkAndFav from "../model/BookMarkAndFavModel.js";
import comment from "../model/CommentModel.js";

class BlogRepository {
  async createBlog({ Title, Content, TopicID, Userid }) {
    const newBlog = await blog.create({
      Title: Title,
      Content: Content,
      PublicStatus: false,
      PublicRequest: false,
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
          PublicRequest: false,
          TopicID: TopicID,
        },
      }
    );

    // Clone a new user
    return {
      ...updateBlog._doc,
    };
  }
  async getBlogById(id, role, userid) {
    var response;

    const blogDetail = await blog.findById(id);
    if (blogDetail === null) {
      throw new Error("Blog isn't exist");
    }
    const roleVertify = true;
    // blogDetail.PublicStatus === true ||
    // blogDetail.UserOwnerID === userId ||
    // role === process.env.ROLE_ADMIN ||
    // role === process.env.ROLE_CONTENT_MANAGER;
    if (roleVertify) {
      var favOfUser = false;
      var bookMarkOfUser = false;

      const checkFavOfUser = await bookmarkAndFav.find({ userID: userid, blogID: id, type: true }).exec();
      const numberOfFav = await bookmarkAndFav.find({ blogID: id, type: true }).count().exec();

      const checkBookmarkOfUser = await bookmarkAndFav.find({ userID: userid, blogID: id, type: false }).exec();
      const numberOfBookmark = await bookmarkAndFav.find({ blogID: id, type: false }).count().exec();

      const numberOfComments = await comment.find({ blogID: id }).count().exec();

      if (checkFavOfUser.length > 0) {
        favOfUser = true;
      }
      if (checkBookmarkOfUser.length > 0) {
        bookMarkOfUser = true;
      }
      response = {
        ...blogDetail._doc,
        numberOfFav,
        bookMarkOfUser,
        favOfUser,
        numberOfBookmark,
        numberOfComments,
      };
    } else {
      throw new Error("User don't have authority to access");
    }

    return {
      ...response,
    };
  }
}

export default new BlogRepository();
