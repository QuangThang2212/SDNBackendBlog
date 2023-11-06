import express from "express";
import ProfileController from "../controller/ProfileController.js";

const ProfileRouter = express.Router();

ProfileRouter.get("/", ProfileController.getUserProfile);

ProfileRouter.get("/topauthorlist", ProfileController.getTopAuthor);

export default ProfileRouter;
