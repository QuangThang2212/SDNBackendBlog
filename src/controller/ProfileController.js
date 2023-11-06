import usermodel from '../model/UserModel.js';

class ProfileController {
  async getUserProfile(req, res) {
    try {
      const user = req.user.data; // Lấy thông tin người dùng từ req.user

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      // Trả về thông tin người dùng trong trang Profile
      res.status(200).json({
        data: {
          username: user.usename,
          avatar: user.avatar,
          email: user.email,
          // Các thông tin khác về người dùng mà bạn muốn hiển thị
        },
      });
    } catch (error) {
      console.log(error.toString());
      res.status(500).json({ message: error.toString() });
    }
  }

  async getTopAuthor(req, res) {
    try {
      const topAuthorList = await usermodel.aggregate([
        {
          $lookup: {
            from: 'blogs',
            let: { userId: { $toString: "$_id" } },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$$userId", "$UserOwnerID"] }
                }
              },
              {
                $project: {
                  _id: 1
                }
              },
              {
                $group: {
                  _id: null,
                  totalBlogs: { $sum: 1 }
                }
              }
            ],
            as: 'blogCount'
          }
        },
        {
          $unwind: '$blogCount'
        },
        {
          $lookup: {
            from: 'blogs',
            let: { userId: { $toString: "$_id" } },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$$userId", "$UserOwnerID"] }
                }
              },
              {
                $project: {
                  _id: 1
                }
              },
              {
                $lookup: {
                  from: 'bookmarkandfavs',
                  let: { blogId: { $toString: "$_id" } },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ["$$blogId", "$blogID"] }
                      }
                    },
                    {
                      $project: {
                        type: 1,
                        _id: 0
                      }
                    }
                  ],
                  as: 'react'
                }
              },
              {
                $unwind: '$react'
              }
            ],
            as: 'blogs'
          }
        },
        {
          $unwind: '$blogs'
        },
        {
          $group: {
            _id: '$_id',
            username: { $first: '$usename' },
            email: { $first: '$email' },
            avatar: { $first: '$avatar' },
            totalBlogs: { $first: '$blogCount.totalBlogs' },
            totalFav: {
              $sum: {
                $cond: [{ $eq: ['$blogs.react.type', process.env.TYPE_FAV] }, 1, 0]
              }
            },
            totalBookmark: {
              $sum: {
                $cond: [{ $eq: ['$blogs.react.type', process.env.TYPE_MARK] }, 1, 0]
              }
            }
          }
        },
        {
          $addFields: {
            totalreact: {
              $add: ['$totalFav', '$totalBookmark']
            }
          }
        },
        {
          $sort: {
            totalreact: -1
          }
        },
        {
          $limit: 10 // Giới hạn kết quả chỉ trả về 10 giá trị
        }
      ]);
      res.status(200).json({ data: topAuthorList });
    } catch (error) {
      console.log(error.toString());
      res.status(500).json({ message: error.toString() });
    }
  }

}

export default new ProfileController();
