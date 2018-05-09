"use strict";
$(function(){
    var Users = Backbone.Collection.extend({
        url: 'data/users.json'
    });

    var UsersView = Backbone.View.extend({
        el: $('#main-view'),
        template: _.template($('#users-template').html()),
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
                    that.$el.html(that.template({users:users.models}));                    
                }
            });
            return this;
        }
    
    });
    var UsersView = new UsersView();
    var Router = Backbone.Router.extend({

        initialize: function () {
            Backbone.history.start({pushState: false});
            this.on('route', function(route, params){
                console.log("test");
              
              });
        },

        execute: function(callback, args, name) {                     
            if (callback) {
                //TODO use view.close/remove
                $( "#main-view" ).empty();
                callback.apply(this, args);
            }else{
                console.log("Something wrong!");
                alert('Incorrect Route');
                return false;
            }

        },

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

            UsersView.render();        

           
        },

        user: function(id) {
            
            console.log('In user for id: ', id);
        }

    }); 

    
          
    /** */
    new Router();
  
    
  });