const bcrypt = require('bcryptjs');

const hashPwd = (plaintext) => {
    const password = bcrypt.hashSync(plaintext, 10)
    return password
}

const comparePwd = (plaintext, password) => {
    const pwdMatch = bcrypt.compareSync(plaintext, password)
    return pwdMatch
}

module.exports = {
    hashPwd,
    comparePwd
}