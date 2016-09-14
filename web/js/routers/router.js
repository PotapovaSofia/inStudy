var InstudyRouter = new (Backbone.Router.extend({
  routes: {
      "schedule": "schedule",
      "courses": "courses",
      "settings": "settings",
      "feed": "feed",
      "profile": "profile",
      "courses/:id/news": "news",
      "courses/:id/checkin": "checkin",
      "courses/:id/chat": "chat",
      "courses/:id/course-settings": "course-settings",
      "activate": "activate",
      "welcome": "welcome",
      "": "welcome",
      "error" : "error",
  },

}));

var backboneSync = Backbone.sync;

Backbone.sync = function (method, model, options) {

  var token = window.localStorage.getItem('token');
  if (token) {
    options.headers = {
      'Authorization': 'Token ' + token
    }
  }

  backboneSync(method, model, options);
};
/*
Backbone.convertTime = function(add_time) {
    var add_date;
    if (this.now.getYear() === add_time.getYear() && this.now.getMonth() === add_time.getMonth() && 
        this.now.getDate() === add_time.getDate()) {
            add_date = "";
            if (add_time.getHours() < 10) {
                add_date += "0";
            }
            add_date += add_time.getHours() + ":";
            if (add_time.getMinutes() < 10) {
                add_date += "0";  
            }
            add_date += add_time.getMinutes();
    } else {
        add_date = "";
        if (add_time.getDate() < 10) {
            add_date += "0";
        }
        add_date += add_time.getDate() + ".";
        if (add_time.getMonth() < 10) {
            add_date += "0";  
        }
        add_date += add_time.getMonth() + ".";
        var year = parseInt(add_time.getYear()) - 100;
        if (year < 10) {
            add_date += "0";
        }
        add_date += year;
    }
    return add_date;
};

Backbone.Collection.prototype.save = function (options) {
    Backbone.sync("create", this, options);
};
*/
  
  var app = app || {};
  new AppView();
  var content = new Content({el:document.getElementById('container')});
  var navbar = new NavBar({el:document.getElementById('nav-item-container')});
  content.navbar = navbar;
 // new Menu({el:document.getElementById('menu-item-container')});

  Backbone.history.start();
