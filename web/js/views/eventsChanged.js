var app = app || {};
var EventsChangedView = Backbone.View.extend({
 
    el: '.settings__positioner',

    render_el: '#setting_event__container',

    template: _.template( $('#event_setting-template').html() ),

    collection: new EventList(),

    initialize:function( options ){
        //this.collection.models = this.model.attributes.events;
        this.collection.reset();
        for (var i = 0; i < this.model.attributes.events.length; i++) {
            this.collection.add(this.model.attributes.events[i]);
        }

        this.listenTo( this.collection, 'add', this.renderEvent );
        this.listenTo( this.collection, 'remove', this.render );
        this.render();
    },
 
    render:function( route ){
        this.$(this.render_el).html('');
        this.collection.each( function( item ) {
          this.renderEvent( item );
        }, this);
        return this;
    },
 
    renderEvent:function( item ) {
        if (item.attributes.is_periodic == true) {
            item.attributes.day_of_week_name = this.redefineDayOfWeek(item.attributes.day_of_week);
        } else {
            item.attributes.oneoff_date_name = this.getDateName(item.attributes.oneoff_date);
        }

        $(this.render_el).append(this.template( item.attributes ));
        return this;
    },
 
    events:{
        'click #setting_event__button' : function(source) {
            //$('#setting_event__ico--2').show();
            $('#setting_event--hidden').show(200);
            $('#setting_event--shown').hide();
            $('.change--event--hidden').hide();            
            $('#setting_event__ico--2').css("transform", "rotate(45deg)");
            $('#setting_event__ico--2').css("transition-duration", "0ms");

        },
        'submit #setting_event__form' : function(source) {
            source.preventDefault();
            $('#setting_event--hidden').hide();
            $('#setting_event--shown').show(200);
            var time = $('#setting_course--event__time').val();
            var time_valid = time.split(" ").join('');
            var duration = $('#setting_course--event__duration').val();
            var location = $('#setting_course--event__location').val();
            var is_periodic = $('#setting_course--event__is_periodic').val();
            var is_odd = $('#setting_course--event__is_odd').val();
            var day_of_week = $('#setting_course--event__day_of_week').val();
            var oneoff_date = $('#setting_course--event__oneoff_date').val();
            var new_event = new Event({
                    time: time_valid,
                    duration: duration,
                    location: location,
                });
            if ($('#setting_course--event__is_periodic').prop("checked") == true) {
                new_event.attributes.day_of_week = day_of_week;
                new_event.attributes.is_periodic = "True";
                new_event.attributes.is_odd = is_odd;
            } else {
                new_event.attributes.is_periodic = 'False';
                new_event.attributes.oneoff_date = oneoff_date;
            }
            var cid = this.model.attributes.id;
            var self = this;
            new_event.save({}, {
                url: "http://instudy.io/api/courses/" + cid + "/events/",
                async:false,
                success:function (model, response) {
                    self.collection.add(model);
                    self.model.attributes.events.push(model);
                },
                error: function(model, response) {
                    Backbone.history.navigate("#error", {trigger: true});
                },
            });
           
            $("#setting_event__form").trigger('reset');
        },
        'click .add_event__delete' : function(source) {
            var event_id = source.toElement.id.split("--")[1];
            var cid = this.model.attributes.id;
            var event = new Event({id: event_id});
            var self = this;
            event.destroy({
                url: "http://instudy.io/api/courses/" + cid + "/events/" + event_id + "/",
                async:false,
                success:function (model, response) {
                    self.collection.remove(model);
                },
                error: function(model, response) {
                    Backbone.history.navigate("#error", {trigger: true});
                },
            });
        },
        'click .add_event__change' : function(source) {
            var event_id = source.toElement.id.split("--")[1];
            $("#change--event__time--" + event_id).timepicki({show_meridian:false, max_hour_value:22, min_hour_value:7});
            $("#change--event__oneoff_date--" + event_id).datepicker({dateFormat: 'yy-mm-dd',});
            $("#setting_event--shown").show();
            if (source.toElement.classList.length == 1) {
                $("#setting_event__change--" + event_id).hide();
                for (var i = 0; i < this.model.attributes.events.length; i++) {
                    $("#setting_event__change--" + this.model.attributes.events[i].id + "--red").hide();
                    if (this.model.attributes.events[i].id != event_id) {
                        $("#setting_event__change--" + this.model.attributes.events[i].id).show();
                        $('#change--event--' + this.model.attributes.events[i].id).hide();
                    }
                }
                $("#setting_event__change--" + event_id + "--red").show();
                var cid = this.model.attributes.id;
                var event;
                this.collection.each( function(item) {
                    if (item.attributes.id == event_id) {
                        event = item;
                    }
                }, this);
                $('#setting_event--hidden').hide(200);
                $('#change--event--'  + event_id).show(200);
                var time = event.attributes.time.split(":")[0] + " : " + event.attributes.time.split(":")[1];
                $("#change--event__time--" + event_id).attr("value", time);
                $("#change--event__duration--" + event_id).attr("value", event.attributes.duration);
                if (event.attributes.time == null) {
                    $("#change--event__location--" + event_id).attr("placeholder", "Аудитория");
                } else {
                    $("#change--event__location--" + event_id).attr("value", event.attributes.location);
                }
                if (event.attributes.is_periodic == true) {
                    $("#change--event__is_periodic--" + event_id).prop('checked', true);
                    $("#change--event__is_even--" + event_id).prop('disabled', false);
                    $("#change--event__is_even--" + event_id).show();
                    $("#change--event__is_odd--" + event_id).prop('disabled', false);
                    $("#change--event__is_odd--" + event_id).show();
                    $("#change--event__day_of_week--" + event_id).prop('disabled', false);
                    $("#change--event__day_of_week--" + event_id).show();
                    $("#change--event__oneoff_date--" + event_id).prop('disabled', true);
                    $("#change--event__oneoff_date--" + event_id).hide();
                }
                $("#change--event__day_of_week--" + event_id).val(event.attributes.is_odd);
                $("#change--event__day_of_week--" + event_id).val(event.attributes.day_of_week);
                $("#change--event__oneoff_date--" + event_id).attr("value", event.attributes.oneoff_date);
            } else {
                $("#setting_event__change--" + event_id + "--red").hide();
                $("#setting_event__change--" + event_id).show();
                $('#change--event--' + event_id).hide(200);
            }

        },
        'submit .change--event__form--settings': function(source) {
            source.preventDefault();
            var event_id = source.currentTarget.id.split("--")[2];
            var cid = this.model.attributes.id;
            $('.change--event__form--settings').hide();
            var attrs = {};
            if ($('#change--event__time--' + event_id).val() != "") {
                var time = $('#change--event__time--' + event_id).val();
                attrs.time = time.split(" ").join('');
            }
            if ($('#change--event__duration--' + event_id).val() != "") {
                attrs.duration = $('#change--event__duration--' + event_id).val();
            }
            if ($('#change--event__location--' + event_id).val() != "") {
                attrs.location = $('#change--event__location--' + event_id).val();
            }
            if ($('#change--event__is_periodic--' + event_id).prop("checked") == true) {
                attrs.is_periodic = 'True';
                attrs.is_odd = $('#change--event__is_odd--' + event_id).val();
                if ($('#change--event__day_of_week--' + event_id).val() != "") {
                    attrs.day_of_week = $('#change--event__day_of_week--' + event_id).val();
                }
            } else {
                attrs.is_periodic = 'False';
                if ($('#change--event__oneoff_date--' + event_id).val() != "") {
                    attrs.oneoff_date = $('#change--event__oneoff_date--' + event_id).val();
                }
            }
            /**
            if ($('#change--event__is_odd--' + event_id).prop("checked") == true) {
                attrs.is_odd = 'True';
            }
            if ($('#change--event__is_even--' + event_id).prop("checked") == true) {
                attrs.is_odd = 'False';
            }
            **/
            
            
            var changed_event = new Event({id: event_id});
            var self = this;
            changed_event.save(attrs, {
                url: "http://instudy.io/api/courses/" + cid + "/events/" + event_id + "/",
                patch: true,
                async:false,
                success:function (model, response) {
                    $("#change--event__form--" + event_id).trigger('reset');
                    self.collection.remove(model);
                    self.collection.add(model);
                    self.render();
                },
                error: function(model, response) {
                    Backbone.history.navigate("#error", {trigger: true});
                },
            });
           
            $("#setting_event__form").trigger('reset');
        },
        'click #setting_event__ico--2' : function (source) {
            $('#setting_event__ico--2').hide();
            $('#setting_event--hidden').hide(200);
            $('#setting_event--shown').show();
        }
    },
    redefineDayOfWeek: function(number) {
        var day;
        switch(number) {
            case 1:
                day = "Понедельник"
                break
            case 2:
                day = "Вторник"
                break
            case 3:
                day = "Среда"
                break
            case 4:
                day = "Четверг"
                break
            case 5:
                day = "Пятница"
                break
            case 6:
                day = "Суббота"
                break
            case 0:
                day = "Воскресенье"
                break            
        }
        return day;
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