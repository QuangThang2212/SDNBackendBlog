import DefaultImage from "../../resource/DefaultImage.js";
import user from "../model/UserModel.js";

class accountRepository {
  async login({ email, password }) {
    const userExisting = await user.findOne({ email }).exec();
    if (userExisting) {
      const isMatch = await bcrypt.compare(password, userExisting.password);
      if (isMatch == true) {
        // Tạo Access Token bằng JWT
        const accessToken = jwt.sign(
          {
            data: userExisting,
          },
          process.env.SECRET_KEY_JWT,
          {
            expiresIn: process.env.TOKEN_EXPIRES_TIME,
          }
        );

        return {
          ...userExisting.toObject(),
          password: "Not show",
          token: accessToken,
        };
      } else {
        throw new Error("Wrong email and password");
      }
    } else {
      throw new Error("User not exist.");
    }
  }

  async register({ name, email, password }) {
    debugger;
    const userExisting = await User.findOne({ email }).exec();
    if (userExisting != null) {
      throw new Error("User existing.");
    }

    // Mã hóa mật khẩu
    const hashPassword = await bcrypt.hash(password, parseInt(process.env.SECRET_KEY));
    const avatar = DefaultImage.defaultAvatar;
    const role = process.env.ROLE_USER;

    const newUser = await user.create({
      name,
      gmail,
      password: hashPassword,
      avatar: avatar,
      ListFavBlog: [],
      ListOwnBlog: [],
      Role: role,
      Status: true,
      TopicManagerAssign: [],
    });

    // Clone a new user
    return {
      ...newUser._doc,
      password: "Not show",
    };
  }
}

export default new accountRepository();
