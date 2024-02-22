function clickIndexItem(){
    var item_obj = $(this);
    var rule = item_obj.attr('name');
    $('.header-index .index-nav').attr('class', 'index-nav');
    item_obj.parents('.index-nav').attr('class', 'index-nav catch');
    $('#show #ms').attr('src', `/ms/${rule}/`);
    $('#show #user').css('display', 'none');
    $('#show #ms').fadeIn(500);
}
function clickHeaderUser(){
    if($('#show #user').css('display') == 'none'){
        $('#show #user').attr('src', `/user/amluZ3VhbmdmYQ/`);
        $('#show #ms').css('display', 'none');
        $('#show #user').fadeIn(500);
    }else{
        $('#show #user').css('display', 'none');
        $('#show #ms').fadeIn(500);
    }

}

function MSAPI_ifmJump(url, data){
    $('#postiframe').attr('action', url);
    $('#postiframe').html('<input name="data">');
    $('#postiframe input').val(data);
    $('#postiframe').unbind('submit').submit();
    $('#show #ms').css('display', 'none');
    $('#show #ms').fadeIn(500);
}

$(document).ready(function(){
    $('.index-item').click(clickIndexItem);
    $('.header-user').click(clickHeaderUser);
});
