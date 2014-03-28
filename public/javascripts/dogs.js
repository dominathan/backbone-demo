//jQuery when DOM loads run this

$(function(){
  //Backbone Model

  window.Dog = Backbone.Model.extend({
    url: function () {
      return this.id ? '/dogs/' + this.id : '/dogs' ;
    },

    defaults: {dog: {
      name: "None entered",
      age: 0
    }},

    initialize: function(){
      //used to initialize Model attributes
    }
  });

  //Collection

  window.DogCollection = Backbone.Collection.extend({
    model: Dog,
    url: '/dogs'
  });

  window.Dogs = new DogCollection;

  //View

  window.DogView = Backbone.View.extend({
    tagName: "tr"

    event: {
      //can be used for handling events on the template.
    },

    initialize: function (){
      //this.render();
    },

    render: function(){
      var dog = this.model.toJSON();
      //TEMPLATE HERE
      $(this.el).html(ich.dog_template(dog));
      return this;
    }
  });

//Application View

window.AppView = Backbone.View.extend({

  el: $("#dogs_app"),

  events: {
    'submit form#new_dog': 'createDog'
  },

  initialize: function(){
    _.bindAll(this, 'addOne','addAll');

    Dogs.bind('add',this.addOne);
    Dogs.bind('refresh', this.addAll)
    Dogs.bind('all',this.render);
    Dogs.fetch(); //This get sthe model from the server
  },

  addOne: function(dog) {
    var view = new DogView({model: dog});
    this.$('#dog_table').append(view.render().el);
  },

  addAll: function(){
    Dogs.each(this.addOne);
  },

  newAttributes: function(event) {
    var new_dog_form = $(event.currentTarget).serializeObject();
    //alert JSON.stringfy(new_dog_form)
    return {dog: {
      name: new_dog_form["dog[name]"],
      age: new_dog_form["dog[age]"]
    }}
  },

  createDog: function(e) {
    e.preventDefault(); //prevent form from submitting normally

    var params = this.newAttributes(e);

    Dogs.create(params);

    //TODO - clear form field after submitting.
  }

});
  //start backbone app
  window.App = new AppView;

});
