(function() {
  'use strict';
  
  var app;

  app = angular.module("FacebookProvider", []);

  app.provider('FacebookConfig', function() {
    this.appId = '';
    this.locale = 'en_US';

    this.$get = function() {
      var appId = this.appId;
      var locale = this.locale;
      return {
        getParams: function() {
          return {
            appId: appId,
            locale: locale
          }
        }
      };
    };

    this.setAppId = function(appId) {
      this.appId = appId;
    };
    this.setLocale = function(locale) {
      this.locale = locale;
    };
  });

  app.factory("Facebook", function($rootScope) {
    return {
      getLoginStatus: function() {
        return FB.getLoginStatus((function(response) {
          return $rootScope.$broadcast("fb_statusChange", {
            status: response.status
          });
        }), true);
      },
      login: function(_scope) {
        return FB.login((function(response) {
          if (response.authResponse) {

            return $rootScope.$broadcast("fb_connected", {
              facebook_id: response.authResponse.userID
            });
          } else {
            return $rootScope.$broadcast("fb_login_failed");
          }
        }), {
          scope: _scope
        });
      },
      logout: function() {
        return FB.logout(function(response) {
          if (response) {
            return $rootScope.$broadcast("fb_logout_succeded");
          } else {
            return $rootScope.$broadcast("fb_logout_failed");
          }
        });
      },
      getInfo: function() {
        return FB.api("/me", function(response) {
          return $rootScope.$broadcast("fb_infos", {
            user: response
          });
        });
      },
      getGroupFeed: function(id) {
        return FB.api("/" + id + "/feed", { limit: 25 }, function(response) {
          return $rootScope.$broadcast("fb_get_group_feed", {
            group_feed: response
          });
        });
      },
      unsubscribe: function() {
        return FB.api("/me/permissions", "DELETE", function(response) {
          return $rootScope.$broadcast("fb_get_login_status");
        });
      },
      addFeed: function(param) {
        return FB.ui({ method:'feed', app_id:this.appId, redirect_ur:param.redirect_ur, from:param.from, to:param.to, link:param.link, picture:param.picture, source:param.source, name:param.name, caption:param.caption, description:param.description, ref:param.ref}, function(response){
          if (response != null) {
            return $rootScope.$broadcast("fb_post_feed_success",{
              postID: response.post_id
            });
          }
        });
      },

      addPhoto: function(img,tags) {
        FB.api('me/photos','post',
          {
            message: 'I created an e-card for you !',
            url: 'http://pokeballzcenter.webstarts.com/uploads/SquirtleSquad.jpg'
          },
          function(response) {
            if (!response || response.error) {
              console.log('Photo post failed');
              console.log(response);
            } else {
              console.log('Photo post success');
              var postId = response.id;
              FB.api(postId+'/tags?tags='+JSON.stringify(tags), 'post', function(response){
                if (!response || response.error) {
                  console.log(response);
                } else {
                  console.log('Tag post success');
                  return $rootScope.$broadcast("fb_post_photo_success",{
                    data: response
                  });
                }
              });
            }
          }
        );
      },

      getFriends: function() {
        FB.api('/me/friends',
          function(response) {
            if (!response || response.error) {
              console.log('Get friends failed');
            } else {
              console.log('Get friends success');
              return $rootScope.$broadcast("fb_get_friends_success",{
                friends: response.data
              });
            }
          }
        );
      }

    };
  });

  app.run(function($location, $rootScope, FacebookConfig) {
    var config = FacebookConfig.getParams();
    window.fbAsyncInit = function() {
      FB.init({
        appId: config.appId,
        status: true,
        cookie: true,
        xfbml: true
      });
      $rootScope.$broadcast("fb_loaded");
      return FB.Event.subscribe("auth.statusChange", function(response) {
        return $rootScope.$broadcast("fb_statusChange", {
          status: response.status
        });
      });
    };

    return (function(d) {
      var id, js, ref;
      js = void 0;
      id = "facebook-jssdk";
      ref = d.getElementsByTagName("script")[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement("script");
      js.id = id;
      js.async = true;
      js.src = "//connect.facebook.net/" + config.locale + "/all.js";
      return ref.parentNode.insertBefore(js, ref);
    })(document);
  });
}).call(this);
