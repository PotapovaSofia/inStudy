var app = app || {};
var CourseCardView = Backbone.View.extend({

    template: $( '#course-card-template' ).html(),

    render: function() {
        var tmpl = _.template( this.template );
        this.$el.html( tmpl( this.model.toJSON() ) );
        return this;
    }
});
