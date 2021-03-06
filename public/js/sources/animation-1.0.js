$(document).ready(function() {
    $(".owl-carousel").owlCarousel({
        loop: true,
        nav: true,
        navText: ["&#8678;", "&#8680;"]
    });
    $(document).keydown(function(e) {
        switch (e.which) {
            case 37:
                $(".owl-prev").each(function(el) {
                    if (elementInViewport(el)) {
                        el.click();
                    }
                });
                break;
            case 39:
                $(".owl-next").each(function(el) {
                    if (elementInViewport(el)) {
                        el.click();
                    }
                });
                break;
            default:
                return;
        }
        e.preventDefault();
    });
});
var elementInViewport = function(e) {
    var t = e.offsetTop;
    var n = e.offsetHeight;
    while (e.offsetParent) {
        e = e.offsetParent;
        t += e.offsetTop;
    }
    return t >= window.pageYOffset && t + n <= window.pageYOffset + window.innerHeight;
};