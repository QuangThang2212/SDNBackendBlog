import blog from "../model/BlogModel.js";
import BookMarkandFav from "../model/BookMarkAndFavModel.js";

class BookMarkAndFavModel {
  async reactBlog({ blogid, type, userId }) {
    const checkexist = await BookMarkandFav.find({ userID: userId, blogID: blogid, type: type });
    if (checkexist.length === 0) {
      await BookMarkandFav.create({ userID: userId, blogID: blogid, type: type });
      if (type === process.env.TYPE_REPORT) {
        const CountNumberOfReport = await BookMarkandFav.find({ blogID: blogid, type: type }).count().exec();
        if (CountNumberOfReport == process.env.LIMIT_TO_DELETE_BLOG) {
          await BookMarkandFav.deleteMany({ blogID: blogid, type: type });
          await blog.updateOne(
            {
              _id: blogid,
            },
            {
              $set: {
                PublicStatus: false,
                PublicRequest: false,
              },
            }
          );
        }
      }
    } else {
      if (type !== process.env.TYPE_REPORT) {
        console.log("Delete react fav or bookmark");
        await BookMarkandFav.deleteMany({ userID: userId, blogID: blogid, type: type });
      }
    }
    return {
      type: type,
    };
  }
}

export default new BookMarkAndFavModel();
