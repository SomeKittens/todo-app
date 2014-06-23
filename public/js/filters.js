'use strict';

/**
 * Simple filters for the todo items
 */

angular.module('TodoApp')
.filter('tags', function() {
  return function(items, filterBy) {
    if (!filterBy) { return items; }
    filterBy = filterBy.split(',').map(function(str) { return str.toLowerCase().trim(); }).filter(Boolean);
    var results = [];

    // Extra step required for working with Firebase data
    // http://stackoverflow.com/a/22152828/1216976
    var itemIndexes = items.$getIndex();
    itemIndexes.forEach(function(itemIndex) {
      var item = items[itemIndex];
      for (var i = 0; i < item.tags.length; i++) {
        if (filterBy.indexOf(item.tags[i]) > -1) {
          return results.push(item);
        }
      }
    });
    
    return results;
  };
})
.filter('titles', function() {
  return function(items, filterBy) {
    if (!filterBy) { return items; }
    filterBy = filterBy.toLowerCase();
    
    var results = [];

    var itemIndexes = items.$getIndex();
    itemIndexes.forEach(function(itemIndex) {
      var item = items[itemIndex];
      if (item.title.toLowerCase().indexOf(filterBy) > -1) {
        return results.push(item);
      }
    });
    
    return results;
  };
})
.filter('priority', function() {
  return function(items, filterBy) {
    if (!filterBy) { return items; }
    
    var results = [];
    
    var itemIndexes = items.$getIndex();
    itemIndexes.forEach(function(itemIndex) {
      var item = items[itemIndex];
      if (item.priority === filterBy) {
        return results.push(item);
      }
    });
    
    return results;
  };
});