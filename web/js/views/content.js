var app = app || {};
var Content = Backbone.View.extend({
 
    collection: new CourseList(),

    /*
     * navbar
     */
 
    initialize:function(options){
       
        InstudyRouter.on('route:courses',function(id){
            this.getCourses(id, 'courses');
        }, this);
        InstudyRouter.on('route:schedule',function(id){
            this.getCourses(id, 'schedule');
        }, this);
        InstudyRouter.on('route:settings',function(id){
            this.getCourses(id, 'settings');
        }, this);
        InstudyRouter.on('route:feed',function(id){
            this.getCourses(id, 'feed');
        }, this);
        InstudyRouter.on('route:profile',function(id){
            this.getCourses(id, 'profile');
        }, this);
        InstudyRouter.on('route:activate',function(id){
            this.getCourses(id, 'activate');
        }, this);
        InstudyRouter.on('route:news',function(id){
            this.getCourses(id, 'news');
        }, this);
        InstudyRouter.on('route:chat',function(id){
            this.getCourses(id, 'chat');
        }, this);
        InstudyRouter.on('route:checkin',function(id){
            this.getCourses(id, 'checkin');
        }, this);
        InstudyRouter.on('route:course-settings',function(id){
            this.getCourses(id, 'course-settings');
        }, this);
        InstudyRouter.on('route:welcome',function(id){
            this.render(id, 'welcome');
        }, this);
        InstudyRouter.on('route:error',function(id){
            this.render(id, 'error');
        }, this);
       
    },
    //This object defines the content for each of the routes in the application
    content:{
        "schedule":_.template(document.getElementById("schedule").innerHTML),
        "courses":_.template(document.getElementById("courses").innerHTML),
        "settings":_.template(document.getElementById("settings").innerHTML),
        "feed":_.template(document.getElementById("feed").innerHTML),
        "activate":_.template(document.getElementById("activate").innerHTML),
        "news":_.template(document.getElementById("course-news").innerHTML),
        "chat":_.template(document.getElementById("course-chat").innerHTML),
        "checkin":_.template(document.getElementById("course-checkin").innerHTML),
        "course-settings":_.template(document.getElementById("course-settings").innerHTML),
        "welcome":_.template(document.getElementById("welcome").innerHTML),
        "error":_.template(document.getElementById("error-template").innerHTML),
    },

    getCourses: function (id, route) {
        var token = window.localStorage.getItem('token');
        if (token) {
            
            var self = this;
            this.collection.fetch({
                async:false,
                success: function(collection, response) {
                    self.render(id, route);
                },
                error: function(collection, response) {
                    Backbone.history.navigate("error", {trigger:true});
                }
            });
        } else {
            Backbone.history.navigate("welcome", {trigger:true});
            //self.render()
        }
    },

 
    render:function(id, route){
        //$("#app").css("background", "#fff2cc");
        this.$el.html(this.content[route]);
        if (route === "courses") {
            this.$el.html(this.content[route]);
            this.view = new CourseListView({ collection: this.collection});
        }
        if (route === "schedule") {
            this.$el.html(this.content[route]);
            this.view = new ScheduleView({ model: this.collection});
        }
        if (route === "settings") {
            this.$el.html(this.content[route]);
            this.view = new SettingsView({ model: this.collection});
        }
        if (route === "feed") {
            this.$el.html(this.content[route]);
            this.view = new FeedView({ model: this.collection});
        }
        if (route === "activate") {
            this.$el.html(this.content[route]);
            this.view = new ActivateView();
        }
        if (route === "news") {
            this.collection.each( function( item ) {
            //typeof item.get("course_id") is a number but typeof id is a string so we need to use == instead of ===
                if (item.get("id") == id) {
                    this.setNavBar(item);
                    this.view = new CourseNewsView({ model: item });
                    //this.input_view = new CourseNewsImputVew({ model: item });
                }
            }, this);
        }
        if (route === "chat") {
            this.collection.each( function( item ) {
                if (item.get("id") == id) {
                    this.setNavBar(item);
                    this.view = new CourseChatView({ model: item });
                }
            }, this);
        }
        if (route === "checkin") {
            this.collection.each( function( item ) {
            //typeof item.get("course_id") is a number but typeof id is a string so we need to use == instead of ===
                if (item.get("id") == id) {
                    this.setNavBar(item);
                    this.view = new CourseCheckinView({ model: item });
                }
            }, this);
        }
        if (route === "course-settings") {
            this.collection.each( function( item ) {
                if (item.get("id") == id) {
                    this.setNavBar(item);
                    this.view = new CourseSettingsView({ model: item });
                }
            }, this);
        }
        if (route === "welcome") {
            this.$el.html(this.content[route]);
            //$("#app").css("background-image", "url('img/back.jpg')");
            //$("#app").css("background-attachment", "fixed");
            //$("#app").css("background-repeat", "no-repeat");
            //$("#app").css("background-position","right top");
            //$("#app").css("background-size", "100%");
            $("#app").css("background", "url('img/back.jpg') fixed no-repeat right top");
            $("#app").css("background-size", "auto 140%");
            //this.view = new SettingsView({ model: this.collection});
        }
        if (route === "error") {
            this.$el.html(this.content[route]);
            //this.view = new SettingsView({ model: this.collection});
        }
        return this;
    },
    setNavBar: function(course) {
        navbar.is_private = course.attributes.is_private;
        console.log(navbar.is_private);
    }
});
