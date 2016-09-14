var app = app || {};
var CourseChatView = Backbone.View.extend({
  
    el: '#add_message_wrap',

    collection: new MessageList(),

    now: new Date(),

    initialize:function( options ){
        var self = this;
        var room_id = this.model.attributes.room_id;
        this.createSocket(room_id);

        
        /*
        this.collection.fetch({
            url: "http://instudy.io/api/chat/" + room_id + "/messages/?limit=10&offset=1",
            async:false,
            success: function(collection, response) {
                self.render();
            },
            error: function(collection, response) {
                window.location = "file:///home/d_k/Desktop/sonya/pract/web/site/home";
            }
        });
*/

        xmlHttp = new XMLHttpRequest(); 
        xmlHttp.open( "GET", "http://instudy.io/api/chat/" + room_id + "/messages/?limit=10&offset=0", false );
        xmlHttp.setRequestHeader("Authorization", "Token " + window.localStorage.getItem('token'));
        xmlHttp.send( null );
        var j = JSON.parse(xmlHttp.responseText);
        this.collection = new MessageList(j.results);
        this.render();
        //this.listenTo( this.collection, 'add', this.renderMessage );
    },

    render:function(){
        $(".add_message__image").css("background-image", "url(" + window.localStorage.getItem('inst_pr_ava') + ")");
        $('#course-chat-content').slimScroll({
            height: '100%',
            start: 'bottom',
            color: '#ffcf80'
        });
        $('#course-chat-content').html('');
        var self = this;
        _.each(this.collection.last(this.collection.length).reverse(), function (item) {
            self.renderMessage( item );
        });

        return this;
    },

    renderMessage:function( item ) {
        var add_time = new Date(item.attributes.add_time);
        item.attributes.add_date = this.convertTime(add_time);
        var message = new MessageView({ model: item });
        $('#course-chat-content').append(message.render().el);
        $('#course-chat-content').animate({scrollTop: $('#course-chat-content').height() + 100}, 0);
    },

    events: {
        'click #add_message__submit': function( source ) {
            source.preventDefault();
            var text = $('#add_message_text').val();
            if (text !== "") {
                var message = new Message({text: text});
                var self = this;
                message.save({}, {
                    url: "http://instudy.io/api/chat/" + this.model.attributes.room_id + "/messages/",
                    async:false,
                    success:function (model, response) {
                        self.collection.add(model);
                        $("#add_message_form").trigger('reset');
                    },
                    error: function(model, response) {
                      alert('error in saving message');
                      //выдавать здесь как в вк?? 
                    },
                });
                //self.collection.add(message);
                //self.renderMessage(message);
                $("#add_message_form").trigger('reset');
            }
        }
    },

    createSocket: function(room_id) {
        var token = window.localStorage.getItem('token');
        var socket = new WebSocket("ws://instudy.io/api/subscribe/chat/" + room_id + "/");

        socket.onopen = function() {
            socket.send('{"type":"login", "token":"' + token + '"}');
        };

        var self = this;
        socket.onclose = function(event) {
            if (event.wasClean) {
                //alert('Соединение закрыто чисто');
            } else {
                //alert('Обрыв соединения');
                self.createSocket(room_id);
            }
            //alert('Код: ' + event.code + ' причина: ' + event.reason);
        };

        var self = this;
        socket.onmessage = function(event) {
            //alert("Получены данные " + event.data);
            var message = new Message(JSON.parse(event.data));
            self.renderMessage(message);

        };

        socket.onerror = function(error) {
          alert("Ошибка " + error.message);
        };
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