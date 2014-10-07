$(document).ready(function(){
    $('.notice_close_button').click(function(el) {
       var $id = el.attr('data-attr-notice');
       $('.notice_wrapper[data-attr-notice='+ $id +']').remove();
    });
    
    $('button[data-dismiss=alert]').click(function(el) {
        if (el.parent().hasClass('alert')) {
            el.parent().remove();
        }
    });
});