const cryptoUtils = require('../utility/cryptoUtils');
const script = require('../utility/script')

class ProblemSetService {
    constructor(knex) {
        this.knex = knex;
    }

    async myProblemSetList(guid, page) {
        console.log('ProblemSetService: myProblemSetList');
        try {
            guid = String(guid);
            page = Number(page);
            page = (page - 1);

            let dataInPage = 6;
            let maxItemCount = await this.knex('problem_set')
                .join(
                    'personal_information',
                    'personal_information.personal_information_id',
                    '=',
                    'problem_set.personal_information_id_fk'
                )
                .where('problem_set.problem_set_is_enable', '=', true)
                .andWhere('personal_information.personal_information_guid', '=', guid)
                .count();

            if ((page * dataInPage) >= 0 && (page * dataInPage) <= maxItemCount[0].count) {
                let data = await this.knex('problem_set')
                    .join(
                        'personal_information',
                        'personal_information.personal_information_id',
                        '=',
                        'problem_set.personal_information_id_fk'
                    )
                    .select('personal_information.personal_information_guid',
                        'problem_set.problem_set_guid', 'problem_set.problem_set_name',
                        'problem_set.problem_set_description')
                    .where('problem_set.problem_set_is_enable', '=', true)
                    .andWhere('personal_information.personal_information_guid', '=', guid)
                    .orderBy('problem_set.updated_at', 'desc')
                    .limit(dataInPage)
                    .offset((page * dataInPage));

                let response = {
                    data: data,
                    maxItemCount: maxItemCount[0].count,
                    maxPage:Math.ceil(maxItemCount[0].count / dataInPage),
                    status: 1,
                    message: "Successfully obtained data."
                };
                return response

            } else {
                let response = {
                    data: {},
                    maxItemCount: maxItemCount[0].count,
                    maxPage:Math.ceil(maxItemCount[0].count / dataInPage),
                    status: 1,
                    message: "Page is out of range."
                };
                return response
            }
        }
        catch (error) {
            console.error(error)
            let response = {
                status: 0,
                message: "Error."
            };
            return response
        }
    }

    async subscribedUsersProblemSet(guid, page) {
        console.log('ProblemSetService: subscribedUsersProblemSet');
        try {
            guid = String(guid);
            page = Number(page);
            page = (page - 1);

            let dataInPage = 6;
            let maxItemCount = await this.knex('problem_set')
                .join(
                    'personal_information',
                    'personal_information.personal_information_id',
                    '=',
                    'problem_set.personal_information_id_fk'
                )
                .join(
                    'subscribe_question',
                    'subscribe_question.problem_set_id_fk',
                    '=',
                    'problem_set.problem_set_id'
                )
                .where('problem_set.problem_set_is_enable', '=', true)
                .andWhere('subscribe_question.subscribe_question_is_enable', '=', true)
                .andWhere('subscribe_question.personal_information_guid_fk', '=', guid)
                .andWhere('problem_set.personal_information_guid_fk', '!=', guid)
                .count();

            if ((page * dataInPage) >= 0 && (page * dataInPage) <= maxItemCount[0].count) {
                let data = await this.knex('problem_set')
                    .join(
                        'personal_information',
                        'personal_information.personal_information_id',
                        '=',
                        'problem_set.personal_information_id_fk'
                    )
                    .join(
                        'subscribe_question',
                        'subscribe_question.problem_set_id_fk',
                        '=',
                        'problem_set.problem_set_id'
                    )
                    .select(
                        'personal_information.personal_information_guid',
                        'subscribe_question.subscribe_question_id',
                        'problem_set.problem_set_guid', 'problem_set.problem_set_name',
                        'problem_set.problem_set_description')
                    .where('problem_set.problem_set_is_enable', '=', true)
                    .andWhere('subscribe_question.subscribe_question_is_enable', '=', true)
                    .andWhere('subscribe_question.personal_information_guid_fk', '=', guid)
                    .andWhere('problem_set.personal_information_guid_fk', '!=', guid)
                    .orderBy('problem_set.updated_at', 'desc')
                    .limit(dataInPage)
                    .offset((page * dataInPage));

                let response = {
                    data: data,
                    maxItemCount: maxItemCount[0].count,
                    maxPage:Math.ceil(maxItemCount[0].count / dataInPage),
                    status: 1,
                    message: "Successfully obtained data."
                };
                return response

            } else {
                let response = {
                    data: {},
                    maxItemCount: maxItemCount[0].count,
                    maxPage:Math.ceil(maxItemCount[0].count / dataInPage),
                    status: 1,
                    message: "Page is out of range."
                };
                return response
            }
        }
        catch (error) {
            console.error(error)
            let response = {
                status: 0,
                message: "Error."
            };
            return response
        }
    }

