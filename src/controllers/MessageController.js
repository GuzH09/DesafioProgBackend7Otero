import MessageService from "../services/MessageService.js";

export default class MessageController {

    constructor () {
        this.messageService = new MessageService();
    }

    async getAllMessages() {
        return this.messageService.getAllMessages();
    }

    async addMessage(messageData) {
        return this.messageService.addMessage(messageData);
    }
}