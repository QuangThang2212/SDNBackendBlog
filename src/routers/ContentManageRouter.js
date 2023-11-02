import express from "express";
import ContentManagerController from "../controller/ContentManagerController.js";


const ContentManagerRouter = express.Router();

ContentManagerRouter.post("/publicBlog/:id", ContentManagerController.publicPost);

export default ContentManagerRouter;