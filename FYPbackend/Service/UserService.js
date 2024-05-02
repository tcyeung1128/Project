const cryptoUtils = require('../utility/cryptoUtils');
const script = require('../utility/script')
const jwt = require('jsonwebtoken');

class UserService {
    constructor(knex) {
        this.knex = knex;
    }

    async createAccount(account, password, permission) {
        console.log('UserService: createAccount')
        try {
            if(!script.validateString(password)){
                let response = {
                    message: "The password must contain at least one letter and one number, with a minimum length of 8 characters.",
                    status: 0
                };
                return response
            };

            let checkAccountDuplicate =
                await this.knex
                    .select('*')
                    .from('personal_information')
                    .where('personal_account', '=', account);

            if (checkAccountDuplicate.length === 0) {
                let permissionNameData =
                    await this.knex
                        .select('*')
                        .from('permission_name')
                        .where('permission_name', '=', permission);

                let response;
                let data = await this.knex
                    ('personal_information')
                    .insert({
                        personal_information_guid: cryptoUtils.generateGUID(),
                        personal_account: account,
                        personal_password: cryptoUtils.hashPassword(password),
                        secret_key: cryptoUtils.generateSecretKey(),
                        failed_attempts:0,
                        permission_name_id_fk: permissionNameData[0].permission_name_id,
                        permission_name_guid_fk: permissionNameData[0].permission_name_guid
                    })
                    .then((data) => {
                        response = {
                            status: 1,
                            message: "Account successfully created.."
                        };
                    })
                if (response.status === 1) {
                    return response
                } else {
                    let response = {
                        status: 0,
                        message: "Error."
                    };
                    return response
                }
            } else {
                let response = {
                    status: 0,
                    message: "Account already exists."
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

    async modifyAccount(guid, oldPassword, newPassword) {
        console.log('UserService: modifyAccount')
        try {
            if(!script.validateString(newPassword)){
                let response = {
                    message: "The password must contain at least one letter and one number, with a minimum length of 8 characters.",
                    status: 0
                };
                return response
            };
            let checkAccountDuplicate =
                await this.knex
                    .select('*')
                    .from('personal_information')
                    .where('personal_information_guid', '=', guid)
                    .andWhere('personal_password', '=', cryptoUtils.hashPassword(oldPassword));
            let newHashPassword = cryptoUtils.hashPassword(newPassword);
            if (checkAccountDuplicate.length === 1) {
                let data = await this.knex
                    ('personal_information')
                    .select('*')
                    .where('personal_information_guid', '=', guid)
                    .first()
                    .update({
                        personal_password: newHashPassword
                    })
                    .then(() => {
                        return true;
                    })
                    .catch((error) => {
                        console.error(error)
                        return false;
                    })
                if (data) {
                    let account = await this.knex
                        .select('*')
                        .from('personal_information')
                        .where('personal_information_guid', '=', guid)
                        .andWhere('personal_password', '=', newHashPassword);
                    if (account.length == 1) {
                        await this.knex('personal_information')
                            .select('*')
                            .where('personal_information_guid', '=', guid)
                            .update({
                                last_login: new Date(),
                                secret_key: cryptoUtils.generateSecretKey()
                            })

                        let newData = await this.knex
                            .select('*')
                            .from('personal_information')
                            .where('personal_information_guid', '=', guid)

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
                            message: "Password successfully changed.",
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
            } else {
                let response = {
                    status: 0,
                    message: "Password incorrect."
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
module.exports = UserService;