    async problemSetItem(guid, problem_set_guid) {
        console.log('ProblemSetService: problemSetItem');
        try {
            guid = String(guid);
            problem_set_guid = String(problem_set_guid);
            let questionListCount = await this.knex
                .select('')
                .from('question_list')
                .where('problem_set_guid_fk', '=', problem_set_guid)
                .count();

            let data = await this.knex('problem_set')
                .select('personal_information_guid_fk', 'problem_set_guid', 'problem_set_name', 'problem_set_description')
                .where('problem_set_guid', '=', problem_set_guid)
                .andWhere('problem_set_is_enable', '=', true)
            if (data.length == 1) {
                let isMyProblemSet = false;
                let isSubscribe = false;
                if (data[0].personal_information_guid_fk == guid) {
                    isMyProblemSet = true;
                }
                let checkIsSubscribe = await this.knex
                    .select('')
                    .from('subscribe_question')
                    .where('personal_information_guid_fk', '=', guid)
                    .andWhere('problem_set_guid_fk', '=', problem_set_guid)
                    .andWhere('subscribe_question_is_enable', '=', true)
                    .first();
                if (checkIsSubscribe) {
                    isSubscribe = true;
                }

                let response = {
                    data: {
                        isMyProblemSet: isMyProblemSet,
                        isSubscribe: isSubscribe,
                        questionListCount: questionListCount[0].count,
                        data: data[0],
                    },
                    status: 1,
                    message: ""
                };
                return response;
            } else {
                let response = {
                    status: 0,
                    message: "This account does not exist."
                };
                return response;
            }


        }
        catch (error) {
            console.error(error)
            let response = {
                status: 0,
                message: "Error."
            };
            return response
        }
    }

    async questionListWithAll(guid, problemSetGuid) {
        console.log('ProblemSetService: questionListWithAll');
        try {
            guid = String(guid);
            problemSetGuid = String(problemSetGuid);

            let data = await this.knex('personal_information')
                .join('problem_set',
                    'problem_set.personal_information_id_fk',
                    '=',
                    'personal_information.personal_information_id')
                .join('question_list',
                    'question_list.problem_set_id_fk',
                    '=',
                    'problem_set.problem_set_id')
                .join('question_type',
                    'question_type.question_type_id',
                    '=',
                    'question_list.question_type_id_fk')
                .select('problem_set.problem_set_guid',
                    'question_list.question_list_guid',
                    'question_type.question_type_name',
                    'question_list.question_list_choice',
                    'question_list.question_list_question',
                    'question_list.question_list_answer')
                .where('problem_set.problem_set_guid', '=', problemSetGuid)

            console.table(data);

            let response = {
                data: data,
                status: 1,
                message: "Successfully obtained data."
            };
            return response;
        }
        catch (error) {
            console.error(error)
            let response = {
                status: 0,
                message: "Error."
            };
            return response
        }
    }

    async questionListWithRandom(guid, problemSetGuid, setProblemNumber) {
        console.log('ProblemSetService: questionListWithRandom');
        try {
            guid = String(guid);
            problemSetGuid = String(problemSetGuid);
            setProblemNumber = Number(setProblemNumber);

            let data = await this.knex('personal_information')
                .join('problem_set',
                    'problem_set.personal_information_id_fk',
                    '=',
                    'personal_information.personal_information_id')
                .join('question_list',
                    'question_list.problem_set_id_fk',
                    '=',
                    'problem_set.problem_set_id')
                .join('question_type',
                    'question_type.question_type_id',
                    '=',
                    'question_list.question_type_id_fk')
                .select('problem_set.problem_set_guid',
                    'question_list.question_list_guid',
                    'question_type.question_type_name',
                    'question_list.question_list_choice',
                    'question_list.question_list_question',
                    'question_list.question_list_answer')
                .where('problem_set.problem_set_guid', '=', problemSetGuid)

            data = script.randomDataListFromDataList(data, setProblemNumber)
            let response = {
                data: data,
                status: 1,
                message: "Successfully obtained data."
            };
            return response;
        }
        catch (error) {
            console.error(error)
            let response = {
                status: 0,
                message: "Error."
            };
            return response
        }
    }

