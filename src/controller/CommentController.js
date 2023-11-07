import jwt from "jsonwebtoken";
import blog from "../model/BlogModel.js";
import comment from "../model/CommentModel.js";
import user from "../model/UserModel.js";

class commentController {
  async createNewComment({ message, token, blogid, commentFatherId }) {
    var jwtObject;
    try {
      jwtObject = jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
      console.log(error);
      return {
        message: "Access token error",
        status: 500,
      };
    }

    let isExpired = Date.now() >= jwtObject.exp * 1000;

    if (isExpired) {
      return {
        message: "Access token expired",
        status: 500,
      };
    }
    const user = jwt.decode(token, process.env.SECRET_KEY);
    try {
      var fatherCom = "";
      if (commentFatherId) {
        fatherCom = commentFatherId;
      }
      const result = await comment.create({
        comment: message,
        fatherComment: fatherCom,
        blogID: blogid,
        userID: user.data._id,
      });

      return {
        message: result,
        status: 200,
      };
    } catch (error) {
      console.log(error);
      return {
        message: "Create comment fail",
        status: 500,
      };
    }
  }
  async getAllComments(req, res) {
    const blogId = req.params.id;
    const result = await blog.findById(blogId);
    if (!result) {
      res.status(500).json({
        message: "Invalid blogId",
      });
    }

    try {
      const comments = await comment.find({ blogID: blogId, fatherComment: "" });
      //await comments.sort({ _id: -1 });
      var response = [];
      if (comments.length !== 0) {
        response = await Promise.all(
          comments.map(async (c) => {
            var res = { ...c._doc };
            const commentAuthor = await user.findById(c.userID);

            const childComs = await comment.find({ fatherComment: c._id });

            if (childComs.length !== 0) {
              const subComments = await Promise.all(
                childComs.map(async (subc) => {
                  var childres = { ...subc._doc };
                  const commentAuthor = await user.findById(subc.userID);
                  childres.user = commentAuthor;
                  return childres;
                })
              );
              //await subComments.sort({ _id: -1 });
              res.fatherComment = [...subComments];
            }
            res.user = commentAuthor;
            return res;
          })
        );
      }

      res.status(200).json({
        response,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Get comments fail",
      });
    }
  }
}
export default new commentController();
