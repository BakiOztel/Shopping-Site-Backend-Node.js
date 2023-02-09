const bcrypt = require("bcrypt");

exports.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    encrypt = await bcrypt.hash(password, salt);
    return encrypt;
}

exports.decryptPassword = async (password, hashPassword) => {
    return await bcrypt.compareSync(password, hashPassword);
}