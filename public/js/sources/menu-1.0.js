$("#mobile-navigation").each(function() {
    return $(this).change(function() {
        var h;
        h = $(this)[0];
        return location.href = h.options[h.selectedIndex].value;
    });
});