var app = app || {};
var CourseView = Backbone.View.extend({
    tagName:'li',

    template: _.template( $('#course-template').html() ),

    initialize:function( options ){
    },

    render:function( route ){
        this.$el.html( this.template( this.model.attributes ) );
        
        return this;
    }
});
