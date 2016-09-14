var app = app || {};
var CourseCheckinView = Backbone.View.extend({
  
    el: '#course-checkin-content',

    tagName:'li',

    template: _.template( $('#checkin-template').html() ),

    initialize:function( options ){
        
        this.render();
    },

    render:function(){

        this.$el.html( this.template( this.model.attributes ) );
        return this;
    }

});