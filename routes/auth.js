var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const { Person } = require('../models');

router.post('/register', async function(req, res) {
    const {username, password} = req.body;

    if(!username || !password) return res.status(400).json({
        message: 'Request missing username or password parameters',
        error: "Bad Request"
      });

    const hash = bcrypt.hashSync(password, 10);

    try {
        const user = await Person.create({...req.body, password: hash})
        const data = await user.authorize();
        return res.json(data);
    
      } catch(err) {
        return res.status(400).json(err);
      }
});
router.post('/login', async function(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send(
          'Request missing username or password param'
        );
    }
    try {
        let user = await Person.authenticate(username, password)

        res.cookie('auth_token', user.authToken.token, {httpOnly:true})
        return res.json(user);
    
    } catch (err) {
        return res.status(400).send({ errors: [{ message: 'not authenticated', err:err }] });
    }
});

router.get('/logout', async (req, res) => {
    const { user, cookies: { auth_token: authToken } } = req
    if (user && authToken) {
      await req.user.logout(authToken);
      res.clearCookie("auth_token");
      return res.status(204).send()
    }
    return res.status(400).send('not authenticated');
});

router.get('/whoami', function(req, res){
    if (req.user) {
        return res.json(req.user);
    }
    res.status(401).send(
        { errors: [{ message: 'missing auth token' }] }
    );
})
module.exports = router;
