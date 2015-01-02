app.controller("searchController", ["$scope", "$http",
    function($scope, $http) {
        $scope.error = false;

        $scope.search = function() {
            var $localST = encodeURIComponent($scope.searchText);
            if ($localST.length > 0) {
                $http.get( "/api/s/" + $localST + "/" + $scope.searchType + "/fr" ).success(function( data ) {
                    if (data.error) {
                        $scope.searchResult = data.error.message;
                        $scope.error = true;

                        // Search in other context
                    } else {
                        // Display all the results -- change template
                        $scope.searchResult = data;
                        $scope.error = false;
                    }
                });
            }
        };
    }
])
.controller("cookieController", ["$scope", "$cookies",
    function($scope, $cookies) {
        $scope.cookieAgree = ($cookies['cookiebanner-accepted'] === undefined) ? false : true;

        $scope.agree = function() {
            $cookies['cookiebanner-accepted'] = true;
            $scope.cookieAgree = true;
        };
    }
])
.controller("redbubbleController" , ["$scope", "$http",
    function($scope, $http) {
        $scope.numberOfPages = 1;
        $scope.currentPage = 0;
        $scope.pageSize = 6;

        $http.get('/api/f/red').success(function(data) {
            $scope.results = data;
        });

        $scope.$watch('results', function(value) {
            if (value) {
                $scope.numberOfPages = Math.ceil($scope.results.length / $scope.pageSize);
            }
        }, true);
    }
]);