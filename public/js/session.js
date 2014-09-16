$(document).ready(function(){
    $('.notice_close_button').click(function() {
       var $id = $(this).attr('data-attr-notice');
       $('.notice_wrapper[data-attr-notice='+ $id +']').remove();
    });
    
    $('button[data-dismiss=alert]').click(function() {
        if ($(this).parent().hasClass('alert')) {
            $(this).parent().remove();
        }
    });
});