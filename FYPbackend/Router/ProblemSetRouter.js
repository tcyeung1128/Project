const express = require("express");
const script = require('../utility/script')

class ProblemSetRouter {
    constructor(ProblemSetService, AuthorizationService) {
        this.ProblemSetService = ProblemSetService;
        this.AuthorizationService = AuthorizationService;
    }

    router() {
        let router = express.Router();
        router.use("/", this.useVerifyToken.bind(this));
        router.get('/getMyProblemSetList', this.getMyProblemSetList.bind(this));
        router.get('/getSubscribedUsersProblemSet', this.getSubscribedUsersProblemSet.bind(this));
        router.get('/getProblemSetItem/:guid', this.getProblemSetItem.bind(this));
        router.post('/getQuestionList', this.getQuestionList.bind(this));
        router.post('/postCreateProblem', this.postCreateProblem.bind(this));
        router.get('/getSubscribeProblemSet/:problemSetGuid', this.getSubscribeProblemSet.bind(this));
        router.get('/getUnsubscribeProblemSet/:problemSetGuid', this.getUnsubscribeProblemSet.bind(this));
        router.post('/postSubmitAnswer', this.postSubmitAnswer.bind(this));
        router.get('/getRecordPage/:problemSetGuid', this.getRecordPage.bind(this));
        return router;
    }

