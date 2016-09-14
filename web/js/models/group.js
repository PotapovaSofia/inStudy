var app = app || {};
var Group = Backbone.Model.extend({

  defaults: {
      id: null,
      add: null,
      //university: null,
  },
  urlRoot: 'http://instudy.io/api/courses/my/',
});