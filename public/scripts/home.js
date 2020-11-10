var displayCaret = document.querySelector('.display-caret');
var displayLinks = document.getElementsByClassName('disp-link');
var displayRight = document.querySelector('.display-right-container');
var rHeader = document.querySelector('.display-right-container h1');
var rDesc = document.querySelector('.display-right-container p');
var rPrice = document.querySelector('.display-right-container h2');
var dispMoreBtn = document.querySelector('.display-right-container .more-btn');
var leftBtns = document.getElementsByClassName('left-btn');
var rightBtns = document.getElementsByClassName('right-btn');
var scrollViews = document.getElementsByClassName('scroll-view');
var btn = document.querySelectorAll(".box>a");
var menu = document.querySelectorAll(".menu");

AOS.init();

$( document ).ready(function() {
    adjustCaret();
    var timer = window.setInterval(function() {
        adjustCaret();
        $(displayCaret).animate({
            opacity: 1
        }, 750, function() {
            $(displayCaret).css('opacity', '1');
        });
    }, 1);
    window.setTimeout(function() {
        window.clearInterval(timer);
    }, 750);
});
$( window ).resize(function() {
    adjustCaret();
});

activateScrollViews(scrollViews, rightBtns, leftBtns);

var selectedLink = 0;
function adjustCaret() {
    displayCaret.style.transition = "none";
    changeCaretPos();
}
function adjustCaretAnim() {
    displayCaret.style.transition = "0.5s";
    changeCaretPos();
}
function changeCaretPos() {
    var offset = selectedLink==0?1.2:selectedLink==3?3:2;
    displayCaret.style.left = (displayRight.getBoundingClientRect().x-displayCaret.getBoundingClientRect().width/offset)+'px';
    displayCaret.style.top = (Math.abs(document.getElementsByTagName('body')[0].getBoundingClientRect().y)+displayLinks[selectedLink].getBoundingClientRect().y+30)+'px';
}

var titlesArr = $('.display-right-container').attr('data-titles').split("#");
var descArr = $('.display-right-container').attr('data-desc').split("#");
var priceArr = $('.display-right-container').attr('data-prices').split("#");
var linksArr = $('.display-right-container').attr('data-link').split("#");

displayLinks[0].addEventListener('mouseover', function() {
    selectedLink = 0;
    rHeader.innerText = titlesArr[0];
    rPrice.innerText = priceArr[0];
    rDesc.innerText = descArr[0];
    dispMoreBtn.setAttribute('href', linksArr[0]);
    adjustCaretAnim();
});

displayLinks[1].addEventListener('mouseover', function() {
    selectedLink = 1;
    rHeader.innerText = titlesArr[1];
    rPrice.innerText = priceArr[1];
    rDesc.innerText = descArr[1];
    dispMoreBtn.setAttribute('href', linksArr[1]);
    adjustCaretAnim();
});

displayLinks[2].addEventListener('mouseover', function() {
    selectedLink = 2;
    rHeader.innerText = titlesArr[2];
    rPrice.innerText = priceArr[2];
    rDesc.innerText = descArr[2];
    dispMoreBtn.setAttribute('href', linksArr[2]);
    adjustCaretAnim();
});

displayLinks[3].addEventListener('mouseover', function() {
    selectedLink = 3;
    rHeader.innerText = titlesArr[3];
    rPrice.innerText = priceArr[3];
    rDesc.innerText = descArr[3];
    dispMoreBtn.setAttribute('href', linksArr[3]);
    adjustCaretAnim();
});

