const jwt = require('jsonwebtoken');
const cryptoUtils = require('../utility/cryptoUtils');
const script = require('../utility/script')

class AuthorizationService {
    constructor(knex) {
        this.knex = knex;
    }

    async createToken(account, password) {
        console.log('AuthorizationService: createToken');
        try {
            account = String(account);
            password = String(cryptoUtils.hashPassword(password));
            let data = await this.knex
                .select('*')
                .from('personal_information')
                .where('personal_account', '=', account);
                
            let checkLoginFail = false;
            if (data.length == 1) {
                if (data[0].failed_attempts < 3) {
                    if (data[0].personal_password == password) {
                        checkLoginFail = true;
                    } else {
                        await this.knex
                            .select('*')
                            .from('personal_information')
                            .where('personal_account', '=', account)
                            .update({
                                failed_attempts: data[0].failed_attempts + 1,
                                last_login: new Date(),
                            })
                        let response = {
                            message: "Invalid password.",
                            status: 0
                        };
                        return response
                    }
                } else {
                    if (!script.isDateWithin5Minutes(data[0].last_login)) {
                        if (data[0].personal_password == password) {
                            checkLoginFail = true;
                        } else {
                            await this.knex
                                .select('*')
                                .from('personal_information')
                                .where('personal_account', '=', account)
                                .update({
                                    failed_attempts: 1,
                                    last_login: new Date(),
                                })
                            let response = {
                                message: "Invalid password.",
                                status: 0
                            };
                            return response
                        }
                    } else {
                        await this.knex
                                .select('*')
                                .from('personal_information')
                                .where('personal_account', '=', account)
                                .update({
                                    failed_attempts: data[0].failed_attempts + 1
                                })
                        let response = {
                            message: "Too many failed attempts. Please try again in 5 minutes.",
                            status: 0
                        };
                        return response
                    }
                }
            }
            if (data.length == 1 && data[0].personal_password == password && checkLoginFail) {
                await this.knex
                    .select('*')
                    .from('personal_information')
                    .where('personal_account', '=', account)
                    .andWhere('personal_password', '=', password)
                    .update({
                        failed_attempts: 0,
                        last_login: new Date(),
                        secret_key: cryptoUtils.generateSecretKey()
                    })

                let newData = await this.knex
                    .select('*')
                    .from('personal_information')
                    .where('personal_account', '=', account)
                    .andWhere('personal_password', '=', password);

                let payload = {
                    userGUID: newData[0].personal_information_guid,
                    lastLogin: newData[0].last_login
                }
                let verifySignature = {
                    secret_key: newData[0].secret_key,
                    last_login: newData[0].last_login = null ? newData[0].secret_key : newData[0].last_login
                }
                let token = jwt.sign(payload, String(verifySignature));
                let response = {
                    data: {
                        token: "Bearer " + token,
                        userGUID: newData[0].personal_information_guid,
                        lastLogin: newData[0].last_login
                    },
                    message: "Account login successful.",
                    status: 1
                }
                return response
            } else {
                let response = {
                    message: "This account does not exist.",
                    status: 0
                };
                return response
            }
        }
        catch (error) {
            console.error(error)
            let response = {
                message: "Error.",
                status: 0
            };
            return response
        }
    }

    async verifyToken(token) {
        console.log('AuthorizationService: verifyToken');
        try {
            let payload = jwt.decode(token.replace('Bearer ', ''));
            if (script.isDateWithin30Days(payload.lastLogin)) {
                let data = await this.knex
                    .select('*')
                    .from('personal_information')
                    .where('personal_information_guid', '=', payload.userGUID)
                if (data.length == 1) {
                    let verifySignature = {
                        secret_key: data[0].secret_key,
                        last_login: data[0].last_login
                    }
                    let verifyToken = jwt.verify(token.replace('Bearer ', ''), String(verifySignature));
                    let response = {
                        data: verifyToken,
                        status: 1,
                        message: "Verification successful."
                    };
                    return response;
                } else {
                    let response = {
                        status: -1,
                        message: "This account does not exist."
                    };
                    return response
                }
            } else {
                let response = {
                    status: -1,
                    message: "Token expired."
                };
                return response
            }
        } catch (error) {
            console.error(error)
            let response = {
                status: -1,
                message: "Error."
            };
            return response
        }
    }
}
module.exports = AuthorizationService;