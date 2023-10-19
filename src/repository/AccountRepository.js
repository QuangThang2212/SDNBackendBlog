import DefaultImage from "../../resource/DefaultImage.js";
import user from "../model/UserModel.js";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'



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
          process.env.SECRET_KEY,
          {
            expiresIn: "5m",
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

  async register({ usename, email, password }) {
    const userExisting = await user.findOne({ email }).exec();
    if (userExisting != null) {
      throw new Error("User existing.");
    }

    // Mã hóa mật khẩu
    const hashPassword = await bcrypt.hash(password, parseInt(process.env.SECRET_KEY));
    const avatar = DefaultImage.defaultAvatar;
    const role = process.env.ROLE_USER;

    const newUser = await user.create({
      usename,
      email,
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
