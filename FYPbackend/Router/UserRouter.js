const express = require("express");

class UserRouter {
  constructor(UserService, AuthorizationService) {
    this.UserService = UserService;
    this.AuthorizationService = AuthorizationService;
  }

  router() {
    let router = express.Router();
    router.post('/login', this.postLogin.bind(this));
    router.post('/createaccount', this.postCreateAccount.bind(this));

    router.use("/useVerifyToken", this.useVerifyToken.bind(this));
    router.post('/useVerifyToken/modifyAccount', this.postModifyAccount.bind(this));
    return router;
  }

  async postLogin(req, res) {
    console.log('UserRouter: postLogin')
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
        status: 0,
        message: "Error."
      };
      res.send(response);
    }
  }
  async postCreateAccount(req, res) {
    console.log('UserRouter: postCreateAccount')
    try {
      let account = req.body.user_account;
      let password = req.body.user_password;
      let permission = "User";
      let response = await this.UserService.createAccount(account, password, permission);

      if (response.status === 1) {
        response = await this.AuthorizationService.createToken(account, password);
        res.send(response);
      } else {
        res.send(response);
      }

    } catch (error) {
      console.error(error)
      let response = {
        status: 0,
        message: "Error."
      };
      res.send(response);
    }
  }

  async useVerifyToken(req, res, next) {
    console.log('UserRouter: useVerifyToken')
    try {
      let token = req.headers.authorization;
      let response = await this.AuthorizationService.verifyToken(token);
      if (response.status === 1) {
        req.tokenGuid = response.data.userGUID
        next();
      } else {
        res.send(response);
      }
    } catch (error) {
      console.error(error)
      let response = {
        status: -1,
        message: "Error."
      };
      res.send(response);
    }
  }

  async postModifyAccount(req, res) {
    console.log('UserRouter: postModifyAccount')
    try {
      let oldPassword = req.body.oldPassword;
      let newPassword = req.body.newPassword;
      let confirmNewPassword = req.body.confirmNewPassword;
      if (newPassword === confirmNewPassword) {
        let response = await this.UserService.modifyAccount(req.tokenGuid, oldPassword, newPassword);
        res.send(response);
      } else {
        let response = {
          status: 0,
          message: "New password and confirm new password do not match."
        };
        res.send(response);
      }

    } catch (error) {
      console.error(error)
      let response = {
        status: 0,
        message: "Error."
      };
      res.send(response);
    }
  }
}

module.exports = UserRouter;