import topic from "../model/TopicModel.js";
import TopicRepository from "../repository/TopicRepository.js";

class topicController {
  async createTopic(req, res) {
    const { TopicName, TopicID } = req.data;
    try {
      var messages;
      var topic;
      if (TopicID) {
        topic = await TopicRepository.updateTopic({ TopicName, TopicID });
        messages = "Topic has been updated successfully";
      } else {
        topic = await TopicRepository.createNewTopic({ TopicName, TopicID });
        messages = "Topic has been created successfully";
      }
      res.status(200).json({
        message: messages,
        data: topic,
      });
    } catch (error) {
      res.status(500).json({ message: error.toString() });
    }
  }
  async getAllTopic(req, res) {
    try {
      topic = await TopicRepository.getAllTopic();
      res.status(200).json({
        data: topic,
      });
    } catch (error) {
      res.status(500).json({ message: error.toString() });
    }
  }
  async getTopicById(req, res) {
    const TopicID = req.params.TopicID;
    try {
      topic = await TopicRepository.getTopicById(TopicID);
      res.status(200).json({
        data: topic,
      });
    } catch (error) {
      res.status(500).json({ message: error.toString() });
    }
  }
}
export default new topicController();
