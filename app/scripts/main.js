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
    $.fn.serializeObject = function() {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
      };

    if(!localStorage.getItem('usersCounter'))
        localStorage.setItem('usersCounter', 1);

    var db = {};
    db.users = [];    
  
    function createLocalStorageSyncFn(key){
        return function syncTolocalStorage(method, model, options) {            
                try{

                    switch(method) {
                        case 'read':
                            model = JSON.parse(localStorage.getItem(key));    
                            db[key] = model;                        
                            break;
                        case 'update':

                            localStorage.setItem(key, JSON.stringify(model.toJSON()));
                            break;
                        case 'create':
                            var idCounter = Number(localStorage.getItem(key+'Counter'));
                            model.set('id', idCounter);
                            db[key].push(model.toJSON());
                            // db[key][idCounter].id=idCounter;
                            localStorage.setItem(key+'Counter', idCounter+1);                                                        
                            localStorage.setItem(key, JSON.stringify(db[key]));                            
                            break;
                        case 'delete':
                            localStorage.setItem(key, null)
                        }
                        options.success(model || {});               
   
                }catch(e){
                    console.error(e);
                    options.error();
                    console.error('error during sync', e, arguments);
                }
            };
    }

    var Users = Backbone.Collection.extend({
        url: 'data/users',
        sync: createLocalStorageSyncFn('users')

    });


    var UsersView = Backbone.View.extend({
        el: '#main-view',
        template: _.template($('#users-template').html()),
        // tagName: "li",
    
        // className: "document-row",
    
        // events: {
        //   "click .icon":          "open",
        //   "click .button.edit":   "openEditDialog",
        //   "click .button.delete": "destroy"
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

    
    var User = Backbone.Model.extend({
        url: 'data/users',
        sync: createLocalStorageSyncFn('users')

    });

    var UserView = Backbone.View.extend({
        el: '#main-view',
        template: _.template($('#user-template').html()),
        events: {
          "submit .edit-user-form": "saveUser"
        },
    
        render: function() {            
            this.$el.html(this.template({user:null}));

            return this;
        },

        saveUser: function(event){
            var userDetails = $(event.currentTarget).serializeObject();
            var user = new User();
            user.save(userDetails, {
                success: function(){
                    router.navigate('#users', {trigger: true});
                }
            });
            return false;
        }
    
    });
   
    var Router = Backbone.Router.extend({

        initialize: function () {
            Backbone.history.start({pushState: false});
            // this.on('route', function(route, params){
            //     console.log("Changing route");
              
            //   });
        },

        // execute: function(callback, args, name) {                     
        //     if (callback) {
        //   
        //         console.log("Clear Main View");
        //         $( "#main-view" ).empty();
        //         callback.apply(this, args);
        //     }else{
        //         console.log("Something wrong!");
        //         alert('Incorrect Route');
        //         return false;
        //     }

        // },

        routes: {
            '': 'home',  
            'about': 'about',    
            'users': 'users', 
            'users/edit/:id': 'user',
            'users/create': 'user'
            
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
            usersView.render();       
          
        },

        user: function(id) {
            
            console.log('In user for id: ', id);
            userView.render();
        }

    }); 

    
    var usersView = new UsersView();        
    var userView = new UserView();        
    /** */
    var router = new Router();
    
    $.get( "/data/users.json")
        .done(function(data) {          
          localStorage.setItem('users', JSON.stringify(data));
        })
        .fail(function() {
          alert( "error" );
        });
       

    
  });