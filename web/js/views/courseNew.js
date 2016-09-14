var app = app || {};
var CourseNewView = Backbone.View.extend({

    tagName:'div',

    now: new Date(),

    template: _.template( $('#new-template').html() ),

    count: 0,

    collection: new CommentList(),

    initialize:function( options ){
        /*
         * По какой-то необъяснимой причине это не работает
         */
        this.listenTo( this.collection, 'add', this.renderComment );
    },

    events: {
    	'click .comment__button': function(source) {
    		var self = this;
    		this.collection.fetch( {
    			url: "http://instudy.io/api/feed/" + this.model.attributes.wall_id + 
    			"/" + this.model.attributes.id + "/comments/",
    			async: false,
    			success: function(collection, response) {
                    //self.renderComment(collection);
    				var comments_view = new CommentListView({
    					collection: collection, 
    					el: '#comment--' + self.model.attributes.id + '__list',
    				});
				    var list = '#' + source.toElement.id + '__list';
				    var form = '#' + source.toElement.id + '__form';
                    var del = '#' + source.toElement.id + '__delimeter';

		            if (self.count % 2 == 0) {
                        self.$(del).show(100);
		                self.$(list).show(100);
		                self.$(form).show(100);
		                this.$(".comment__textarea").autoResize();
		                this.$("#" + source.toElement.id).html('Скрыть комментарии(' +
		                	self.model.attributes.comments_count + ')');
		            } else {
                        self.$(del).hide(100);
		                self.$(list).hide(100);
		                self.$(form).hide(100);
		                this.$("#" + source.toElement.id).html('Показать комментарии(' +
		                	self.model.attributes.comments_count + ')');
		            }
		            self.count += 1;
                    var new_id = source.toElement.id;

                    /*
                     * При успешной подгрузке комментариев мы устанавливаем обработчик 
                     * сохранения комментария на сервер, 
                     */
                    var submit__button = '#comment--' + self.model.id + '__submit';
                    this.$(submit__button)[0].addEventListener('click', function(source) {
                        var id = "#" + source.toElement.parentElement.id + "__textarea";
                        var text = $(id).val();
                        if (text !== "") {
                            var comment = new Comment({
                                text: text,
                            });
                            comment.save({}, {
                                url: "http://instudy.io/api/feed/" + self.model.attributes.wall_id + 
                                "/" + self.model.attributes.id + "/comments/",
                                async:false,
                                success:function (model, response) {
                                    self.renderComment(model);
                                    self.model.attributes.comments_count++;
                                    self.$("#" + new_id).html('Скрыть комментарии(' +
                                        self.model.attributes.comments_count + ')');
                                },
                                error: function(model, response) {
                                    Backbone.history.navigate("#error", {trigger: true});
                                },
                            });
                            this.$("#" + source.toElement.parentElement.id + "__form").trigger('reset');
                        }
                    }.bind(this), false);
		        },
		        error: function(collection, response) {
		            Backbone.history.navigate("#error", {trigger: true});
		        }
    		});
    		
    	},
    },

    render:function( route ){
    	this.model.attributes.add_date = 
            this.convertTime(new Date(this.model.attributes.add_time));
        if (this.model.attributes.attached_comment) {
            if (this.model.attributes.attached_comment.length != 0) {
                var add_time = this.convertTime(new Date(this.model.attributes.attached_comment.add_time));
                this.model.attributes.attached_comment.add_time = add_time;
            }
        }

        this.$el.html( this.template( this.model.attributes ) );
        
        return this;
    },

    renderComment:function( item ) {
        var comment_view = new CommentView({ model: item });
        this.$('#comment--' + this.model.attributes.id + '__list').append(comment_view.render().el); 
    },

    convertTime: function(add_time) {
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
    }
});
