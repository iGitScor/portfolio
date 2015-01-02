(function(window, document, undefined) {
    // Save the window in a variable to limit access to the native one.
    var pos = 0,
        $window = $(window);

    var $domElements = $('.page .row p, .page .row h2');

    // Get the selected text
    var getSelected = function() {
        if (window.getSelection) {
            return window.getSelection();
        }
        else if (document.getSelection) {
            return document.getSelection();
        }

        return false;
    };

    // Remove previous sharer
    $('.page .twitter_sharer').remove();

    // Add the sharer
    $('.page').append('<div class="twitter_sharer"><a><span class="fa fa-twitter"></span></a></div>');

    $domElements.mouseup(function(e) {
        var rect;
        var selection = getSelected();
        var selection_text = '';
        if (selection !== "undefined") {
            var range = selection.getRangeAt(0);
                rect = range.getBoundingClientRect();
            selection_text = selection.toString();
        }

        if (selection_text !== "") {
            var $sharer = $('.twitter_sharer');

            $sharer.css({
                top: (rect.top + pos) - 45 + 'px',
                left: rect.left + (rect.width / 2) + 'px',
                opacity: 0,
                marginTop: '-5px'
            }).show().animate({
                opacity: 1,
                marginTop: '0px'
            }, 100);
        }
        else {
            return;
        }

        // Generate the twitter share link
        $('.twitter_sharer a').attr('href', 'https://twitter.com/share?url=http://sebastien-correaud.herokuapp.com' + window.location.pathname + '&text=' + encodeURIComponent(selection_text));

    });

    // Hide the sharer if we click outside
    $('.page > *:not(.twitter_sharer)').mousedown(function() {
        $('.twitter_sharer').hide();
    });

    $('.twitter_sharer a').click(function(e) {
        e.preventDefault();
        // Hide the sharer.
        $('.twitter_sharer').hide();
        // Open a new window to allow the user to share the content
        window.open($(this).attr('href'), '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=500,width=700');
    });

    // Get the current position in the whole page.
    $window.scroll(function() {
        pos = $window.scrollTop();
    });
})(this, this.document);