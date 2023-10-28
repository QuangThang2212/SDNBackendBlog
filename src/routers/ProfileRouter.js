import express from "express";
import ProfileController from "../controller/ProfileController.js";

const ProfileRouter = express.Router();

ProfileRouter.get("/", ProfileController.getUserProfile);

export default ProfileRouter;
