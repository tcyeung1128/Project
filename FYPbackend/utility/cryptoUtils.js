const crypto = require('crypto');

exports.generateGUID = function () {
    return crypto.randomBytes(16).toString('hex');
}

exports.generateSecretKey = function () {
    let secretKey = crypto.randomBytes(32).toString('hex');
    return secretKey;
}

exports.hashPassword = function(password){
    let hashPassword = crypto.createHash('sha256');
    hashPassword = hashPassword.update(password);
    hashPassword = hashPassword.digest('hex');
    return hashPassword
}