    async createProblem(guid, problemSetName, problemSetDescription, question) {
        console.log('ProblemSetService: createProblem');
        try {
            guid = String(guid);
            problemSetName = String(problemSetName);
            problemSetDescription = String(problemSetDescription);
            question = question;
            let problemSetNewGuid = cryptoUtils.generateGUID();

            let userID = await this.knex('personal_information')
                .select('personal_information_id')
                .where('personal_information_guid', '=', guid)
                .first();

            let questionTypeID = await this.knex('question_type')
                .select('question_type_id', 'question_type_guid')
                .where('question_type_name', '=', 'Multiple Choice')
                .first();

            await this.knex.transaction(async (trx) => {

                let problemSetID = await trx('problem_set')
                    .returning(['problem_set_id', 'problem_set_guid'])
                    .insert({
                        problem_set_guid: problemSetNewGuid,
                        problem_set_name: problemSetName,
                        problem_set_description: problemSetDescription,
                        problem_set_is_enable: true,
                        personal_information_id_fk: userID.personal_information_id,
                        personal_information_guid_fk: guid
                    });

                for (let i = 0; i < question.length; i++) {
                    await trx('question_list')
                        .insert({
                            question_list_guid: cryptoUtils.generateGUID(),
                            question_list_choice: script.createChoicesJSON(question[i].questionListChoice),
                            question_list_question: question[i].questionListQuestion,
                            question_list_answer: question[i].questionListAnswer,
                            problem_set_id_fk: problemSetID[0].problem_set_id,
                            problem_set_guid_fk: problemSetID[0].problem_set_guid,
                            question_type_id_fk: questionTypeID.question_type_id,
                            question_type_guid_fk: questionTypeID.question_type_guid
                        })
                }
            });

            let response = {
                data: problemSetNewGuid,
                status: 1,
                message: "The problem set has been successfully created."
            };
            return response
        } catch (error) {
            console.error(error)
            let response = {
                status: 0,
                message: "Error."
            };
            return response
        }
    }

    async subscribeProblemSet(guid, problemSetGuid) {
        console.log('ProblemSetService: subscribeProblemSet');
        try {
            guid = String(guid);
            problemSetGuid = String(problemSetGuid);
            let data = await this.knex('subscribe_question')
                .select('*')
                .where('problem_set_guid_fk', '=', problemSetGuid)
                .andWhere('personal_information_guid_fk', '=', guid)
                .first();

            if (data) {
                await this.knex('subscribe_question')
                    .select('*')
                    .where('problem_set_guid_fk', '=', problemSetGuid)
                    .andWhere('personal_information_guid_fk', '=', guid)
                    .first()
                    .update(
                        {
                            subscribe_question_is_enable: true
                        }
                    )
            } else {
                await this.knex.transaction(async (trx) => {
                    let problemSetData = await trx('problem_set')
                        .select('*')
                        .where('problem_set_guid', '=', problemSetGuid)
                        .first();
                    if (problemSetData) {
                        let SubscribeNewGuid = cryptoUtils.generateGUID();
                        let userData = await trx('personal_information')
                            .select('*')
                            .where('personal_information_guid', '=', guid)
                            .first();
                        await trx('subscribe_question')
                            .insert(
                                {
                                    subscribe_question_guid: SubscribeNewGuid,
                                    subscribe_question_is_enable: true,
                                    personal_information_id_fk: userData.personal_information_id,
                                    personal_information_guid_fk: userData.personal_information_guid,
                                    problem_set_id_fk: problemSetData.problem_set_id,
                                    problem_set_guid_fk: problemSetData.problem_set_guid
                                }
                            )
                    } else {
                        let response = {
                            status: 0,
                            message: "There is no such problem set."
                        };
                        return response
                    }

                });
            }

            let response = {
                data: "",
                status: 1,
                message: "Successful Subscription."
            };
            return response
        } catch (error) {
            console.error(error)
            let response = {
                status: 0,
                message: "Error."
            };
            return response
        }
    }

