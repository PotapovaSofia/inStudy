var app = app || {};
var EventsAddedView = Backbone.View.extend({
 
    el: '#add_course__positioner',

    render_el: '#add_event__container',

    template: _.template( $('#event_added-template').html() ),

    collection: new EventList(),

    initialize:function( options ){
        //this.listenTo( this.collection, 'add', this.renderEvent );
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
      //var view = new EventAddedView({ model: item });
      //this.$(this.render_el).append(view.render().el);
      if (item.attributes.is_periodic == true) {
            item.attributes.day_of_week_name = this.redefineDayOfWeek(item.attributes.day_of_week);
        } else {
            item.attributes.oneoff_date_name = this.getDateName(item.attributes.oneoff_date);
        }
      this.$(this.render_el).append(this.template( item.attributes ));
      return this;
    },
 
    events:{
        'click #add_event__button' : function(source) {
            $('#add_event--hidden').show(100);
            $('#add_event--shown').hide();
        },
        'submit #add_event__form' : function(source) {
            source.preventDefault();
            $('#add_event--hidden').hide();
            $('#add_event--shown').show(100);
            var time = $('#add_course--event__time').val();
            var time_valid = time.split(" ").join('');
            var duration = $('#add_course--event__duration').val();
            var location = $('#add_course--event__location').val();
            var is_periodic = $('#add_course--event__is_periodic').val();
            var is_odd = $('#add_course--event__is_odd').val();
            var day_of_week = $('#add_course--event__day_of_week').val();
            var oneoff_date = $('#add_course--event__oneoff_date').val();
            var new_event = new Event({
                    time: time_valid,
                    duration: duration,
                    location: location,
                });
            if ($('#add_course--event__is_periodic').prop("checked") == true) {
                new_event.attributes.day_of_week = day_of_week;
                new_event.attributes.is_periodic = "True";
                new_event.attributes.is_odd = is_odd;
            } else {
                new_event.attributes.is_periodic = 'False';
                new_event.attributes.oneoff_date = oneoff_date;
            }
            var cid = this.model.id;
            new_event.save({}, {
                url: "http://instudy.io/api/courses/" + cid + "/events/",
                async:false,
                success:function (model, response) {
                    //this.collection.add(new_event);        
                    this.renderEvent(new_event);
                },
                error: function(model, response) {
                    Backbone.history.navigate("#error", {trigger: true});
                },
              });
            
            //this.$(this.render_el).append(this.template( new_event.attributes ));
            $("#add_event__form").trigger('reset');
        },
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