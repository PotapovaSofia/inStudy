var app = app || {};
var CourseListView = Backbone.View.extend({
 
    el: '#courses__positioner',

    now: new Date(),

    show_course_num: new Map(),

    click_add_course_cnt: new Map(),


    initialize:function( options ){
        //this.listenTo( this.collection, 'add', this.renderCourse );
        /*
        this.collection.fetch({
            url: "http://instudy.io/api/courses/my/?show_hidden=True&show_overdue=True",
            async:false,
            success: function(collection, response) {
            },
            error: function(collection, response) {
                alert("ERROR content");
            }
        });
*/
        //this.listenTo( this.collection, 'add', this.renderCourse);
        this.render();
    },
 
    render:function(){
        if (window.localStorage.getItem('inst_pr_teacher') === "false") {
            $( '#add_course--1' ).css("display", "none");
        }
        $( '#courses-content' ).html('');
        this.collection.each( function( item ) {
            var end_date = new Date(item.attributes.end_date.split("-"));
            if (item.attributes.is_hidden == false &&  end_date > this.now) {
                this.renderCourse( item );
            }
        }, this);
 
        return this;
    },
 
    renderCourse:function( item ) {
      item.attributes.start_date_name = this.getDateName(item.attributes.start_date);
      item.attributes.end_date_name = this.getDateName(item.attributes.end_date);
      var courseView = new CourseView({ model: item });
      this.ele = $ ('#courses-content');
      this.ele.append(courseView.render().el);
    },
 
    events:{
        'click #add__button' : 'showAddCourseMenu',
        'click .add_course__title' : 'showAddCourseLi',
        'click #add__ico--hidden': 'closeRightPopup',
        'click .arrow--orange' : 'showCourseInfo',
        'click a':function(source) {
            //var hrefRslt = source.target.getAttribute('href');
            var hrefRslt = source.currentTarget.href.split("#")[1];
            Backbone.history.navigate(hrefRslt, {trigger:true});
            return false;
        },
        'submit #add_courses--own__form': function( source ) {
            source.preventDefault();
            var nm = $('#add_course--own__name').val();
            var u_t = $('#add_course--own__teacher').val();
            var desc = $('#add_course--own__description').val();
            var c_t = $('#add_course--own__course_type').val();
            var s_d = $('#add_course--own__start_day').val();
            var e_d = $('#add_course--own__end_day').val();
            var new_course = new Course({
                name: nm, 
                unregistered_teachers: u_t,
                description: desc, 
                course_type: c_t, 
                start_date: s_d, 
                end_date: e_d,
                is_private: 'true',
            });
            var self = this;
            new_course.save({}, {
                async:false,
                success:function (model, response) {
                    self.collection.add(model);
                    self.renderCourse(model);
                    $('#add_course__container').hide();
                    $('#add_event__container').show();
                    $('#add_event--shown').show(300);
                    $("#add_courses--own__form").trigger('reset');
                    var events = new EventsAddedView({model: model.attributes});
                },
                error: function(model, response) {
                  Backbone.history.navigate("#error", {trigger: true});
                },
              });
        },
        'submit #add_courses--teacher__form': function( source ) {
            source.preventDefault();
            //var universities_view = new SelectUniversitiesView();
            var nm = $('#add_course--teacher__name').val();
            var desc = $('#add_course--teacher__description').val();
            var c_t = $('#add_course--teacher__course_type').val();
            var s_d = $('#add_course--teacher__start_day').val();
            var e_d = $('#add_course--teacher__end_day').val();
            var u = $('#add_course--teacher__university').val();
            
            var new_course = new Course({
                name: nm, 
                description: desc, 
                course_type: c_t, 
                start_date: s_d, 
                end_date: e_d,
                is_private: 'false',
                university: u,
                registered_teachers: [window.localStorage.getItem('inst_prfl_pk')],
                unregistered_teachers: 'заглушечка',
            });
            var self = this;
            new_course.save({}, {
                async:false,
                success:function (model, response) {
                    model.attributes.registered_teachers[0] = {
                        first_name: window.localStorage.getItem('inst_pr_fname'),
                        last_name: window.localStorage.getItem('inst_pr_lname'),
                        middle_name: window.localStorage.getItem('inst_pr_mname'),
                    }
                    $('#add_course__container').hide();
                    $('#add_event__container').show();
                    $('#add_event--shown').show(300);
                    self.renderCourse(model);
                    self.collection.add(model);
                    $("#add_courses--teacher__form").trigger('reset');
                    var events = new EventsAddedView({model: model.attributes});
                },
                error: function(model, response) {
                    Backbone.history.navigate("#error", {trigger: true});
                },
            });
            
        },
        'submit #add_courses--join__form': function( source ) {
            source.preventDefault();
            var id = $('#add_course--join__id').val();
            var s_w = $('#add_course--join__secret_word').val();
            var new_course = new Course({
                pk: id,
                subscribe: "true",
                secret_word: s_w
            });
            new_course.save({}, {
                url: "http://instudy.io/api/courses/" + id + "/subscription/",
                async:false,
                success:function (model, response) {
                    this.collection.add(model);
                    self.renderCourse(model);
                    $("#add_courses--join__form").trigger('reset');
                    $('#add_course__container').hide();
                },
                error: function(model, response) {
                  Backbone.history.navigate("#error", {trigger: true});
                },
              });
        },
        'click #add_course--join__university': function(e) {
            var u = $('#add_course--join__university').val();
            var uni = new University({id: u});
            var courses_view = new SelectStudentCoursesView({model: uni});
        },
        'click #show_hidden_courses' : function (source) {
            $("#show_hidden_courses").hide();
            $("#hide_hidden_courses").show();
            this.collection.each( function( item ) {
                if (item.attributes.is_hidden) {
                    this.renderCourse( item );
                }
            }, this);
        },
        'click #hide_hidden_courses' : function (source) {
            $("#hide_hidden_courses").hide();
            $("#show_hidden_courses").show();
            this.render();
        },
        'click #show_ended_courses' : function (source) {
            $("#show_ended_courses").hide();
            $("#hide_ended_courses").show();
            this.collection.each( function( item ) {
                var end_date = new Date(item.attributes.end_date.split("-"));
                if (end_date < this.now) {
                    this.renderCourse( item );
                }
            }, this);
        },
        'click #hide_ended_courses' : function (source) {
            $("#hide_ended_courses").hide();
            $("#show_ended_courses").show();
            this.render();
        },
    },

    showAddCourseMenu: function(source) {
        $('#add_course--event__oneoff_date').datepicker({dateFormat: 'yy-mm-dd',});
        $('#add_course--teacher__start_day').datepicker({dateFormat: 'yy-mm-dd',});
        $('#add_course--teacher__end_day').datepicker({dateFormat: 'yy-mm-dd',});
        $('#add_course--own__start_day').datepicker({dateFormat: 'yy-mm-dd',});
        $('#add_course--own__end_day').datepicker({dateFormat: 'yy-mm-dd',});
        $('#add_course--event__time').timepicki({show_meridian:false, max_hour_value:22, min_hour_value:7});
        this.$('#popup--right').animate({width: 'toggle'}, 300);
        var width = this.$("#courses-content").width();
        setTimeout(function(){
            this.$('#courses-content').css("width", "calc(84% - 400px)");
            this.$('#courses-content').css("transition-duration", "300ms");
        }, 100)
        this.$('#add_course__container').show(200);
        setTimeout( function() {
            this.$("#add__ico--shown").hide(100);
            this.$('#add__ico--hidden').css("transform", "rotate(45deg)");
            this.$('#add__ico--hidden').css("transition-duration", "200ms");
            this.$(".right_button").css("opacity","0");
            this.$("#add__button").css("background-color", "#fff2cc");
            this.$("#add__button").css("box-shadow", "0 0 0 #fff2cc");
        }, 100);
    },
    closeRightPopup: function(source) {
        this.$('#popup--right').animate({width: 'toggle'}, 300);
        this.$('#courses-content').css("width", "65%");
        this.$('#add_course--2__block').hide();
        this.click_add_course_cnt.clear();
        $('#add_event__container').hide();
        $('#add_event--shown').hide();
        this.$('.sign-up-form').show("fast");
        setTimeout(function(){
            this.$("#add__ico--shown").show(100);
            this.$('#add__ico--hidden').css("transform", "rotate(0deg)");
            this.$('#add__ico--hidden').css("transition-duration", "300ms");
            this.$(".right_button").css("opacity","1");
            this.$("#add__button").css("background-color", "#b00000");
            this.$("#add__button").css("box-shadow", "0 0 10px rgba(0, 0, 0, 0.4)");
        }, 100)
        this.$('#courses-content').css("transition-duration", "300ms");
    },
    showAddCourseLi: function(source) {
        var block = "#" + source.toElement.id + "__block";
        var count;
        if (this.click_add_course_cnt.get(source.toElement.id)) {
            count = this.click_add_course_cnt.get(source.toElement.id);
        } else {
            this.click_add_course_cnt.set(source.toElement.id, 0);
            count = 0;
        }
        if (count % 2 == 0) {
            this.$('.add_course__form').hide();
            if (source.toElement.id !== 'add_course--1') {
                var cnt1 = this.click_add_course_cnt.get('add_course--1');
                if (cnt1 % 2 == 1) {
                    this.click_add_course_cnt.set('add_course--1', cnt1 + 1);
                }
            }
            if (source.toElement.id !== 'add_course--2') {
                var cnt2 = this.click_add_course_cnt.get('add_course--2');
                if (cnt2 % 2 == 1) {
                    this.click_add_course_cnt.set('add_course--2', cnt2 + 1);
                }
            }
            if (source.toElement.id !== 'add_course--3') {
                var cnt3 = this.click_add_course_cnt.get('add_course--3');
                if (cnt3 % 2 == 1) {
                    this.click_add_course_cnt.set('add_course--3', cnt3 + 1);
                }
            }
            this.$(block).animate({width: 'toggle'}, 400);

            var universities_t_view = new SelectTeacherUniversitiesView();
            var universities_s_view = new SelectStudentUniversitiesView();

        } else {
            this.$(block).hide();
        }
        this.click_add_course_cnt.set(source.toElement.id, count + 1);
    },
    showCourseInfo: function(source) {
        block = "#show-" + source.toElement.id;
        var count;
        if (this.show_course_num.get(source.toElement.id)) {
            count = this.show_course_num.get(source.toElement.id);
        } else {
            this.show_course_num.set(source.toElement.id, 0);
            count = 0;
        }
        if (count % 2 == 0) {
            this.$(block).show("fast");
            this.$("#"+source.toElement.id).css("transform", "rotate(180deg)");
            this.$("#"+source.toElement.id).css("transition-duration", "200ms");
        } else {
            this.$(block).hide("fast");
            this.$("#"+source.toElement.id).css("transform", "rotate(0deg)");
            this.$("#"+source.toElement.id).css("transition-duration", "200ms");
        }
        this.show_course_num.set(source.toElement.id, count + 1);
    },
    getDateName: function(str) {
        var date = str.split("-");
        switch (date[1]) {
            case "01":
                return date[2] + " января " + date[0];
            case "02":
                return date[2] + " февраля " + date[0];
            case "03":
                return date[2] + " марта " + date[0];
            case "04":
                return date[2] + " апреля " + date[0];
            case "05":
                return date[2] + " мая " + date[0];
            case "06":
                return date[2] + " июня " + date[0];
            case "07":
                return date[2] + " июля " + date[0];
            case "08":
                return date[2] + " августа " + date[0];
            case "09":
                return date[2] + " сентября " + date[0];
            case "10":
                return date[2] + " октября " + date[0];
            case "11":
                return date[2] + " ноября " + date[0];
            case "12":
                return date[2] + " декабря " + date[0];
        }  
    },
});