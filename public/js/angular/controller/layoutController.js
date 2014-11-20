var angular = angular;
var app = angular.module("sc", ['ngCookies']);
app.controller("searchController", ["$scope", "$http",
    function($scope, $http, $cookies) {
        $scope.error = false;
        
        $scope.search = function() {
            var $localST = encodeURIComponent($scope.searchText);
            $http.get( "/api/s/" + $localST + "/main" ).success(function( data ) {
                if (data.error) {
                    $scope.searchResult = data.error.message;
                    $scope.error = true;
                } else {
                    // Display all the results -- change app.js & template
                    $scope.searchResult = data;
                    $scope.error = false;
                }
            });
        };
    }
])
.controller("cookieController", ["$scope", "$cookies",
    function($scope, $cookies) {
        $scope.cookieAgree = ($cookies['cookiebanner-accepted'] === undefined) ? false : true;
        
        $scope.agree = function() {
            console.log('agree');
            $cookies['cookiebanner-accepted'] = true;
            $scope.cookieAgree = true;
        };
    }
]);