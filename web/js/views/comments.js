var app = app || {};
var CommentListView = Backbone.View.extend({
 
    initialize:function( options ){
    	this.render();
    },

    render:function(){
        $(".add_comment__image").css("background-image", "url(" + window.localStorage.getItem('inst_pr_ava') + ")");
        this.$el.html('');
        this.collection.each( function( item ) {
            this.renderComment( item );
        }, this);
 
        return this;
    },
 
    renderComment:function( item ) {
        var comment_view = new CommentView({ model: item });
        this.$el.append(comment_view.render().el); 
    },

});