var AppView = Backbone.View.extend({
    el: '#app',

    events: {
      'click #background-wrapper': 'closeAllWindows',
      'click .sign-in': 'signInUser',
      'click #to-sign-up': 'toSignUpUser',
      'click #sign-up': 'signUpUser',
      'click #profile__container' : 'showProfileMenu',
      
      'click #activate__button': 'activateUser',
      'click #log-out': 'logOutUser',
      'click .settings__button': 'closeProfilePopup',
      'click #background-wrapper--add_new': 'closeAddNew',
      'click .checkbox__is_periodic': "showPeriodicInput",
    },
    closeAllWindows: function() {
      this.$('#background-wrapper').hide();
      this.$('#colorless-wrapper').hide();
      this.$('.popup').hide("fast");
      this.$('#profile__menu').hide("fast");
      this.$('#popup--right').hide("slow");
      this.$('.week-picker').hide("slow");
      this.$('#profile__container').css("background-color", "#fff2cc");
    },
    signInUser: function(e) {
      var em;
      var pas;
      if (e.target.id === "activate__button--tmp") {
        em = $('#id_email').val();
        pas = $('#id_password').val();
      } else if (e.target.id === "sign-in") {
        em = $('#sign-in__email').val();
        pas = $('#sign-in__password').val();
      }
      var user = new User({
        email: em, 
        password: pas
      });
      window.localStorage.removeItem('token');
      /*
      var u = 'email=' + encodeURIComponent(em) + '&password=' +  encodeURIComponent(pas);
      xmlHttp = new XMLHttpRequest(); 
      xmlHttp.open( "POST", "http://instudy.io/api/auth/login/", true);
      xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xmlHttp.onreadystatechange = function (oEvent) {  
          if (xmlHttp.readyState === 4) {  
              if (xmlHttp.status === 200) {  
                console.log(xmlHttp.responseText)  
              } else {  
                 console.log("Error", xmlHttp.statusText);  
              }  
          }  
      };
      xmlHttp.send( u );
      var response = JSON.parse(xmlHttp.responseText);
      console.log(response);
      //this.collection = new MessageList(response.results);
*/

      user.save({}, {
        async:false,
        success:function (model, response) {
          var token = model.get("auth_token");
          window.localStorage.setItem('token', token);
          var profile = new Profile();
          profile.fetch({
            url: 'http://instudy.io/api/profile/me/',
            async:false,
            success:function (model, response) {
              var instudy_profile_fname = model.get("first_name");
              var instudy_profile_lname = model.get("last_name");
              var instudy_profile_mname = model.get("middle_name");
              var instudy_profile_id = model.get("id");
              var instudy_profile_ava = model.get("avatar_64");
              if (model.attributes.teacher_at_universities.length != 0) {
                window.localStorage.setItem('inst_pr_teacher', true);  
              } else {
                window.localStorage.setItem('inst_pr_teacher', false); 
              }
              window.localStorage.setItem('inst_pr_fname', instudy_profile_fname);
              window.localStorage.setItem('inst_pr_lname', instudy_profile_lname);
              window.localStorage.setItem('inst_pr_mname', instudy_profile_mname);
              window.localStorage.setItem('inst_prfl_pk', instudy_profile_id);
              window.localStorage.setItem('inst_pr_ava', instudy_profile_ava);
            },
            error: function(model, response) {
              Backbone.history.navigate("#error", {trigger: true});
            },
          });
          //Backbone.history.navigate("schedule", {trigger:true});
          window.location = "#schedule";
        },
        error: function(model, response) {
          //this.$(".sign-up-form").css("background-color", "red");
        },
      });
      
    },
    signUpUser: function(e) {
      window.localStorage.removeItem('token');
      var em = $('#sign_up__email').val();
      var pas = $('#sign_up__password').val();
      var f_n = $('#sign_up__first_name').val();
      var l_n = $('#sign_up__last_name').val();
      var user = new User({email: em, password: pas, first_name: f_n, last_name: l_n});
      var self = this;
      user.save({}, {
        url: 'http://instudy.io/api/auth/register/',
        async:false,
        success:function (model, response) {
          $('#popup--right').animate({width: 'toggle'}, 300);
          //self.openTopPopup();
          user = new User({ email: em, password: pas });
          user.save({}, {
            async:false,
            success:function (model, response) {
              var token = model.get("auth_token");
              window.localStorage.setItem('token', token);
              var profile = new Profile();
              profile.fetch({
                url: 'http://instudy.io/api/profile/me/',
                async:false,
                success:function (model, response) {
                  var instudy_profile_fname = model.get("first_name");
                  var instudy_profile_lname = model.get("last_name");
                  var instudy_profile_mname = model.get("middle_name");
                  var instudy_profile_id = model.get("id");
                  if (model.attributes.teacher_at_universities.length != 0) {
                    window.localStorage.setItem('inst_pr_teacher', true);  
                  } else {
                    window.localStorage.setItem('inst_pr_teacher', false); 
                  }
                  window.localStorage.setItem('inst_pr_fname', instudy_profile_fname);
                  window.localStorage.setItem('inst_pr_lname', instudy_profile_lname);
                  window.localStorage.setItem('inst_pr_mname', instudy_profile_mname);
                  window.localStorage.setItem('inst_prfl_pk', instudy_profile_id);
                },
                error: function(model, response) {
                  Backbone.history.navigate("#error", {trigger: true});
                },
              });
              //Backbone.history.navigate("#schedule", {trigger:true});
            },
          })
          Backbone.history.navigate("#activate", {trigger:true});
        },
        error: function(model, response) {
          alert('ERROR registr');
          // пользователь существует? невозможная почта или пароль? 
        },
      });
    },
    toSignUpUser: function(source) {
      this.$('#popup--right').animate({width: 'toggle'}, 300);
      this.$('#background-wrapper--right').show();
      this.$('.sign-up-form').hide("fast");
    },
    openTopPopup: function(source) {
      this.$('#popup--top').animate({width: 'toggle'}, 300);
      this.$('#background-wrapper').show();
    },
    showProfileMenu: function(source) {
      this.$('#profile__container').css("background-color", "#ffbf80");
      this.$('#profile__menu').show("fast");
      this.$('#background-wrapper').show();
    },
    
    activateUser: function(source) {
      //var l_n = $('#activate__last_name').val();
      //var f_n = $('#activate__first_name').val();
      var m_n = $('#activate__middle_name').val();
      var profile = new Profile({
        middle_name: m_n,
        id: window.localStorage.getItem('inst_prfl_pk'),
      });
      var attrs = {m_n};
      var navigate = false;
      profile.save(attrs, {
        url: 'http://instudy.io/api/profile/me/',
        patch: true,
        async:false,
        success:function (model, response) {
          window.localStorage.setItem('inst_pr_mname', m_n);
          navigate = true;
        },
        error: function(model, response) {
          Backbone.history.navigate("#error", {trigger: true});
          navigate = false;
          //var responseObj = $.parseJSON(response.responseText);
        },
      });
      if ($(".select-university--sign_up").val() !== "") {
            //attrs.university = ".select-university--sign_up").val();
            if ($(".select-group--sign_up").val() !== "") {
                var group_id = $(".select-group--sign_up").val();
                var group = new Group({add: "True"});
                group.save({}, {
                    url: 'http://instudy.io/api/groups/' + group_id + '/addition/',
                    async:false,
                    success:function (model, response) {
                        navigate = true;
                    },
                    error: function(model, response) {
                        alert('ERROR profile settings group');
                        // неверное секретное слово - обрабатывать!
                        navigate = false;
                    },
                })
            }
        }
        if (navigate) {
            Backbone.history.navigate("#schedule", {trigger: true});
        }
    },
    logOutUser: function(e) {
        var u = new User();
        $("#profile__menu").hide();
        $("#navbar-wrap").hide();
        u.save({}, {
            url: 'http://instudy.io/api/auth/logout/',
            async:false,
            success:function (model, response) {
              window.localStorage.removeItem('inst_pr_fname');
              window.localStorage.removeItem('inst_pr_lname');
              window.localStorage.removeItem('inst_pr_mname');
              window.localStorage.removeItem('inst_prfl_pk');
              window.localStorage.removeItem('inst_pr_teacher');
              window.localStorage.removeItem('token');
              Backbone.history.navigate("welcome", {trigger:true});
            },
            error: function(model, response) {
              if (response.status == 200) {
                window.localStorage.removeItem('inst_pr_fname');
                window.localStorage.removeItem('inst_pr_lname');
                window.localStorage.removeItem('inst_pr_mname');
                window.localStorage.removeItem('inst_prfl_pk');
                window.localStorage.removeItem('inst_pr_teacher');
                window.localStorage.removeItem('token');
                Backbone.history.navigate("welcome", {trigger:true});
              } else {
                Backbone.history.navigate("error", {trigger:true});
              }
            }
        });
    },
    closeProfilePopup: function(source) {
      this.$("#profile__menu").hide("fast");
      this.$("#background-wrapper").hide();
    },
    closeAddNew: function(source) {
        this.$("#add_new__context").hide();
        $("#background-wrapper--add_new").hide();
        $("#add_new__input").show();
    },
    showPeriodicInput: function (source) {
      var type = source.toElement.id.split("--")[0];
      var id;
      if (type === "change") {
          id = source.toElement.id.split("--")[2];
          if ($('#' + type + '--event__is_periodic--' + id).prop("checked") == true) {
              $("#" + type + "--event__is_even--" + id).prop('disabled', false);
              $("#" + type + "--event__is_even--" + id).show();
              $("#" + type + "--event__is_odd--" + id).prop('disabled', false);
              $("#" + type + "--event__is_odd--" + id).show();
              $("#" + type + "--event__day_of_week--" + id).prop('disabled', false);
              $("#" + type + "--event__day_of_week--" + id).show();
              $("#" + type + "--event__oneoff_date--" + id).prop('disabled', true);
              $("#" + type + "--event__oneoff_date--" + id).hide();
              $("#" + type + "--event__oneoff_date--" + id).removeAttr('required');
              $("#change--event__is_even--" + id + "__label").css("color", "rgba(0,0,0,1");
              $("#change--event__is_odd--" + id + "__label").css("color", "rgba(0,0,0,1");
          } else {
              $("#" + type + "--event__is_even--" + id).prop('disabled', true);
              $("#" + type + "--event__is_even--" + id).hide();
              $("#" + type + "--event__is_odd--" + id).prop('disabled', true);
              $("#" + type + "--event__is_odd--" + id).hide();
              $("#" + type + "--event__day_of_week--" + id).prop('disabled', true);
              $("#" + type + "--event__day_of_week--" + id).hide();
              $("#" + type + "--event__oneoff_date--" + id).prop('disabled', false);
              $("#" + type + "--event__oneoff_date--" + id).show();
              $("#change--event__is_even--" + id + "__label").css("color", "rgba(0,0,0,0.5");
              $("#change--event__is_odd--" + id + "__label").css("color", "rgba(0,0,0,0.5");
          }
      } else {
          if ($('#' + type + '--event__is_periodic').prop("checked") == true) {
              $("#" + type + "--event__is_even").prop('disabled', false);
              $("#" + type + "--event__is_even").show();
              $("#" + type + "--event__is_odd").prop('disabled', false);
              $("#" + type + "--event__is_odd").show();
              $("#" + type + "--event__day_of_week").prop('disabled', false);
              $("#" + type + "--event__day_of_week").show();
              $("#" + type + "--event__oneoff_date").prop('disabled', true);
              $("#" + type + "--event__oneoff_date").hide();
              //$("#" + type + "--event__is_even__label").css("color", "rgba(0,0,0,1");
              //$("#" + type + "--event__is_odd__label").css("color", "rgba(0,0,0,1");
          } else {
              $("#" + type + "--event__is_even").prop('disabled', true);
              $("#" + type + "--event__is_even").hide();
              $("#" + type + "--event__is_odd").prop('disabled', true);
              $("#" + type + "--event__is_odd").hide();
              $("#" + type + "--event__day_of_week").prop('disabled', true);
              $("#" + type + "--event__day_of_week").hide();
              $("#" + type + "--event__oneoff_date").prop('disabled', false);
              $("#" + type + "--event__oneoff_date").show();
              $("#" + type + "--event__is_even__label").css("color", "rgba(0,0,0,0.5");
              $("#" + type + "--event__is_odd__label").css("color", "rgba(0,0,0,0.5");
          }
      }         
          
    },

  });
  
