import blog from "../model/BlogModel.js";
import bookmarkAndFav from "../model/BookMarkAndFavModel.js";
import comment from "../model/CommentModel.js";
import topic from "../model/TopicModel.js";

class BlogRepository {
  async createBlog({ Title, Content, TopicID, Userid }) {
    const newBlog = await blog.create({
      Title: Title,
      Content: Content,
      PublicStatus: false,
      PublicRequest: false,
      TopicID: TopicID,
      UserOwnerID: Userid,
      ReportCount: [],
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
    const roleVertify =
      blogDetail.PublicStatus === true ||
      blogDetail.UserOwnerID === userid ||
      role === process.env.ROLE_ADMIN ||
      role === process.env.ROLE_CONTENT_MANAGER;
    if (roleVertify) {
      var favOfUser = false;
      var bookMarkOfUser = false;

      const checkFavOfUser = await bookmarkAndFav
        .find({ userID: userid, blogID: id, type: process.env.TYPE_FAV })
        .exec();
      const numberOfFav = await bookmarkAndFav.find({ blogID: id, type: process.env.TYPE_FAV }).count().exec();

      const checkBookmarkOfUser = await bookmarkAndFav
        .find({ userID: userid, blogID: id, type: process.env.TYPE_MARK })
        .exec();
      const numberOfBookmark = await bookmarkAndFav.find({ blogID: id, type: process.env.TYPE_MARK }).count().exec();

      const numberOfComments = await comment.find({ blogID: id }).count().exec();

      if (checkFavOfUser.length > 0) {
        favOfUser = true;
      }
      if (checkBookmarkOfUser.length > 0) {
        bookMarkOfUser = true;
      }
      const topicResult = await topic.findById(blogDetail?.TopicID);

      const numberOfBlog = await blog.find({ UserOwnerID: userid, PublicStatus: true }).count();
      response = {
        blogDetail: {
          ...blogDetail._doc,
          numberOfFav,
          numberOfBookmark,
          numberOfComments,
          topic: topicResult,
          userTotalBlog: numberOfBlog,
        },
        bookMarkOfUser,
        favOfUser,
      };
    } else {
      throw new Error("User don't have authority to access");
    }

    return {
      ...response,
    };
  }

  async getBlogsByUser(Userid) {
    const userBlogs = await blog.find({ UserOwnerID: Userid });
    return userBlogs;
  }

  async updatePublicRequest(postIds, userId) {
    await blog.updateMany({ _id: { $in: postIds } }, { PublicRequest: true });
  }
  async getPublicRequestedPosts() {
    const publicRequestedPosts = await blog.find({ PublicRequest: true });
    return publicRequestedPosts;
  }

  async publicBlog(id) {
    await blog.updateOne(
      { _id: id },
      {
        $set: {
          PublicStatus: true,
          PublicRequest: false,
        },
      }
    );
  }

  async getBlogByTopicName(TopicName) {
    const topics = await topic.findOne({
      TopicName: TopicName,
    });
    console.log(topics._id);
    const filtterBlogs = await blog.find({ TopicID: topics._id });
    return filtterBlogs;
  }

}


export default new BlogRepository();
