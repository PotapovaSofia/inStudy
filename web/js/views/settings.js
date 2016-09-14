var app = app || {};
var SettingsView = Backbone.View.extend({
    el: '#settings-content',

    events: {
      'click #settings__button--change': 'changeUserInfo',
      'click .select-university--sign_up': 'selectGroup',
    },

    initialize: function() {
        //this.collection = new app.Schedule();   
        //this.collection.fetch({reset: true});   
        //this.listenTo( this.collection, 'reset', this.render );
        var uni_view = new SelectSignUpUniversitiesView();
        this.render();
    },

    // render library by rendering each book in its collection
    render: function() {
        $("#profile__container").css("background-color", "#fff2cc");
        $("#settings__first_name").attr("value", window.localStorage.getItem("inst_pr_fname"));
        $("#settings__last_name").attr("value", window.localStorage.getItem("inst_pr_lname"));
        $("#settings__middle_name").attr("value", window.localStorage.getItem("inst_pr_mname"));
    },
    changeUserInfo: function(source) {
        var attrs = {};
        if ($('#settings__first_name').val() !== "") {
            attrs.first_name =  $('#settings__first_name').val();    
        }
        if ($('#settings__last_name').val() !== "") {
            attrs.last_name =  $('#settings__last_name').val();       
        }
        if ($('#settings__middle_name').val() !== "") {
            attrs.middle_name =  $('#settings__middle_name').val();       
        }
        var navigate = false;
        var profile = new Profile ({ id: window.localStorage.getItem('inst_prfl_pk') });
        profile.save(attrs, {
            url: 'http://instudy.io/api/profile/me/',
            patch: true,
            async:false,
            success:function (model, response) {
                window.localStorage.setItem('inst_pr_fname', model.attributes.first_name);
                window.localStorage.setItem('inst_pr_lname', model.attributes.last_name);
                window.localStorage.setItem('inst_pr_mname', model.attributes.middle_name);
                window.localStorage.setItem('inst_pr_ava', model.attributes.avatar_64);
                navigate = true;
            },
            error: function(model, response) {
                navigate = false;
                Backbone.history.navigate("#error", {trigger: true});
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
                        navigate = false;
                        Backbone.history.navigate("#error", {trigger: true});
                    },
                });
            }
        }
        if (navigate) {
            Backbone.history.navigate("#schedule", {trigger: true});
        }
    },
    selectGroup: function(source) {
        var uid = $('.select-university--sign_up').val();
        if (uid === "") {
            $('.select-group--sign_up').hide();
        } else {
            $('.select-group--sign_up').show();
            var uni = new University({id: uid});
            var group_view = new SelectSignUpGroupView({model: uni});    
        }        
    }
});