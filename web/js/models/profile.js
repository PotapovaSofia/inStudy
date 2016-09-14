var app = app || {};
var Profile = Backbone.Model.extend({

  defaults: {
    id: null,
    first_name: null,
    last_name: null,
    middle_name: null,
    email: null,
    avatar_64: null,
    avatar_128: null,    
    student_in_groups: {},
    teacher_at_universities: {},
    staff_at_universities: {}
  },
  
  urlRoot: 'http://instudy.io/api/profile/me',
});