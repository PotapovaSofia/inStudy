var GroupsList = Backbone.Collection.extend({

    // Reference to this collection's model.
    model: Group,

    // Save all of the todo items under the `"todos-backbone"` namespace.
    localStorage: new Backbone.LocalStorage('instudy-backbone'),

  });  