import { validationResult } from "express-validator";
import BlogRepository from "../repository/BlogRepository.js";
import react from "../repository/BookMarkAndFavRepository.js";
import blog from "../model/BlogModel.js";

class blogController {
  async getAllBlog(req, res) {
    // const Userid = req.user.data._id;
    // console.log(Userid);
    const sortby = parseInt(req.params.sortby);
    const orderby = parseInt(req.params.orderby);
    let search = req.params.search;
    if (search === "none") search = "";
    console.log(search);
    let sort1 = "";
    if (sortby === 1) sort1 = "createdAt";
    else if (sortby === 2) sort1 = "countfav";
    else sort1 = "countbookmark";

    try {
      const data = await blog.aggregate([
        {
          $match: {
            $and: [{ Title: { $regex: search, $options: "i" } }, { PublicStatus: true }],
          },
        },
        {
          $addFields: {
            convertedUserId: { $toObjectId: "$UserOwnerID" },
            convertedBlogId: { $toString: "$_id" },
            convertedTopicId: { $toObjectId: "$TopicID" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "convertedUserId",
            foreignField: "_id",
            pipeline: [{ $project: { _id: 0, usename: 1, avatar: 1 } }],
            as: "author",
          },
        },
        {
          $lookup: {
            from: "topics",
            localField: "convertedTopicId",
            foreignField: "_id",
            pipeline: [{ $project: { TopicName: 1, _id: 0 } }],
            as: "topicname",
          },
        },
        {
          $lookup: {
            from: "bookmarkandfavs",
            localField: "convertedBlogId",
            foreignField: "blogID",
            pipeline: [{ $project: { userID: 1, type: 1, _id: 0 } }],
            as: "react",
          },
        },
        {
          $addFields: {
            countbookmark: {
              $size: {
                $filter: {
                  input: "$react",
                  as: "r",
                  cond: { $eq: ["$$r.type", process.env.TYPE_MARK] },
                },
              },
            },
            countfav: {
              $size: {
                $filter: {
                  input: "$react",
                  as: "r",
                  cond: { $eq: ["$$r.type", process.env.TYPE_FAV] },
                },
              },
            },
          },
        },

        { $sort: { [sort1]: orderby } },
        {
          $match: {
            $expr: {
              $cond: {
                if: { $ne: [req.params.tag, "none"] },
                then: { $eq: ["$TopicID", req.params.tag] },
                else: {},
              },
            },
          },
        },
        {
          $facet: {
            // Nhánh 1: Lấy kết quả trang hiện tại (bỏ qua pha skip và limit)
            pagingResult: [{ $skip: parseInt(req.params.offset) }, { $limit: parseInt(req.params.limit) }],
            // Nhánh 2: Tính tổng số lượng bản ghi (không bỏ qua pha skip và limit)
            totalCount: [{ $count: "count" }],
          },
        },
      ]);
      const pagingResult = data[0].pagingResult;
      const totalCount = data[0].totalCount[0]?.count || 0;
      res.status(200).json({
        data: pagingResult,
        count: totalCount,
      });
    } catch (error) {
      res.status(500).json({ message: error.toString() });
    }
  }

  async reactBlog(req, res) {
    const userId = req.user.data._id;
    // console.log(userId);
    // console.log("check", req.body);
    const { blogid, type } = req.body;
    if (!userId || !blogid || !type) {
      console.log("Unavailable react blog request: " + userId + " " + blogid + " " + type);
      res.status(500).json({ message: "Unavailable react blog request" });
    }
    try {
      const reactOfUser = await react.reactBlog({ blogid, type, userId });
      var messages;
      if (reactOfUser.type === process.env.TYPE_REPORT) {
        messages = "Thank you for your report to this blog";
      } else {
        messages = "Apply your react";
      }
      res.status(200).json({
        message: messages,
      });
    } catch (error) {
      console.log(error.toString());
      res.status(500).json({ message: error.toString() });
    }
  }

  async createBlog(req, res) {
    const { Title, Content, TopicID } = req.body;
    const Userid = req.user.data._id;
    const BlogId = req.body.blogId;

    console.log(BlogId);

    try {
      var messages;
      var blog;
      if (BlogId) {
        blog = await BlogRepository.updateBlog({ Title, Content, TopicID, BlogId });
        messages = "Blog has been updated successfully, please create publish request";
      } else {
        blog = await BlogRepository.createBlog({ Title, Content, TopicID, Userid });
        messages = "New blog has been created successfully, please create publish request";
      }
      res.status(200).json({
        message: messages,
        blog: blog,
      });
    } catch (error) {
      console.log(error.toString());
      res.status(500).json({ message: error.toString() });
    }
  }
  async getBlogDetail(req, res) {
    const blogId = req.params.id;
    if (!blogId) {
      console.log("Error: can't found blog id, location: getBlogDetail");
      res.status(500).json({ message: "Invalid blogId: " + blogId });
      return;
    }
    const userId = req?.user?.data?._id;
    const role = req?.user?.data?.Role;
    try {
      const blogDetail = await BlogRepository.getBlogById(blogId, role, userId);

      res.status(200).json({
        ...blogDetail,
      });
    } catch (error) {
      console.log(error.toString() + ", location: getBlogDetail");
      res.status(500).json({ message: error.toString() });
    }
  }
  async getBlogsByUser(req, res) {
    const Userid = req.user.data._id;

    try {
      const userBlogs = await BlogRepository.getBlogsByUser(Userid);

      res.status(200).json({
        userBlogs,
      });
    } catch (error) {
      console.error("Error fetching user blogs:", error);
      res.status(500).json({ Error: "Error fetching user blogs" });
    }
  }
  async requestPublic(req, res) {
    try {
      const { postIds } = req.body;
      const userId = req.user.data._id;

      await BlogRepository.updatePublicRequest(postIds, userId);

      res.status(200).json({ message: 'Cập nhật trạng thái "PublicRequest" thành true cho các bài viết thành công' });
    } catch (error) {
      console.error(error.toString());
      res.status(500).json({ message: error.toString() });
    }
  }
  async getPublicRequestedPosts(req, res) {
    try {
      const publicRequestedPosts = await BlogRepository.getPublicRequestedPosts();
      res.status(200).json(publicRequestedPosts);
    } catch (error) {
      console.error(error.toString());
      res.status(500).json({ message: error.toString() });
    }
  }

  async getTopicByTopicName(req, res) {
    const TopicName = req.params.TopicName;
    try {
      const result = await BlogRepository.getBlogByTopicName(TopicName);
      res.status(200).json(
       result,
      );
    } catch (error) {
      res.status(500).json({ message: error.toString() });
    }
  }
  async getBookmarkedBlogs(req, res) {
    const userId = req.user.data._id;
  
    try {
      const filteredBlogs = await BlogRepository.getBookmarkedBlogs(userId);
  
      res.status(200).json(filteredBlogs);
    } catch (error) {
      console.error("Error fetching bookmarked blogs: ", error);
      res.status(500).json({ message: error.toString() });
    }
  }
  
}
export default new blogController();
