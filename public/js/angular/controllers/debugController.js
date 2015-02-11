/*******************************************
 *
 * FILTERS
 * Definition of template filters
 *
 **/

/**
 *
 * Filter : debug
 * Display the content of the input varible
 *
 **/
app.filter('dump', function () {
    return function (input) {
        if (input === '') {
            return '(empty string)';
        }
        return input ? input : ('' + input);
    };
});

/**
 *
 * Filter : debug
 * Display the content of the input varible
 *
 **/
app.filter('console.table', function () {
    return function (input) {
        console.table(input);
    };
});