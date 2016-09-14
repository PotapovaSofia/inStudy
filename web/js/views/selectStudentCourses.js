var app = app || {};
var SelectStudentCoursesView = Backbone.View.extend({
	el: '#add_course--join__id',
	
    template: _.template( $('#select-course--student__template').html() ),

    collection: new CourseList(),

    initialize:function( options ){
    	var uid = this.model.id;
    	var self = this;
    	this.collection.fetch({
            url: 'http://instudy.io/api/universities/' + uid + "/courses/",
            async:false,
            success:function (model, response) {
            },
            error: function(model, response) {
              	alert('ERROR select course');
            },
        });
    	this.render();
    },

    render:function( route ){
        //this.$el.html( this.template( this.profile.attributes ) );
        this.$el.html("");
        this.$el.append("<option value=''disabled selected>Курс</option>");
        this.collection.each( function( item ) {
      		this.$el.append( this.template( item.attributes ) );
        }, this);
 
        //return this;
    },
});
