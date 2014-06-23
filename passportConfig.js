'use strict';

var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy
  , MongoClient = require('mongodb').MongoClient
  , ObjectId = require('mongodb').ObjectID
  , config = require('./config');
  
passport.use(new FacebookStrategy(config.facebook,
  function(accessToken, refreshToken, profile, done) {
    MongoClient.connect(config.mongo, function(err, db) {
      if (err) { return done(err); }
      
      db.collection('users').find({fbid: profile.id}).toArray(function(err, dbProfile) {
        if (err) { return done(err); }
        
        if (dbProfile.length) {
          return done(null, dbProfile[0]);
        }
        db.collection('users').insert({
          fbid: profile.id,
          accessToken: accessToken
        }, function(err, inserted) {
          if (err) { return done(err); }

          return done(null, {
            fbid: profile.id,
            _id: inserted[0]._id,
            accessToken: accessToken
          });
        });
      });
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  MongoClient.connect(config.mongo, function(err, db) {
    if (err) { return done(err); }

    db.collection('users').find({ _id: ObjectId(id) }).toArray(function(err, profile) {
      if (err) { return done(err); }
      if (!profile.length) { return done('Could not find user'); }

      return done(null, profile[0]);
    });
  });
});