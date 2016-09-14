var app = app || {};
var Menu = Backbone.View.extend({
    initialize:function(options){
        Backbone.history.on('route',function(source, path){
            this.render(path);
        }, this);
    },
    //This is a collection of possible routes and their accompanying
    //user-friendly titles
    titles:{
        "course_news": "Новости",
        "course_chat": "Чат", 
        "course_checkin": "Чекин"
    },
    events:{
        'click .menu-button':function(source) {
            var hrefRslt = source.target.getAttribute('href');
            Backbone.history.navigate(hrefRslt, {trigger:true});
            //Cancel the regular event handling so that we won't actual change URLs
            //We are letting Backbone handle routing
            return false;
        }
    },
    //Each time the routes change, we refresh the navigation
    //items.
    render:function(route){
        this.$el.empty();
        if (route === "course_news" || route === "course_chat" || route === "course_checkin") {
            var template = _.template("<div class='menu-button <%=active%>' title='Новости'><a href='<%=url%>'></a></div>");
            for (var key in this.titles){
                this.$el.append(template({url:key,visible:this.titles[key],active:route === key ? 'active' : ''}));
            }
        }
    }
});