'use strict';

var express = require('express')
  , v = require('./validation')
  , config = require('../config')
  , MongoClient = require('mongodb').MongoClient
  , unirest = require('unirest');
  
var router = express.Router();

// Home page
router.get('/', v.isUser, function(req, res) {
  res.render('index', {
    fburl: req.user._id,
    phone: req.user.phone
  });
});

// Adding/updating phone number
router.put('/profile', v.isUser, function(req, res) {
  MongoClient.connect(config.mongo, function(err, db) {
    if (err) { return res.send(500, err); }

    db.collection('users').update({fbid: req.user.fbid}, {$set: {phone: req.body.phone}}, function(err) {
      if (err) { return res.send(500, err); }
      
      return res.send(200);
    });
  });
});

// Send text on task completion
router.post('/text', v.isUser, function(req, res) {
  if (!req.user.phone) { return res.send(412); }
  var message = 'Congradulations on completing ' + req.body.title;
  
  // Twilio limits us to 160 characters
  if (message.length > 160) {
    message = message.substring(0, 158) + '...';
  }
  
  unirest.post('https://twilio.p.mashape.com/' + config.twilio.sid + '/SMS/Messages.json')
    .headers({
      'X-Mashape-Authorization': config.mashape.authorization
    })
    .auth({
      username: config.twilio.sid,
      password: config.twilio.authToken
    })
    .send({
      From: config.twilio.phone,
      To: req.user.phone,
      Body: message
    })
    .end(function() {
      res.send(200);
    });
});

module.exports = router;
