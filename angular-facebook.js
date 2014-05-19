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

  app.factory("Facebook", ['$rootScope', 'FacebookConfig', function($rootScope, FacebookConfig) {
    return {
      login: function(scope) {
        FB.login(
          function(response) {
            if (response.authResponse) {
              return $rootScope.$broadcast("fb_Login_success", {
                response: response
              });
            } else {
              return $rootScope.$broadcast("fb_login_failed");
            }
          },
          {
            scope: scope
          }
        );
      },

      logout: function() {
        return FB.logout(function(response) {
          return $rootScope.$broadcast("fb_logout", {
            response: response
          });
        });
      },

      getLoginStatus: function() {
        FB.getLoginStatus(function(response) {
          return $rootScope.$broadcast("fb_statusChange", {
            response: response
          });
        });
      },

      getInfo: function() {
        return FB.api("/me", function(response) {
          return $rootScope.$broadcast("fb_infos", {
            response: response
          });
        });
      },

      shareLink: function(href) {
        FB.ui({
          method: 'share',
          href: href
        }, function(response){
          console.log(response);
          return $rootScope.$broadcast("fb_share", {
            response: response
          });
        });
      },

      isInit: function() {
        if (typeof(FB) != 'undefined' && FB != null ) {
          return true;
        }else {
          return false;
        }
      }
    };
  }]);

  app.run(['$location', '$rootScope', 'FacebookConfig', function($location, $rootScope, FacebookConfig) {
    var config = FacebookConfig.getParams();
    window.fbAsyncInit = function() {
      FB.init({
        appId      : config.appId,
        cookie     : true,  // enable cookies to allow the server to access
        // the session
        xfbml      : true,  // parse social plugins on this page
        version    : 'v2.0' // use version 2.0
      });
      FB.Canvas.setAutoGrow();
      FB.getLoginStatus(function(response) {
        return $rootScope.$broadcast("fb_statusChange", {
          response: response
        });
      });
      $rootScope.$broadcast("fb_loaded");
    }

    window.checkLoginState = function() {
      FB.getLoginStatus(function(response) {
        return $rootScope.$broadcast("fb_statusChange", {
          response: response
        });
      });
    }

    return (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/" + config.locale + "/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

  }]);
}).call(this);
