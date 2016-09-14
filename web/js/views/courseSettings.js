var app = app || {};
var CourseSettingsView = Backbone.View.extend({
    el: ".settings__positioner",
  
    initialize:function( options ) {
        var has_rights = false;
        if (window.localStorage.getItem('inst_pr_teacher') == "true") {
            var pk = parseInt(window.localStorage.getItem('inst_prfl_pk'));
            this.model.attributes.registered_teachers.forEach( function(teacher) {
                if (pk == teacher.id) {
                    has_rights = true;
                }
            });
        }
        if (has_rights || this.model.attributes.is_private == true) {
            this.$('#course_delete__button').show();
            this.$('#course_settings--events').show();
            this.$('#course_settings--info').show();
        } else {
            if (this.model.attributes.is_hidden == true) {
                $('#course_unhide__button').show();
            } else {
                $('#course_hide__button').show();
            }
            $('#course_unfollow__button').show();
        }
        
        this.render(this.model);
    },

    render:function(model){
        $('#course_settings__start_day').datepicker({dateFormat: 'yy-mm-dd',});
        $('#course_settings__end_day').datepicker({dateFormat: 'yy-mm-dd',});
        $('#setting_course--event__oneoff_date').datepicker({dateFormat: 'yy-mm-dd',});

        $('#setting_course--event__time').timepicki({show_meridian:false, max_hour_value:22, min_hour_value:7});
        $("#course_settings__name").attr("value", model.attributes.name);
        $("#course_settings__teacher").attr("placeholder", "Преподаватель");
        if (model.attributes.description == null) {
            $("#course_settings__description").attr("placeholder", "Описание");
        } else {
            $("#course_settings__description").attr("value", model.attributes.description);
        }
        $("#course_settings__course_type").val(model.attributes.course_type);
        $("#course_settings__start_day").attr("value", model.attributes.start_date);
        $("#course_settings__end_day").attr("value", model.attributes.end_date);
        var eventsView = new EventsChangedView({model: this.model});
        return this;
    },

    events: {
        'submit #course_settings__form': function( source ) {
            source.preventDefault();
            var name = $('#course_settings__name').val();
            var unregistered_teachers = $('#course_settings__teacher').val();
            var description = $('#course_settings__description').val();
            var course_type = $('#course_settings__course_type').val();
            var start_date = $('#course_settings__start_day').val();
            var end_date = $('#course_settings__end_day').val();
            var id = this.model.attributes.id;
            var changed_course = new Course({ id: id });
            var attrs = {};
            if (name != "") {
                changed_course.attributes.name = name;
                attrs.name = name;
            }
            if (unregistered_teachers != "") {
                changed_course.attributes.unregistered_teachers = unregistered_teachers;
                attrs.unregistered_teachers = unregistered_teachers;
            }
            if (description != "") {
                changed_course.attributes.description = description;
                attrs.description = description;
            }
            if (course_type != "") {
                changed_course.attributes.course_type = course_type;
                attrs.course_type = course_type;
            }
            if (start_date != "") {
                changed_course.attributes.start_date = start_date;
                attrs.start_date = start_date;
            }
            if (end_date != "") {
                changed_course.attributes.name = end_date;
                attrs.end_date = end_date;
            }
            var self = this;
            changed_course.save(attrs, {
                url: 'http://instudy.io/api/courses/' + id + '/',
                patch: true,
                async:false,
                success:function (model, response) {
                    $("#course_settings__form").trigger('reset');
                    self.render(model);
                },
                error: function(model, response) {
                    $("#course_settings__error").show();                  
                },
            });
        },
        'click #course_delete__button' : function (source) {
            var id = this.model.attributes.id;
            var course = new Course({id: id});
            var self = this;
            course.destroy({
                url: "http://instudy.io/api/courses/" + id + "/",
                async:false,
                success:function (model, response) {
                    Backbone.history.navigate("#courses", {trigger:true});
                },
                error: function(model, response) {
                    alert('error in deleting course');
                    Backbone.history.navigate("#error", {trigger:true});
                },
            });
        },
        'click #course_hide__button' : function (source) {
            var id = this.model.attributes.id;
            var course = new Course({hide: 'True'});
            var self = this;
            course.save({hide: 'True'}, {
                url: "http://instudy.io/api/courses/" + id + "/hiding/",
                async:false,
                success:function (model, response) {
                    $('#course_unhide__button').show();
                    $('#course_hide__button').hide();

                },
                error: function(model, response) {
                    alert('error in hiding course');
                    Backbone.history.navigate("#error", {trigger:true});
                },
            });
        },
        'click #course_unhide__button' : function (source) {
            var id = this.model.attributes.id;
            var course = new Course({hide: 'False'});
            var self = this;
            course.save({hide: 'False'}, {
                url: "http://instudy.io/api/courses/" + id + "/hiding/",
                async:false,
                success:function (model, response) {
                    $('#course_unhide__button').hide();
                    $('#course_hide__button').show();
                },
                error: function(model, response) {
                    alert('error in hiding course');
                    Backbone.history.navigate("#error", {trigger:true});
                },
            });
        },
        'click #course_unfollow__button' : function (source) {
            var id = this.model.attributes.id;
            var course = new Course({subscribe: 'False'});
            var self = this;
            course.save({subscribe: 'False'}, {
                url: "http://instudy.io/api/courses/" + id + "/subscription/",
                async:false,
                success:function (model, response) {
                    Backbone.history.navigate("#courses", {trigger:true});
                },
                error: function(model, response) {
                    alert('error in unfollowing course');
                    Backbone.history.navigate("#error", {trigger:true});
                },
            });
        },
        
    }

});