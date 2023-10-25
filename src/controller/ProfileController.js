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
}

export default new ProfileController();
