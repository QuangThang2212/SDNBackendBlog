import AccountRepository from "../repository/AccountRepository.js";
import { body, validationResult } from "express-validator";
import sendEmail from '../utils/email.js';
import jwt from 'jsonwebtoken'

class accountController {
  async login(req, res) {
    // Validation done
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    // Call Repository: User
    try {
      const loginUser = await AccountRepository.login({ email, password });
      res.status(200).json({
        message: "Login successfully.",
        data: loginUser,
      });
    } catch (error) {
      res.status(500).json({ message: error.toString() });
    }
  }

  async register(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Destructuring object
    const { usename, email, password } = req.body;
    try {
      const verificationCode = await AccountRepository.generateVerificationCode();
      const expiredTime = new Date().getTime() + 10 * 60 * 1000;
      const newUser = await AccountRepository.register({ usename, email, password });

      await sendEmail(email, verificationCode);

      res.status(201).json({
        message: "Register successfully.",
        data: {
          user: newUser,
          verificationCode: verificationCode, 
          expiredTime,
        },
      });
    } catch (error) {
      res.status(500).json({
        errors: error.toString(),
      });
    }
  }

  

}

export default new accountController;
