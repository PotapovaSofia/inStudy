var app = app || {};
var ProfilePageView = Backbone.View.extend({
	el: '#profile-page__content',
	
    template: _.template( $('#profile-page__template').html() ),

    initialize:function( options ){
    	this.render();
    },

    render:function( route ){
    	var fname = window.localStorage.getItem('inst_pr_fname');
    	var lname = window.localStorage.getItem('inst_pr_lname');
    	var mname = window.localStorage.getItem('inst_pr_mname');
    	var pr = new Profile({first_name: fname, last_name: lname, middle_name: mname});
        this.$el.html( this.template( pr.attributes ) );
        
        return this;
    }
});
