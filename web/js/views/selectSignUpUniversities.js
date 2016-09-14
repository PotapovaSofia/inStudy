var app = app || {};
var SelectSignUpUniversitiesView = Backbone.View.extend({
	el: '.select-university--sign_up',
	
    template: _.template( $('#select-university--sign_up__template').html() ),

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
        
 /*
        var groups = profile.attributes.student_in_groups;
        groups.each( function( group ) {
            this.collection.add(new University({
                id: group.attributes.university.attributes.id,
                name: group.attributes.university.attributes.name,
            }));
        }, this);

    	this.collection.each( function( item ) {
          this.renderUniversity( item );
        }, this);
 
        return this;
*/
        //this.$el.html( this.template( this.model.attributes ) );
        this.collection.each( function( item ) {
           this.$el.append( this.template( item.attributes ) );
        }, this);
 
        return this;
    
    },
});
