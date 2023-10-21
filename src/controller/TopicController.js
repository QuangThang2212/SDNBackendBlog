class topicController {
    async createTopic(req, res) {
        const {TopicName, TopicID} = req.data;
        try {
          var messages;
          var topic;
          if (TopicID) {
            messages = "Topic has been updated successfully";
          } else {
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
}
export default new topicController;