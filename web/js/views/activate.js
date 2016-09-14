var app = app || {};
var ActivateView = Backbone.View.extend({
    el: '#app',

    events: {
      'click .select-university--sign_up': 'selectGroup',
    },

    initialize: function() {
        var uni_view = new SelectSignUpUniversitiesView();
        this.render();
    },

    // render library by rendering each book in its collection
    render: function() {
    },
    selectGroup: function(source) {
        var uid = $('.select-university--sign_up').val();
        if (uid === "") {
            $('.select-group--sign_up').hide();
        } else {
            $('.select-group--sign_up').show();
            $('.select-group--sign_up').html('');
            var uni = new University({id: uid});
            var group_view = new SelectSignUpGroupView({model: uni});    
        }        
    }
});