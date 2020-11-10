function activateScrollViews(scrollViews, rightBtns, leftBtns) {
    for (var i=0; i<scrollViews.length; i++) {
        initRbtn(scrollViews, rightBtns, i);
        initLbtn(scrollViews, leftBtns, i);
    }
}

function initRbtn(scrollViews, rightBtns, i) {
    rightBtns[i].addEventListener('click', function(event) {
        scrollToRight($(scrollViews[i]));
        event.stopPropagation();
    });
}

function initLbtn(scrollViews, leftBtns, i) {
    leftBtns[i].addEventListener('click', function(event) {
        scrollToLeft($(scrollViews[i]));
        event.stopPropagation();
    });
}

function scrollToRight(scrollView) {
    scrollView.scroll();
    scrollView.animate({
        'scrollLeft': '+=500'
      }, 300);
}
function scrollToLeft(scrollView) {
    scrollView.scroll();
    scrollView.animate({
        'scrollLeft': '-=500'
      }, 300);
}