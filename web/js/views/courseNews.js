var app = app || {};
var CourseNewsView = Backbone.View.extend({
 
    el: '#news__positioner',
 
    collection: new CourseNewsList(),

    show_news_num: new Map(),

    is_teacher: false,
 
    initialize:function( options ){
        var teachers = this.model.attributes.registered_teachers;
        for (i = 0; i < teachers.length; i++) {
            if (parseInt(window.localStorage.getItem('inst_prfl_pk')) == teachers[i].id) {
                this.is_teacher = true;
            }
        }
        var wall_num = this.model.attributes.wall_id;
        var self = this;
        this.collection.fetch({
            async:false,
            url: 'http://instudy.io/api/feed/' + wall_num + '/',
            success: function(collection, response) {
                self.render();
            },
            error: function(collection, response) {
                Backbone.history.navigate("#error", {trigger: true});
            }
        });
    },
 
    events: {
        'click #add_new__button': function( e ) {
            e.preventDefault();
            var title = $('#add_new__title').val();
            var text = $('#add_new__textarea').val();
            if (text !== "") {
                var course_new = new CourseNew({
                    title: title,
                    text: text,
                    anonymous: false,
                });
                if (this.is_teacher == false) {
                    course_new.attributes.post_type = 'Q';
                } else {
                    course_new.attributes.post_type = 'C';
                }
                var self = this;
                course_new.save({}, {
                    url: 'http://instudy.io/api/feed/' + self.model.attributes.wall_id + '/',
                    async:false,
                    success:function (model, response) {
                        self.collection.add(model);
                        self.renderNew(model);
                        $("#add_news").trigger('reset');
                        $("#add_new__context").hide();
                        $("#background-wrapper--add_new").hide();
                        $("#add_new__input").show();
                    },
                    error: function(model, response) {
                        Backbone.history.navigate("#error", {trigger: true});
                    },
                });
            }

        },
        'click .add_new__input': function(source) {
            $("#add_new__input").hide();
            $("#add_new__context").show();
            $("#background-wrapper--add_new").show();
            this.$("#add_new__textarea").autoResize();
            if (this.is_teacher) {
                this.$("add_new__checkbox").show();
            }
        },
        'click .attachment__button': function(source) {
            /*
            var link = $('.attachment__button');
            var offset = link.offset();
            var top = offset.top;
            var left = offset.left;
            var bottom = top + link.outerHeight();
            var right = left + link.outerWidth();
            */
            bottom = parseInt($(".attachment__button").css("bottom").split("px")[0]) + 50;
            ///TODO gthtделать в коллекцию для нормального удаления
            $(".attachments").append(_.template("<div class='attachment__popup'><div class='attachment__block'><input type='file' name='fileToUpload' id='fileToUpload' value=''></div><div class='attachment__cross'></div></div>"));
            $(".attachment__button").css("bottom", bottom + "px");
        },
        'click .attachment__cross': function(source) {
            $(".attachments").html('');
            $(".attachment__button").css("bottom", "40px");
        }
    },

    render:function(){
        $(".add_new__image").css("background-image", "url(" + window.localStorage.getItem('inst_pr_ava') + ")");
        
        if (this.is_teacher) {
            this.$('#add_new__input')[0].placeholder = 'Опубликовать новость';            
        } else {
            this.$('#add_new__input')[0].placeholder = 'Отправить новость преподавателю';
        }
        $( '#course-news-content' ).html('');
        this.collection.each( function( item ) {
            this.renderNew( item );
        }, this);
        return this;
    },
 
    renderNew:function( item ) {
        item.attributes.wall_id = this.model.attributes.wall_id;
        var newView = new CourseNewView({ model: item });
        this.ele = $ ('#course-news-content');
        this.ele.prepend(newView.render().el);
    }
});