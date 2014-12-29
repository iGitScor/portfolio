app.filter('startFrom', function () {
    return function (input, start) {
        start = +start;
        if (input) {
            return input.slice(start);
        }
        return 0;
    };
});
