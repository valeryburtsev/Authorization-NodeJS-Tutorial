const express = require('express');
const router = express.Router();
const forceAuth = require('../middleware/forceAuth')

router.get('/', function(req, res, next) {
  res.json({auth:req.user ? 'yes' : 'no'})
});

router.get('/secret', forceAuth, function(req, res, next) {
  res.json({auth:req.user ? 'yes' : 'no'})
});

module.exports = router;
