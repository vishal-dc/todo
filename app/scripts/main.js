"use strict";
var Users = Backbone.Collection.extend({
    url: 'data/users.json'
  });

var UserList = Backbone.View.extend({
    el: $('#userList'),

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
        var that = this;
        users.fetch({
            success: function(users){
                console.log(users);
                var template = _.template($('#userListTemplate').html(),{users:users.models});
                that.$el.html(template);
                
            }
        });
      
    }
  
  });
var userList = new UserList();
var Router = Backbone.Router.extend({

    routes: {
      '': 'home',  
      'about': 'about',    
      'users': 'users', 
      'users/:id': 'user',
      'search/:query/p:page': 'search'  
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
        userList.render();        
    },

    user: function(id) {
        
        console.log('In user for id: ', id);
    }

  }); 
  $(function(){
    new Router();
    
    Backbone.history.start({pushState: false});
  });