import express from "express";
import TopicController from "../controller/TopicController.js";

const TopicRouter = express.Router();

TopicRouter.get("/", TopicController.getAllTopic);
TopicRouter.get("/:TopicID", TopicController.getTopicById);

TopicRouter.post("/create", TopicController.createTopic);


export default BlogRouter;
