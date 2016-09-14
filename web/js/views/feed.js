var app = app || {};
var FeedView = Backbone.View.extend({
 
    el: '#feed-content',

    collection: new CourseNewsList(),

    show_news_num: new Map(),

    initialize:function( options ){
        var self = this;
        this.collection.fetch({
            async:false,
            url: 'http://instudy.io/api/feed/',
            success: function(collection, response) {
                self.render();
            },
            error: function(collection, response) {
                Backbone.history.navigate("#error", {trigger: true});
            }
        });
    },
 
    render:function( route ){
        this.$el.html('');
        this.collection.each( function( item ) {
          this.renderNew( item );
        }, this);
        return this;
    },
 
    renderNew:function( item ) {
      var newView = new CourseNewView({ model: item });
      this.$el.append(newView.render().el);
    },
 /*
    events:{
        'click a':function(source) {
            var hrefRslt = source.target.getAttribute('href');
            Backbone.history.navigate(hrefRslt, {trigger:true});
            return false;
        },
    }
    */
});