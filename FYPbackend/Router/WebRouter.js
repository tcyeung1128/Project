const express = require("express");
const script = require('../utility/script')

class WebRouter {
  constructor(WebService, AuthorizationService) {
    this.WebService = WebService;
    this.AuthorizationService = AuthorizationService;
  }

  router() {
    let router = express.Router();
    router.use("/", this.useVerifyToken.bind(this));
    router.get('/LatestUpdatedProblemSet', this.getLatestUpdatedProblemSet.bind(this));
    router.get('/searchForSpecificProblemSet', this.getSearchForSpecificProblemSet.bind(this));
    return router;
  }

  async useVerifyToken(req, res, next) {
    console.log('WebRouter: useVerifyToken')
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
        status: 0,
        message: "Error."
      };
      res.send(response);
    }
  }

  async getLatestUpdatedProblemSet(req, res) {
    console.log('WebRouter: getLatestUpdatedProblemSet')
    try {
      let page = req.query.page;
      let response = await this.WebService.latestUpdatedProblemSet(req.tokenGuid, page);

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

  async getSearchForSpecificProblemSet(req, res) {
    console.log('WebRouter: getSearchForSpecificProblemSet')
    try {
      let text = req.query.text;
      let page = req.query.page;
      let response = await this.WebService.searchForSpecificProblemSet(req.tokenGuid, page, text);

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
}

module.exports = WebRouter;