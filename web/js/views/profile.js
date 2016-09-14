var app = app || {};
var ProfileView = Backbone.View.extend({
	el: '#profile__content',
	
    template: _.template( $('#profile__template').html() ),

    initialize:function( options ){
    	this.render();
    },

    render:function( route ){
        //var height = $('.profile__avatar').height();
        //$('.profile__avatar').css({'width':height+'px'});
    	var fname = window.localStorage.getItem('inst_pr_fname');
    	var lname = window.localStorage.getItem('inst_pr_lname');
    	var mname = window.localStorage.getItem('inst_pr_mname');
        var ava = window.localStorage.getItem('inst_pr_ava');
    	var profile = new Profile({first_name: fname, last_name: lname, middle_name: mname, avatar_64: ava});
        this.$el.html( this.template( profile.attributes ) );
        
        return this;
    }
});
