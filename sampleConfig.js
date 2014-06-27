'use strict';

var config = {
  facebook: {
    clientID: ,
    clientSecret: '',
    callbackURL: '/auth/facebook/callback'
  },
  twilio: {
    sid: '',
    authToken: '',
    phone: ''
  },
  mashape: {
    authorization: ''
  }
};

if (process.env.NODE_ENV === 'production') {
  config.mongo = process.env.MONGOHQ_URL;
  config.redis = {
    url: process.env.REDISCLOUD_URL
  };
} else {
  config.redis = {
    host: '127.0.0.1',
    port: 6379
  };

  config.mongo = 'mongodb://127.0.0.1:27017/mashape';
}

module.exports = config;