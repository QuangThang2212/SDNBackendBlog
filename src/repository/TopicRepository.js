import topic from "../model/TopicModel.js";


class TopicRepository {
  async createNewTopic({ TopicName }) {
    const TopicNameExists = await topic.find({ TopicName }).count().exec();
    if (TopicNameExists > 0) {
      throw new Error("Topic name already exists, please give it a new name");
    }
    const newTopic = await topic.create({
      TopicName: TopicName,
    });

    return {
      ...newTopic._doc,
    };
  }
  async updateTopic({ TopicName, TopicID }) {
    var TopicNameExists = await topic.findById({ _id: TopicID }).exec();
    if (TopicNameExists.TopicName !== TopicName) {
      TopicNameExists = await topic.find({ TopicName: TopicName }).count().exec();
      if (TopicNameExists.length > 0) {
        throw new Error("Topic name already exists, please give it a new name");
      }
    }
    const newTopic = await topic.updateOne(
      {
        _id: TopicID,
      },
      {
        $set: {
          TopicName: TopicName,
        },
      }
    );

    return {
      ...newTopic._doc,
    };
  }
  async getAllTopic() {
    const topics = await topic.find();
    return {
      ...topics._doc,
    };
  }
  async getTopicById(TopicID) {
    const topics = await topic.findById(TopicID);
    return {
      ...topics._doc,
    };
  }
}
export default new TopicRepository();
