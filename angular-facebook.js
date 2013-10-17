(function() {
  'use strict';
  
  var app,
      appID = "XXXXXXXXXXXX",
      locale = "en_US";

  app = angular.module("FacebookProvider", []);

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
      }
    };
  });

  app.run(function($location, $rootScope) {
    window.fbAsyncInit = function() {
      FB.init({
        appId: appID,
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
      js.src = "//connect.facebook.net/" + locale + "/all.js";
      return ref.parentNode.insertBefore(js, ref);
    })(document);
  });
}).call(this);
