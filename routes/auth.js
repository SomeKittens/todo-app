'use strict';

var express = require('express')
  , passport = require('passport')
  , v = require('./validation');

require('../passportConfig');

var router = express.Router();

router.get('/', v.isAnon, function(req, res) {
  res.render('auth');
});

router.get('/facebook', passport.authenticate('facebook'));

router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/auth'
}));

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/auth');
});


module.exports = router;
