var leftBtns = document.getElementsByClassName('left-btn');
var rightBtns = document.getElementsByClassName('right-btn');
var scrollViews = document.getElementsByClassName('scroll-view');

createIncDec("quan", "quanAdd", "quanMin", "price", true);
activateScrollViews(scrollViews, rightBtns, leftBtns);

AOS.init();

$('#pageMask .fa-times').on('click', function() {
    expMin(0, 'none');
});

$('.img-prev').on('click', function() {
    expMin(1, 'flex');
});

$('#pageMask').on('click', function() {
    if ($('#pageMask .fa-times').css('display')!='none') {
        expMin(0, 'none');
    }
});

function expMin(op, disp) {
    if (disp=='flex') {
        $('#pageMask .fa-times').css('display', disp);
        $('#pageMask').css('display', disp);
        $('#imgExpanded').css('display', disp);
    }
    $('#pageMask .fa-times').animate({
        opacity: op
    }, 500, function() {
        $('#pageMask .fa-times').css('display', disp);
        $('#pageMask .fa-times').css('opacity', op);
    });
    $('#pageMask').animate({
        opacity: op
    }, 500, function() {
        $('#pageMask').css('display', disp);
        $('#pageMask').css('opacity', op);
    });
    $('#imgExpanded').animate({
        opacity: op
    }, 500, function() {
        $('#imgExpanded').css('display', disp);
        $('#imgExpanded').css('opacity', op);
    });
}