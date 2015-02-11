app.directive('searchResult', ['$location', function ($location) {
  return {
    restrict: 'E',
    templateUrl: '/html/search/result.html'
  };
}]);

app.directive('notice', function () {
  return {
    restrict: 'E',
    templateUrl: '/html/common/notice.html',
    replace: true,
    transclude: true,
    scope: {
      message: '='
    },
    controller: function ($scope) {
      $scope.opened = true;
      $scope.remove = function () {
        $scope.opened = false;
      };
    }
  };
});
