var app = app || {};
var Comment = Backbone.Model.extend({

  defaults: {
      id: null,
      author: null,
      text: null,
      add_time: null,
      add_date: null,
  },
});