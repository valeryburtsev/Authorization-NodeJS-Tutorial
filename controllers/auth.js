const db = require("../models");

module.exports.verifyToken = async function (token) {
    return new Promise(async (resolve) => {

        if (token) {
            const authToken = await db.AuthToken.findOne(
                { where: { token }, include: db.Person }
            );
            if (authToken) {
                resolve(authToken.Person);
            }
            resolve(null)
        }
        resolve(null)
    })
}