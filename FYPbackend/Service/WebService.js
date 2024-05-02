const cryptoUtils = require('../utility/cryptoUtils');
const script = require('../utility/script')

class WebService {
    constructor(knex) {
        this.knex = knex;
    }

    async latestUpdatedProblemSet(guid, page) {
        console.log('WebService: latestUpdatedProblemSet');
        try {
            guid = String(guid);
            page = Number(page);
            page = (page - 1);

            let dataInPage = 6;
            let maxItemCount = await this.knex('problem_set')
                .join('personal_information', 'personal_information.personal_information_id', 'problem_set.personal_information_id_fk')
                .where('problem_set.personal_information_guid_fk', '!=', guid)
                .whereNotIn('problem_set_id', function () {
                    this.select('problem_set_id')
                        .from('personal_information')
                        .join('subscribe_question', 'personal_information.personal_information_id', 'subscribe_question.personal_information_id_fk')
                        .join('problem_set', 'subscribe_question.problem_set_id_fk', 'problem_set.problem_set_id')
                        .where('problem_set.problem_set_is_enable', true)
                        .where('subscribe_question.subscribe_question_is_enable', true)
                        .andWhere('subscribe_question.personal_information_guid_fk', guid)
                })
                .count();

            if ((page * dataInPage) >= 0 && (page * dataInPage) <= maxItemCount[0].count) {
                let data = await this.knex('problem_set')
                    .select('*')
                    .join('personal_information', 'personal_information.personal_information_id', 'problem_set.personal_information_id_fk')
                    .where('problem_set.personal_information_guid_fk', '!=', guid)
                    .whereNotIn('problem_set_id', function () {
                        this.select('problem_set_id')
                            .from('personal_information')
                            .join('subscribe_question', 'personal_information.personal_information_id', 'subscribe_question.personal_information_id_fk')
                            .join('problem_set', 'subscribe_question.problem_set_id_fk', 'problem_set.problem_set_id')
                            .where('problem_set.problem_set_is_enable', true)
                            .where('subscribe_question.subscribe_question_is_enable', true)
                            .andWhere('subscribe_question.personal_information_guid_fk', guid)
                    })
                    .orderBy('problem_set.updated_at', 'desc')
                    .limit(dataInPage)
                    .offset(page * dataInPage)

                let response = {
                    data: data,
                    maxItemCount: maxItemCount[0].count,
                    maxPage: Math.ceil(maxItemCount[0].count / dataInPage),
                    status: 1,
                    message: "Successfully obtained data."
                };
                return response

            } else {
                let response = {
                    data: {},
                    maxItemCount: maxItemCount[0].count,
                    maxPage: Math.ceil(maxItemCount[0].count / dataInPage),
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

    async searchForSpecificProblemSet(guid, page, text) {
        console.log('WebService: searchForSpecificProblemSet');
        try {
            guid = String(guid);
            page = Number(page);
            text = String(text);
            page = (page - 1);

            let dataInPage = 6;
            let maxItemCount = await this.knex('problem_set')
                .join('personal_information', 'personal_information.personal_information_id', 'problem_set.personal_information_id_fk')
                .where('problem_set.personal_information_guid_fk', '!=', guid)
                .andWhere('problem_set.problem_set_name', 'like', '%' + text + '%')
                .whereNotIn('problem_set_id', function () {
                    this.select('problem_set_id')
                        .from('personal_information')
                        .join('subscribe_question', 'personal_information.personal_information_id', 'subscribe_question.personal_information_id_fk')
                        .join('problem_set', 'subscribe_question.problem_set_id_fk', 'problem_set.problem_set_id')
                        .where('problem_set.problem_set_is_enable', true)
                        .where('subscribe_question.subscribe_question_is_enable', true)
                        .andWhere('subscribe_question.personal_information_guid_fk', guid)
                })
                .count();

            if ((page * dataInPage) >= 0 && (page * dataInPage) <= maxItemCount[0].count) {
                let data = await this.knex('problem_set')
                    .select('*')
                    .join('personal_information', 'personal_information.personal_information_id', 'problem_set.personal_information_id_fk')
                    .where('problem_set.personal_information_guid_fk', '!=', guid)
                    .andWhere('problem_set.problem_set_name', 'like', '%' + text + '%')
                    .whereNotIn('problem_set_id', function () {
                        this.select('problem_set_id')
                            .from('personal_information')
                            .join('subscribe_question', 'personal_information.personal_information_id', 'subscribe_question.personal_information_id_fk')
                            .join('problem_set', 'subscribe_question.problem_set_id_fk', 'problem_set.problem_set_id')
                            .where('problem_set.problem_set_is_enable', true)
                            .where('subscribe_question.subscribe_question_is_enable', true)
                            .andWhere('subscribe_question.personal_information_guid_fk', guid)
                    })
                    .orderBy('problem_set.updated_at', 'desc')
                    .limit(dataInPage)
                    .offset(page * dataInPage)

                let response = {
                    data: data,
                    maxItemCount: maxItemCount[0].count,
                    maxPage: Math.ceil(maxItemCount[0].count / dataInPage),
                    status: 1,
                    message: "Successfully obtained data."
                };
                return response

            } else {
                let response = {
                    data: {},
                    maxItemCount: maxItemCount[0].count,
                    maxPage: Math.ceil(maxItemCount[0].count / dataInPage),
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
}
module.exports = WebService;