var app = app || {};
var ScheduleView = Backbone.View.extend({
    el: '#schedule-content',
    startDate: new Date(),
    endDate: new Date(),

    initialize: function() {
        //this.listenTo(this.startDate, 'change', this.render);

        /*
        this.$('.week-picker').datepicker( {
            
        });
    
    //$('.week-picker .ui-datepicker-calendar tr').live('mousemove', function() { $(this).find('td a').addClass('ui-state-hover'); });
    //$('.week-picker .ui-datepicker-calendar tr').live('mouseleave', function() { $(this).find('td a').removeClass('ui-state-hover'); });
    */
        self.startDate = new Date();
        self.endDate = new Date();
        this.render();
        this.renderCalendar();
    },

    events: {
        'click #calendar__button': 'openCalendar',
    },


    render: function() {
        //this.$('#schedule-content').html('');
        this.$('#week__column--1').html('');
        this.$('#week__column--2').html('');
        this.$('#week__column--3').html('');
        this.$('#week__column--4').html('');
        this.$('#week__column--5').html('');
        this.$('#week__column--6').html('');
        this.$('#week__column--0').html('');
        this.model.each(function( item ) {
            if (item.attributes.is_hidden == false) {
                this.renderCourseCard( item );
            }
        }, this );
        return this;
    },

    renderCourseCard: function( item ) {
        var events = item.attributes.events;

        //var courseCardView = new CourseCardView({ model: item });
        var self = this;
        events.forEach(function( ev ) {
            console.log(ev.location);
            var time = ev.time.split(':');
            var start_date;
            var end_date;
            var day_of_week = 0;
            if (ev.is_periodic === false) {
                var tmp = ev.oneoff_date.split('-');
                start_date = new Date(parseInt(tmp[0]), parseInt(tmp[1]) - 1, parseInt(tmp[2]));
                end_date = new Date(parseInt(tmp[0]), parseInt(tmp[1]) - 1, parseInt(tmp[2]));
                day_of_week = start_date.getDay();
            } else {
                var tmp = item.attributes.start_date.split('-'); //year-month-day
                start_date = new Date(parseInt(tmp[0]), parseInt(tmp[1]) - 1, parseInt(tmp[2]));
                tmp = item.attributes.end_date.split('-');
                end_date = new Date(parseInt(tmp[0]), parseInt(tmp[1]) - 1, parseInt(tmp[2]));
                day_of_week = ev.day_of_week;
            }
            var course_event = new Event({
                course_id: item.attributes.id,
                course_name: item.attributes.name,
                start_hour: parseInt(time[0]),
                start_minute: parseInt(time[1]),
                end_hour: parseInt(time[0]) + (parseInt(time[1]) + parseInt(ev.duration)) / 60 | 0,
                end_minute: (parseInt(time[1]) + parseInt(ev.duration)) % 60 | 0,
                duration: ev.duration,
                location: ev.location,
                course_type: item.attributes.course_type,
                day_of_week: day_of_week,
                is_private: item.attributes.is_private,
                oneoff_date: ev.oneoff_date,
            });
            if (ev.is_periodic === false) {
                var day = self.startDate.getDay();
                var date = new Date(self.startDate.getFullYear(), self.startDate.getMonth(), self.startDate.getDate());
                var diff = date.getDate() - day + (day == 1 ? -6:1);
                var week_start = new Date(date.setDate(diff));
                //diff = self.startDate.getDate() + (7 - day) - (day == 7 ? -6:1);
                var week_end = new Date(date.setDate(diff + 6));
                //var weekStart = new Date(self.startDate.getDate(), self.startDate.getDate() - (7 + self.startDate.getDay() - 1) % 7);
                //var weekEnd = new Date(self.startDate.getDate() + (7 - self.startDate.getDay() - 1) % 7);
                if (week_start <= start_date && week_end >= end_date) {
                    var courseCardView = new CourseCardView({ model: course_event });
                    var address = "#week__column--" + course_event.attributes.day_of_week;
                    $(address).append( courseCardView.render().el );        
                }                
            } else {
                if (self.startDate >= start_date && self.endDate <= end_date) {
                    var courseCardView = new CourseCardView({ model: course_event });
                    var address = "#week__column--" + ev.day_of_week;
                    $(address).append( courseCardView.render().el );    
                }
            }
                        
        });
    },

    openCalendar: function(source) {
        $('.week-picker').show("slow");
        $('#background-wrapper').show();
        //this.renderCalendar();
    },

    renderCalendar: function(source) {
        var self = this;
        $(".week-picker").datepicker({
            showOtherMonths: true,
            selectOtherMonths: true,
            onSelect: function(dateText, inst) { 
                var date = $(this).datepicker('getDate');
                self.startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay());
                self.endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 6);
                var dateFormat = inst.settings.dateFormat || $.datepicker._defaults.dateFormat;
                $('#startDate').text($.datepicker.formatDate( dateFormat, self.startDate, inst.settings ));
                $('#endDate').text($.datepicker.formatDate( dateFormat, self.endDate, inst.settings ));
                
                window.setTimeout(function () {
                    $('.week-picker').find('.ui-datepicker-current-day a').addClass('ui-state-active')
                }, 1);
                self.render();
            },
            beforeShowDay: function(date) {
                var cssClass = '';
                if(date >= self.startDate && date <= self.endDate)
                    cssClass = 'ui-datepicker-current-day';
                return [true, cssClass];
            },
            onChangeMonthYear: function(year, month, inst) {
                window.setTimeout(function () {
                    $('.week-picker').find('.ui-datepicker-current-day a').addClass('ui-state-active')
                }, 1);
            },
        });
        //this.render();
        /*
        var header = document.createElement('div');
        header.className = "datepicker__header";
        var main = document.getElementsByClassName("week-picker");
        main[0].insertBefore(header, main[0].firstChild);
        */
    },    

});