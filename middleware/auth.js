const authController = require('../controllers/auth')

module.exports = async function (req, res, next) {
    const token = req.cookies.auth_token || req.headers.authorization;

    const user = await authController.verifyToken(token)
    if(user) req.user = user
    next();
}