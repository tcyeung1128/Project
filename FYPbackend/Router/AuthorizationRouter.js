const express = require("express");

class AuthorizationRouter {
    constructor(AuthorizationService) {
        this.AuthorizationService = AuthorizationService;
    }

    router() {
        let router = express.Router();
        router.post("/login", this.postLogin.bind(this));
        router.post('/post', this.VerifyToken.bind(this));
        return router;
    }

    async postLogin(req, res) {
        console.log('AuthorizationRouter: postLogin');
        try {
            let account = req.body.user_account;
            let password = req.body.user_password;
            let response = await this.AuthorizationService.createToken(account, password);
            if (response.status === 1) {
                res.send(response);
            } else {
                res.send(response);
            }
        } catch (error) {
            console.error(error)
            let response = {
                message: "Error.",
                status: 0
            };
            res.send(response);
        }
    }

    async VerifyToken(req, res) {
        console.log('AuthorizationRouter: VerifyToken');
        try {
            let token = req.headers.authorization;
            let response = await this.AuthorizationService.verifyToken(token);
            if (response.status === 1) {
                res.send(response)
            } else {
                res.send(response)
            }
        } catch (error) {
            console.error(error)
            let response = {
                message: "Error.",
                status: 0
            };
            res.send(response);
        }
    }
}
module.exports = AuthorizationRouter;