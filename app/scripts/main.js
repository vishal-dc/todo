"use strict";
var Users = Backbone.Collection.extend({
    url: 'data/users.json'
  });

var UserList = Backbone.View.extend({

    // tagName: "li",
  
    // className: "document-row",
  
    // events: {
    //   "click .icon":          "open",
    //   "click .button.edit":   "openEditDialog",
    //   "click .button.delete": "destroy"
    // },
  
    // initialize: function() {
    //   this.listenTo(this.model, "change", this.render);
    // },
  
    render: function() {
        var users = new Users();
        users.fetch({
            success: function(users){
                console.log(users);
            }
        });
      
    }
  
  });
var Router = Backbone.Router.extend({

    routes: {
      '': 'home',  
      'about': 'about',    // #help
      'users': 'users',  // #search/kiwis
      'users/:id': 'user',
      'search/:query/p:page': 'search'   // #search/kiwis/p7
    },

    home: function(){
        console.log('home')
    },
  
    about: function() {
      console.log('In about');
    },
  
    search: function(query, page) {
        console.log('In search');
    },

    users: function() {
        console.log('In users');
        new UserList().render();        
    },

    user: function(id) {
        
        console.log('In user for id: ', id);
    }

  }); 
  $(function(){
    new Router();
    
    Backbone.history.start({pushState: false});
  });