    async useVerifyToken(req, res, next) {
        console.log('ProblemSetRouter: useVerifyToken');
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

    async getMyProblemSetList(req, res) {
        console.log('ProblemSetRouter: getMyProblemSetList');
        try {
            let page = req.query.page;
            let response = await this.ProblemSetService.myProblemSetList(req.tokenGuid, page);

            res.send(response);

        } catch (error) {
            console.error(error)
            let response = {
                status: 0,
                message: "Error."
            };
            res.send(response);
        }
    }

    async getSubscribedUsersProblemSet(req, res) {
        console.log('ProblemSetRouter: getSubscribedUsersProblemSet');
        try {
            let page = req.query.page;
            let response = await this.ProblemSetService.subscribedUsersProblemSet(req.tokenGuid, page);
            res.send(response);
        } catch (error) {
            console.error(error)
            let response = {
                status: 0,
                message: "Error."
            };
            res.send(response);
        }
    }

    async getProblemSetItem(req, res) {
        console.log('ProblemSetRouter: getProblemSetItem');
        try {
            let problem_set_guid = req.params.guid;
            let response = await this.ProblemSetService.problemSetItem(req.tokenGuid, problem_set_guid);

            res.send(response);
        } catch (error) {
            console.error(error)
            let response = {
                status: 0,
                message: "Error."
            };
            res.send(response);
        }
    }

    async getQuestionList(req, res) {
        console.log('ProblemSetRouter: getQuestionList');
        try {
            let problemSetGuid = req.body.guid;
            let setProblemSet = req.body.setProblemSet;
            let setProblemNumber = req.body.setProblemNumber;

            if (setProblemSet == "all") {
                let response = await this.ProblemSetService.questionListWithAll(req.tokenGuid, problemSetGuid);
                res.send(response);

            } else if (setProblemSet == "numset") {
                let response = await this.ProblemSetService.questionListWithRandom(req.tokenGuid, problemSetGuid, setProblemNumber);
                res.send(response);

            } else {
                let response = {
                    status: 0,
                    message: "Don't have this option."
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

    async postCreateProblem(req, res) {
        console.log('ProblemSetRouter: postCreateProblem');
        try {
            let body = req.body;
            let problemSetName = req.body.problemSet.problemSetName;
            let problemSetDescription = req.body.problemSet.problemSetDescription;
            let question = req.body.question;

            if(question.length===0){
                let response = {
                    status: 0,
                    message: "The number of problems cannot be zero."
                };
                res.send(response);
                return
            }

            let checkAccept = true;
            if (problemSetName == "") {
                checkAccept = false;
            }
            for (let i = 0; i < question.length; i++) {
                let checkQuestion = false;
                for (let j = 0; j < question[i].questionListChoice.length; j++) {
                    if (question[i].questionListAnswer == question[i].questionListChoice[j].choices) {
                        checkQuestion = true;
                    }
                }
                if (checkQuestion == false) {
                    checkAccept = false;
                }
            }

            if (checkAccept) {
                let response = await this.ProblemSetService.createProblem(req.tokenGuid, problemSetName, problemSetDescription, question);
                await this.ProblemSetService.subscribeProblemSet(req.tokenGuid, response.data);

                res.send(response);
            } else {
                let response = {
                    status: 0,
                    message: "The problem set data is not valid."
                };
                res.send(response);
            }


        } catch (error) {
            console.error(error)
            let response = {
                status: 0,
                message: "Router Error."
            };
            res.send(response);
        }
    }

    async getSubscribeProblemSet(req, res) {
        console.log('ProblemSetRouter: getSubscribeProblemSet');
        try {
            let guid = req.tokenGuid;
            let problemSetGuid = req.params.problemSetGuid;
            let response = await this.ProblemSetService.subscribeProblemSet(req.tokenGuid, problemSetGuid);
            res.send(response);
        } catch (error) {
            console.error(error)
            let response = {
                status: 0,
                message: "Router Error."
            };
            res.send(response);
        }
    }

    async getUnsubscribeProblemSet(req, res) {
        console.log('ProblemSetRouter: getUnsubscribeProblemSet');
        try {
            let guid = req.tokenGuid;
            let problemSetGuid = req.params.problemSetGuid;
            let response = await this.ProblemSetService.unsubscribeProblemSet(req.tokenGuid, problemSetGuid);
            res.send(response);
        } catch (error) {
            console.error(error)
            let response = {
                status: 0,
                message: "Router Error."
            };
            res.send(response);
        }
    }

    async postSubmitAnswer(req, res) {
        console.log('ProblemSetRouter: postSubmitAnswer');
        try {
            let checkProblemSetGuid = true;
            let problemSetGuid = "";
            if (req.body.length <= 0) {
                checkProblemSetGuid = false;
                let response = {
                    status: 0,
                    message: "No question."
                };
                res.send(response);
            }
            if (checkProblemSetGuid) {
                problemSetGuid = req.body[0].problemSetGuid;
                for (let i = 0; i < req.body.length; i++) {
                    if (problemSetGuid !== req.body[i].problemSetGuid) {
                        let response = {
                            status: 0,
                            message: "Problem Set Guid is incorrect."
                        };
                        res.send(response);
                        checkProblemSetGuid = false;
                        break;
                    }
                };
            };

            if (checkProblemSetGuid) {
                let answerList = [];
                for (let i = 0; i < req.body.length; i++) {
                    let obj = {
                        answer: req.body[i].answer,
                        problemSetGuid: req.body[i].problemSetGuid,
                        questionListGuid: req.body[i].questionListGuid,
                        questionNumber: req.body[i].questionNumber,
                        correct: false
                    };
                    answerList.push(obj);
                };
                let response = await this.ProblemSetService.submitAnswer(req.tokenGuid, problemSetGuid, answerList);
                res.send(response);

            }

        } catch (error) {
            console.error(error)
            let response = {
                status: 0,
                message: "Router Error."
            };
            res.send(response);
        }
    }

    async getRecordPage(req, res) {
        console.log('ProblemSetRouter: getRecordPage');
        try {
            let guid = req.tokenGuid;
            let problemSetGuid = req.params.problemSetGuid;
            let response = await this.ProblemSetService.recordPage(req.tokenGuid, problemSetGuid);
            res.send(response);
        } catch (error) {
            console.error(error)
            let response = {
                status: 0,
                message: "Router Error."
            };
            res.send(response);
        }
    }
}

module.exports = ProblemSetRouter;