    async unsubscribeProblemSet(guid, problemSetGuid) {
        console.log('ProblemSetService: unsubscribeProblemSet');
        try {
            guid = String(guid);
            problemSetGuid = String(problemSetGuid);

            let data = await this.knex('subscribe_question')
                .select('*')
                .where('problem_set_guid_fk', '=', problemSetGuid)
                .andWhere('personal_information_guid_fk', '=', guid)
                .first();
            if (data) {
                await this.knex('subscribe_question')
                    .select('*')
                    .where('problem_set_guid_fk', '=', problemSetGuid)
                    .andWhere('personal_information_guid_fk', '=', guid)
                    .first()
                    .update(
                        {
                            subscribe_question_is_enable: false
                        }
                    )
            } else {
                let response = {
                    status: 0,
                    message: "There is no such problem set."
                };
                return response
            }


            let response = {
                data: "",
                status: 1,
                message: "Subscription successfully canceled."
            };
            return response
        } catch (error) {
            console.error(error)
            let response = {
                status: 0,
                message: "Error."
            };
            return response
        }
    }

    async submitAnswer(guid, problemSetGuid, answerList) {
        console.log('ProblemSetService: submitAnswer');
        try {
            guid = String(guid);
            problemSetGuid = String(problemSetGuid);

            let data = [];
            await this.knex.transaction(async (trx) => {

                let subscribeItem = await trx('subscribe_question')
                    .select('*')
                    .where('personal_information_guid_fk', '=', guid)
                    .andWhere('problem_set_guid_fk', '=', problemSetGuid)
                    .first()

                let questionList;
                if (subscribeItem && subscribeItem.subscribe_question_is_enable) {
                    questionList = await trx('question_list')
                        .join(
                            'problem_set',
                            'problem_set.problem_set_guid',
                            'question_list.problem_set_guid_fk'
                        )
                        .select('*')
                        .where('question_list.problem_set_guid_fk', '=', problemSetGuid)
                }

                let subscribeQuestionAnalysisList;
                if (questionList) {
                    subscribeQuestionAnalysisList = await trx('subscribe_question_analysis')
                        .select('*')
                        .where('subscribe_question_id_fk', '=', subscribeItem.subscribe_question_id)
                }
                let checkSubscribeQuestionAnalysisList = false;
                if (subscribeQuestionAnalysisList.length === 0) {
                    for (let i = 0; i < questionList.length; i++) {
                        await trx('subscribe_question_analysis')
                            .insert({
                                subscribe_question_analysis_guid: cryptoUtils.generateGUID(),
                                subscribe_question_analysis_total_answer_count: 0,
                                subscribe_question_analysis_correct_answer_count: 0,
                                question_list_id_fk: questionList[i].question_list_id,
                                question_list_guid_fk: questionList[i].question_list_guid,
                                subscribe_question_id_fk: subscribeItem.subscribe_question_id,
                                subscribe_question_guid_fk: subscribeItem.subscribe_question_guid
                            })
                    }
                    checkSubscribeQuestionAnalysisList = true;
                } {
                    checkSubscribeQuestionAnalysisList = true;
                }

                if (checkSubscribeQuestionAnalysisList === true) {
                    for (let i = 0; i < questionList.length; i++) {
                        for (let j = 0; j < answerList.length; j++) {
                            if (questionList[i].question_list_guid
                                === answerList[j].questionListGuid) {
                                if (
                                    questionList[i].question_list_answer
                                    === answerList[j].answer) {
                                    answerList[j].correct = true;
                                }

                                if (answerList[j].correct === true) {
                                    await trx('subscribe_question_analysis')
                                        .select('*')
                                        .where('subscribe_question_id_fk', '=', subscribeItem.subscribe_question_id)
                                        .andWhere('question_list_id_fk', '=', questionList[i].question_list_id)
                                        .first()
                                        .increment({
                                            'subscribe_question_analysis_total_answer_count': 1, 'subscribe_question_analysis_correct_answer_count': 1
                                        })
                                } else if (answerList[j].correct === false) {
                                    await trx('subscribe_question_analysis')
                                        .select('*')
                                        .where('subscribe_question_id_fk', '=', subscribeItem.subscribe_question_id)
                                        .andWhere('question_list_id_fk', '=', questionList[i].question_list_id)
                                        .first()
                                        .increment('subscribe_question_analysis_total_answer_count', 1)
                                }
                                let answerResult = {
                                    problemSetGuid: questionList[i].problem_set_guid,
                                    questionListGuid: questionList[i].question_list_guid,
                                    number: i + 1,
                                    question: questionList[i].question_list_question,
                                    answer: questionList[i].question_list_answer,
                                    userAnswer: answerList[j].answer,
                                    correct: answerList[j].correct,
                                    accuracy: null,
                                    TotalAnswerCount: null,
                                    CorrectAnswerCount: null
                                }
                                data.push(answerResult);
                                break;
                            }
                        }
                    }
                    subscribeQuestionAnalysisList = await trx('subscribe_question_analysis')
                        .select('*')
                        .where('subscribe_question_id_fk', '=', subscribeItem.subscribe_question_id);

                    if (subscribeQuestionAnalysisList) {
                        for (let i = 0; i < subscribeQuestionAnalysisList.length; i++) {
                            for (let j = 0; j < data.length; j++) {
                                if (subscribeQuestionAnalysisList[i].question_list_guid_fk === data[j].questionListGuid) {
                                    data[j].accuracy = ((subscribeQuestionAnalysisList[i].subscribe_question_analysis_correct_answer_count / subscribeQuestionAnalysisList[i].subscribe_question_analysis_total_answer_count) * 100).toFixed(2);
                                    data[j].TotalAnswerCount = subscribeQuestionAnalysisList[i].subscribe_question_analysis_total_answer_count;
                                    data[j].CorrectAnswerCount = subscribeQuestionAnalysisList[i].subscribe_question_analysis_correct_answer_count;
                                    break;
                                }
                            }
                        }
                    }
                }

            });
            if (data) {
                let response = {
                    data: data,
                    status: 1,
                    message: "Check successful."
                };
                return response
            } else {
                let response = {
                    status: 0,
                    message: "There is no result."
                };
                return response
            }
        } catch (error) {
            console.error(error)
            let response = {
                status: 0,
                message: "Error."
            };
            return response
        }
    }

