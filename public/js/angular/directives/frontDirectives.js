app.directive('searchResult', ['$location', function ($location) {
  return {
    restrict: 'E',
    templateUrl: '/html/search/result.html'
  };
}]);