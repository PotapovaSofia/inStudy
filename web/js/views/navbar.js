var app = app || {};
var NavBar = Backbone.View.extend({

    is_private: false, //rendering course is private

    initialize:function(options){
        InstudyRouter.on('route:news',function(id){
            this.render(id, 'news');
        }, this);
        InstudyRouter.on('route:checkin',function(id){
            this.render(id, 'checkin');
        }, this);
        InstudyRouter.on('route:chat',function(id){
            this.render(id, 'chat');
        }, this);
        InstudyRouter.on('route:course-settings',function(id){
            this.render(id, 'course-settings');
        }, this);
        InstudyRouter.on('route:courses',function(id){
            this.render(id, 'courses');
        }, this);
        InstudyRouter.on('route:settings',function(id){
            this.render(id, 'settings');
        }, this);
        InstudyRouter.on('route:feed',function(id){
            this.render(id, 'feed');
        }, this);
        InstudyRouter.on('route:profile',function(id){
            this.render(id, 'profile');
        }, this);
        InstudyRouter.on('route:schedule',function(id){
            this.render(id, 'schedule');
        }, this);
        InstudyRouter.on('route:welcome',function(id){
            this.render(id, 'welcome');
        }, this);
        InstudyRouter.on('route:error',function(id){
            this.render(id, 'error');
        }, this);
    },
    //This is a collection of possible routes and their accompanying
    //user-friendly titles
    commonTitles:{
        /*
        "feed":"F E E D S",
        "schedule":"S C H E D U L E",
        "courses":"C O U R S E S",
        */
        "feed":"новости",
        "schedule":"расписание",
        "courses":"курсы",
    },
    courseTitles:{
        "news": "news",
        "chat": "chat", 
        //"checkin": "checkin",
        "course-settings": "settings"
    },
    courseButtons:{
        "news": "Новости",
        "chat": "Чат", 
        //"checkin": "Чекин",
        "course-settings": "Настройки"
    },
    events:{
        'click .navbar-button':function(source) {
            var hrefRslt = source.target.getAttribute('href');
            Backbone.history.navigate(hrefRslt, {trigger:true});
            return false;
        },
        /*
        'click #profile__container' : function(){
            alert('show');
        }
        */
    },
    render:function(id, route){
        $(".profile__avatar").css("background-image", "url(" + window.localStorage.getItem('inst_pr_ava') + ")");
        this.$el.empty();
        if (route === 'welcome' || route === 'error') {
            $('#menu-wrap').hide();
        } else {
            $('#navbar-wrap').show();
            this.menu_el = $('#menu-item-container');
            this.menu_wrap = $('#menu-wrap');
            var template = _.template("<li class='navbar-button <%=active%>'><a href='<%=url%>'><%=visible%></a></li>");
            for (var key in this.commonTitles){
                this.$el.append(template({url:key,visible:this.commonTitles[key],active:route === key ? 'active' : ''}));
            }
            if (route === 'news' || route === 'checkin' || route === 'chat'|| route === 'course-settings') {
                if (this.is_private == false) {
                    this.menu_wrap.css("display", "flex");
                    this.menu_wrap.css("flex-direction", "column");
                    this.menu_wrap.css("justify-content", "center");
                    this.menu_wrap.show("slide", { direction: "left" }, 200);
                    this.menu_el.empty();
                    var menu_template = _.template("<a href='<%=url%>'><div class='menu-button <%=visible%>-ico' title='<%=name%>''></div></a>");
                    for (var key in this.courseTitles){
                        this.menu_el.append(menu_template({url:'#courses/' + id + '/' + key,visible:key, name:this.courseButtons[key]}));
                    }    
                }            
            } else {
                this.menu_wrap.hide("slide", { direction: "left" }, 200);
            }
            var profileView = new ProfileView();
        }
    },
});
