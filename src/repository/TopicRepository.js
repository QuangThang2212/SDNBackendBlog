import topic from "../model/TopicModel.js";

class TopicRepository {
  async createNewTopic({ TopicName, TopicID }) {
    const TopicNameExists = await topic.find({ TopicName }).count().exec();
    if (blogTitleExists > 0) {
      throw new Error("Blog title already exists, please give it a new title");
    }
    const newBlog = await blog.create({
      Title: title,
      Content: content,
      PublicStatus: false,
      TopicID: topicID,
      UserOwnerID: userid,
    });

    return {
      ...newBlog._doc,
    };

  }
}
export default new TopicRepository;