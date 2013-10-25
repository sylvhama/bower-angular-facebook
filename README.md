bower-angular-facebook
======================

Independent module with a set of useful functions for Facebook for your AngularJS project.
Pull requests are welcome!

## Job

No need to insert scripts from Facebook.
**This module does all the job**, it loads Facebook API and initialize your app.

* The event `fb_loaded` is broadcasted in the rootScope once your app is loaded.
* The event `fb_statusChange` is broadcasted in the rootScope when the user login status changes.

## Install

Install with `bower`:

```shell
bower install git://github.com/laurent-le-graverend/bower-angular-facebook.git
```

Add a `<script>` to your `index.html`:

```html
<script src="/bower_components/angular-facebook/angular-facebook.js"></script>
```

And add `FacebookProvider` as a dependency for your app:

```javascript
app = angular.module('myApp', ['FacebookProvider']);
```

And add `FacebookConfigProvider` as a dependency for your app config:

```javascript
app.config(function(FacebookConfigProvider) {
  FacebookConfigProvider.setAppId('123456789012345');
  FacebookConfigProvider.setLocale('en_US'); // Optional, set to en_US by default
}
```

## How to use it:

All functions are asynchronous, the responses are broadcasted from the rootScope.

Simply add the provider to your controller and call the functions.

Example:
```javascript
app.controller('MyCtrl', function($scope, Facebook) {
  $scope.doFacebookLogin = function() {
    // Login to Facebook, with extended permission
    Facebook.login("user_groups");
  }
  
  // This has been broadcasted by Facebook.login()
  $scope.$on('fb_statusChange', function(event, response) {
    if (response.status == "connected") {
      // Getting user information
      Facebook.getInfo();
    }
  });
  
  // This has been broadcasted by Facebook.getInfo()
  $scope.$on('fb_infos', function(event, response) {
    $scope.user = response.user;
  });
});
```

## To-do:
* More open graph functions!

## License

The MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
