'use strict';

exports.isUser = function(req, res, next) {
  if (!req.user) {
    return res.redirect('/auth');
  }
  return next();
};

exports.isAnon = function(req, res, next) {
  if (req.user) {
    return res.redirect('/');
  }
  return next();
}