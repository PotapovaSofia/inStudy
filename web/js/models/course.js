var app = app || {};
var Course = Backbone.Model.extend({
  /*
  select: function(){
    this.set({selected: true});
    this.collection.selectPost(this);
  }
  */
  urlRoot: 'http://instudy.io/api/courses/my/',

  defaults: {
      //id: 'None',
      pk: null,
      name: 'No title',
      course_type: null,
      wall_id: null,
      room_id: null,
      owners: {},
      university: null,
      start_date: null,
      end_date: null,
      start_date_name: null,
      end_date_name: null,
      is_private: null,
      events: {},
      registered_teachers: {},
      unregistered_teachers: null,
      description: null,
  },
  /*
  toggle: function() {
    this.save({
      course_id: !this.get('course_id'),  
      title: !this.get('title'),
      type: !this.get('type'),
      teacher: !this.get('teacher'),
      classroom: !this.get('classroom'),
      begin: !this.get('begin'),
      end: !this.get('end'),
      timeFrom: !this.get('timeFrom'),
      timeTo: !this.get('timeTo'),
      repeat: !this.get('repeat'),
      day: !this.get('day'),
      registered: !this.get('registered')
    });
  }
  */
});