var app = app || {};
var SelectSignUpGroupView = Backbone.View.extend({
	el: '.select-group--sign_up',
	
    template: _.template( $('#select-group--sign_up__template').html() ),

    collection: new GroupsList(),

    initialize:function( options ){
    	var uid = this.model.id;
        /* Почему-то так не работает((((
    	this.collection.fetch({
            url: 'http://instudy.io/api/universities/' + uid + '/groups/',
            async:false,
            success:function (model, response) {
              	alert('SUCCESS select group');
            },
            error: function(model, response) {
              	alert('ERROR select group');
            },
        });
*/
        xmlHttp = new XMLHttpRequest(); 
        xmlHttp.open( "GET", "http://instudy.io/api/universities/" + uid + "/groups/", false );
        xmlHttp.setRequestHeader("Authorization", "Token " + window.localStorage.getItem('token'));
        xmlHttp.send( null );
        var j = JSON.parse(xmlHttp.responseText);
        this.collection = new GroupsList(j);
    	this.render();
    },

    render:function( route ){
        //this.$el.html( this.template( this.profile.attributes ) );
        this.$el.html('');
        this.collection.each( function( item ) {
      		this.$el.append( this.template( item.attributes ) );
        }, this);
 
        //return this;
    },
});
