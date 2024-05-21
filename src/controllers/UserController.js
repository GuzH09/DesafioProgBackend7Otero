import UserService from '../services/UserService.js';

export default class UserController {

    constructor () {
        this.userService = new UserService();
    }

    async getAllUsers() {
        return this.userService.getAllUsers();
    }

    async getUser(uid) {
        return this.userService.getUser(uid);
    }

    async registerUser(user) {
        const { first_name, last_name, email, age, password } = user;

        if (!first_name || !last_name || !email || !age || !password ) {
            return {error: "Error registering user."};
        }

        return this.userService.registerUser(user);
    }

    async loginUser(email, password) {
        if (!email || !password ) {
            return {error: "Error login user."};
        }

        return this.userService.loginUser(email, password);
    }
}