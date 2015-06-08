app.filter('startFrom', function () {
    return function (input, start) {
        start = +start;
        if (input && input.length) {
            return input.slice(start);
        }
        return 0;
    };
});