    async recordPage(guid, problemSetGuid) {
        console.log('ProblemSetService: recordPage');
        try {
            guid = String(guid);
            problemSetGuid = String(problemSetGuid);

            let subscribeQuestion = await this.knex('subscribe_question')
                .where('personal_information_guid_fk', '=', guid)
                .andWhere('problem_set_guid_fk', '=', problemSetGuid)
            if (subscribeQuestion.length > 0) {
                let tempData = await this.knex('question_list')
                    .join(
                        'subscribe_question_analysis',
                        'subscribe_question_analysis.question_list_id_fk',
                        '=',
                        'question_list.question_list_id'
                    )
                    .select(
                        'question_list.question_list_question',
                        'question_list.question_list_answer',
                        'subscribe_question_analysis.subscribe_question_analysis_total_answer_count',
                        'subscribe_question_analysis.subscribe_question_analysis_correct_answer_count'
                    )
                    .where('subscribe_question_analysis.subscribe_question_guid_fk', '=', subscribeQuestion[0].subscribe_question_guid)

                if (tempData.length > 0) {
                    let data=[];
                    for(let i=0;i<tempData.length;i++){
                        let obj={
                            question:tempData[i].question_list_question,
                            answer:tempData[i].question_list_answer,
                            totalAnswerCount:tempData[i].subscribe_question_analysis_total_answer_count,
                            correctAnswerCount:tempData[i].subscribe_question_analysis_correct_answer_count,
                            accuracy:(tempData[i].subscribe_question_analysis_correct_answer_count/tempData[i].subscribe_question_analysis_total_answer_count*100).toFixed(2)
                        }
                        data.push(obj);
                    };

                    let response = {
                        data: data,
                        status: 1,
                        message: "Successfully obtained the record."
                    };
                    return response
                } else {
                    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
                    await delay(3000);
                    let response = {
                        status: 0,
                        message: "No record."
                    };
                    return response;
                }
            }



        } catch (error) {
            console.error(error)
            let response = {
                status: 0,
                message: "Error."
            };
            return response
        }
    }
}
module.exports = ProblemSetService;