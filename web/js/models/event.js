var app = app || {};
var Event = Backbone.Model.extend({
  defaults: {
      id: null,
      course_id: null,
      course_title: null,
      course_type: null,
      time: null,
      start_hour: null,
      start_minute: null,
      end_hour: null,
      end_minute: null,
      duration: null,
      location: null,
      is_periodic: null,
      day_of_week: null,
      day_of_week_name: null,
      is_odd: null,
      oneoff_date: null,
      oneoff_date_name: null,
      is_private: null,
  },
});