var app = app || {};
var CourseNew = Backbone.Model.extend({

  defaults: {
      id: null,
      author: null,
      wall_id: null,
      course_id: null,
      title: null,
      text: null,
      author: new Profile(),
      comments_count: null,
      add_time: null,
      add_date: null,
      add_hour: null,
      add_minute: null,
      anonymous: false,
      attached_comment: new CommentList(),
      public: true,
      post_type: null,
  },
/*
  toggle: function() {
    this.save({
      new_id: !this.get('new_id'),  
      title: !this.get('title'),
      context: !this.get('context'),
      author: !this.get('author'),
      time: !this.get('time'),
      day: !this.get('day')
    });
  }
  */
});