var app = app || {};
var SelectStudentUniversitiesView = Backbone.View.extend({
	el: '#add_course--join__university',
	
    template: _.template( $('#select-university--student__template').html() ),

    collection: new CourseList(),

    initialize:function( options ){
    	this.collection.fetch({
            url: 'http://instudy.io/api/universities/',
            async:false,
            success:function (model, response) {
            },
            error: function(model, response) {
                alert('ERROR universities');
            },
        });
        this.render();
    },

    render:function( route ){
        this.$el.html("");
        this.$el.append("<option value=''disabled selected>Университет</option>");
        this.collection.each( function( item ) {
           this.$el.append( this.template( item.attributes ) );
        }, this);
        return this;
    },
});
