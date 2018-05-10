"use strict";
$(function(){

    function noop(){};
    function tryCatch(fn, ctx, params, success, error){

        error = error || noop;
        success = success || noop;
        try{
            fn.call(ctx, params);
        }catch(e){            
            console.error('error during sync', arguments);
        }
    }
    function createLocalStorageSyncFn(key){
        return function syncTolocalStorage(method, model, options) {            
                try{

                    switch(method) {
                        case 'read':
                            var data = JSON.parse(localStorage.getItem(key));
                            model.set(data);                    
                            break;
                        case 'update':
                        case 'create':
                            localStorage.setItem(key, JSON.stringify(model.toJSON()));
                            break;
                        case 'delete':
                            localStorage.setItem(key, null)
                        }

                    options.success();
                
                }catch(e){
                    options.error();
                    console.error('error during sync', arguments);
                }
            };
    }

    



    var Users = Backbone.Collection.extend({
        url: 'data/users.json',
        sync: createLocalStorageSyncFn('users')

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
                },
                reset:true
            });
            return this;
        }
    
    });
    var UsersView = new UsersView();
    var Router = Backbone.Router.extend({

        initialize: function () {
            Backbone.history.start({pushState: false});
            this.on('route', function(route, params){
                console.log("Clear Main View");
              
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
    
    $.get( "/data/users.json")
        .done(function(data) {          
          localStorage.setItem('users', JSON.stringify(data));
        })
        .fail(function() {
          alert( "error" );
        });
       
    
  });