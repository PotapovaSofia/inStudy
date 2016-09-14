var app = app || {};
var User = Backbone.Model.extend({

  defaults: {
      auth_token: null,
      email: null,
      password: null,
      //first_name: null,
      //last_name: null,
  },
  
  urlRoot: 'http://instudy.io/api/auth/login/',
/*
  toggle: function() {
    this.save({
      email: !this.get('email'),
      password: !this.get('password'),
    });
  }
  */
});