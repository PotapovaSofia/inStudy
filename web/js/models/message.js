var app = app || {};
var Message = Backbone.Model.extend({

  defaults: {
    id: null,
    author: null,
    text: null,
    add_time: null,
    anonymous: 'False',
  },
});