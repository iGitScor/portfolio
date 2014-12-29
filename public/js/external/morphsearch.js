(function() {
    var morphSearch = document.getElementById('morphsearch'),
        input = morphSearch.querySelector('.morphsearch-input input'),
        ctrlClose = morphSearch.querySelector('span.morphsearch-close'),
        isOpen = isAnimating = false,
        toggleSearch = function(evt) {
            if (evt.type.toLowerCase() === 'focus' && isOpen) return false;

            var offsets = morphsearch.getBoundingClientRect();
            if (isOpen) {
                classie.remove(morphSearch, 'open');

                if (input.value !== '') {
                    setTimeout(function() {
                        classie.add(morphSearch, 'hideInput');
                        setTimeout(function() {
                            classie.remove(morphSearch, 'hideInput');
                            input.value = '';
                        }, 300);
                    }, 500);
                }

                input.blur();
            }
            else {
                classie.add(morphSearch, 'open');
            }
            isOpen = !isOpen;
        };

    input.addEventListener('focus', toggleSearch);
    ctrlClose.addEventListener('click', toggleSearch);
    document.addEventListener('keydown', function(ev) {
        var keyCode = ev.keyCode || ev.which;
        if (keyCode === 27 && isOpen) {
            toggleSearch(ev);
        }
    });

    morphSearch.querySelector('button[type="submit"]').addEventListener('click', function(ev) {
        // Do nothing, angular will do the job
    });
})();