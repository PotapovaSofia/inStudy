var CourseList = Backbone.Collection.extend({

    model: Course,

    url: 'http://instudy.io/api/courses/my/?show_hidden=True&show_overdue=True',
  });
  
