app.directive('escKey', function () {
  return function (scope, element, attrs) {
    element.bind('keydown keypress', function (event) {
      if(event.which === 27) { // 27 = esc key
        scope.$apply(function (){
          scope.$eval(attrs.escKey);
        });

        event.preventDefault();
      }
    });
  };
});

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
