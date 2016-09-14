var app = app || {};
var CommentView = Backbone.View.extend({
    
    tagName:'div',

    now: new Date(),

    template: _.template( $('#comment-template').html() ),

    initialize:function( options ){
    },

    render:function( route ){
    	var add_time = new Date(this.model.attributes.add_time);
    	if (this.now.getYear() === add_time.getYear() && this.now.getMonth() === add_time.getMonth() && 
    		this.now.getDate() === add_time.getDate()) {
    			this.model.attributes.add_date = "";
    			if (add_time.getHours() < 10) {
    				this.model.attributes.add_date += "0";
    			}
    			this.model.attributes.add_date += add_time.getHours() + ":";
    			if (add_time.getMinutes() < 10) {
    				this.model.attributes.add_date += "0";	
    			}
    			this.model.attributes.add_date += add_time.getMinutes();
		} else {
			this.model.attributes.add_date = "";
			if (add_time.getDate() < 10) {
				this.model.attributes.add_date += "0";
			}
			this.model.attributes.add_date += add_time.getDate() + ".";
			if (add_time.getMonth() < 10) {
				this.model.attributes.add_date += "0";	
			}
			this.model.attributes.add_date += add_time.getMonth() + ".";
			var year = parseInt(add_time.getYear()) - 100;
			if (year < 10) {
				this.model.attributes.add_date += "0";
			}
			this.model.attributes.add_date += year;
		}
        this.$el.html( this.template( this.model.attributes ) );
        
        return this;
    }
});
