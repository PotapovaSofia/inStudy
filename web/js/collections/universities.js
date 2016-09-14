var UniversitiesList = Backbone.Collection.extend({

    // Reference to this collection's model.
    model: University,

    // Save all of the todo items under the `"todos-backbone"` namespace.
    localStorage: new Backbone.LocalStorage('instudy-backbone'),

  });  