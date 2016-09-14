var MessageList = Backbone.Collection.extend({

    // Reference to this collection's model.
    model: Message,

    // Save all of the todo items under the `"todos-backbone"` namespace.
    localStorage: new Backbone.LocalStorage('instudy-backbone'),

  });  
