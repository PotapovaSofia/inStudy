var app = app || {};
var MessageView = Backbone.View.extend({
    tagName:'li',

    template: _.template( $('#message-template').html() ),

    initialize:function( options ){
    },

    render:function( route ){
    	//alert(JSON.stringify(this.model)["course_id"]);
        this.$el.html( this.template( this.model.attributes ) );
        
        return this;
    }
});
