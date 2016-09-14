var app = app || {};
var SelectTeacherUniversitiesView = Backbone.View.extend({
	el: '#select-university--teacher',
	
    template: _.template( $('#select-university--teacher__template').html() ),

    initialize:function( options ){
    	this.render();
    },

    render:function( route ){
    	var profile = new Profile();
        profile.fetch({
            url: 'http://instudy.io/api/profile/me/',
            async:false,
            success:function (model, response) {
            },
            error: function(model, response) {
              alert('ERROR profile login');
            },
        });
        this.$el.html( this.template( profile.attributes ) );
        
        return this;
    }
});
