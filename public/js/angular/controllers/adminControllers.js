app.controller("adminController", ["$scope", "$http",
    function($scope, $http) {

        $http.get("/api/a/system").success(function(data) {
            $scope.sys = data;
        });

        $scope.delete = function($path) {
            if (!!~$scope.sys.indexOf($path)) {
                $http.delete("/api/a/system/" + $path).success(function(result) {
                    if (result.success) {
                        var index = $scope.sys.indexOf($path);
                        if (index > -1) {
                            $scope.sys.splice(index, 1);
                        }
                    }
                });
            }
        };

        $scope.generate = function($context) {
            $http.post("/api/a/engine/" + $context).success(function(result) {
                // Do anything
            });
        };
    }
]);