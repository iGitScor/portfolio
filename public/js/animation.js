$(document).ready(function(){
  if ( top !== self ) {
  console.log(window.top.location.pathname);
    //location.replace( document.location.pathname + top.location.pathname );
  }

  // Definition of the homepage carousel
  $('.owl-carousel').owlCarousel({
      'loop':true,
      'nav' :true,
      'navText': ["&#8678;","&#8680;"]
  });
  
  $(document).keydown(function(e) {
    switch(e.which) {
        case 37: // left
          $('.owl-prev').each(function () {
            if (elementInViewport(this)) {
              this.click();
            }
          });
        break;

        case 39: // right
          $('.owl-next').each(function () {
            if (elementInViewport(this)) {
              this.click();
            }
          });
        break;

        default: return;
    }
    e.preventDefault();
  });
});

var elementInViewport = function(element) {
    var top    = element.offsetTop;
    var height = element.offsetHeight;
  
    while(element.offsetParent) {
      element = element.offsetParent;
      top    += element.offsetTop;
    }

    return (
      top >= window.pageYOffset &&
      (top + height) <= (window.pageYOffset + window.innerHeight)
    );
};