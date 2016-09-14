var app = app || {};
var University = Backbone.Model.extend({

  defaults: {
      id: null,
      name: null,
  },
  
  urlRoot: 'http://instudy.io/api/universities/',
});