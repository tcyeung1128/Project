const express = require('express');
const app = express();
const port = 8000;
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cors());
const knexConfig = require('./database/knexfile').development;
const knex = require('knex')(knexConfig);

// require("dotenv").config();
console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
const AuthorizationService = require('./Service/AuthorizationService');
const AuthorizationRouter = require('./Router/AuthorizationRouter');
const authorizationService = new AuthorizationService(knex);
const authorizationRouter = new AuthorizationRouter(authorizationService);
app.use('/authorization', authorizationRouter.router());

const UserService = require('./Service/UserService');
const UserRouter = require('./Router/UserRouter');
const userService = new UserService(knex);
const userRouter = new UserRouter(userService, authorizationService);
app.use('/user', userRouter.router());

const WebService = require('./Service/WebService');
const WebRouter = require('./Router/WebRouter');
const webService = new WebService(knex);
const webRouter = new WebRouter(webService, authorizationService);
app.use('/web', webRouter.router());

const ProblemSetService = require('./Service/ProblemSetService');
const ProblemSetRouter = require('./Router/ProblemSetRouter');
const problemSetService = new ProblemSetService(knex);
const problemSetRouter = new ProblemSetRouter(problemSetService, authorizationService);
app.use('/problemset', problemSetRouter.router());

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});