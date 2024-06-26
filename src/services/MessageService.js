import messageModel from "../models/messageModel.js";

export default class MessageService {
    async getAllMessages() {
        try {
            const messages = await messageModel.find().lean();
            const messagesWithStrIds = messages.map(message => {
                return {
                    ...message,
                    _id: message._id.toString()
                };
            });
            return messagesWithStrIds;
        } catch (error) {
            return {error: error.message};
        }
    }

    async addMessage(messageData) {
        try {
            const result = await messageModel.create({user: messageData.user, message: messageData.message});
            return {success: "Message added."};
        } catch (error) {
            return {error: error.message};
        }
    }
}