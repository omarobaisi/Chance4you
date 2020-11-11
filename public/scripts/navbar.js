var dropBtn = document.getElementById("dropBtn");
var navBar = document.querySelector(".navbar-contianer");
var navBarLinks = document.querySelector(".navbar-links");
var navLink = document.getElementsByClassName("navbar-link");
var textField = document.querySelector(".search-div .text-field");
var btns = document.getElementsByClassName("navbar-link");

var extended=false;
$( document ).ready(function() {
    adjustBtns();
});
$( window ).resize(function() {
    adjustBtns();
});

addDropDown("moreCaret0", "menu0", "cI-0");
addDropDown("moreCaret1", "menu1", "cI-1");
addDropDown("moreCaret2", "menu2", "cI-2");
addDropDown("moreCaret3", "menu3", "cI-3");
addDropDown("acc", "menu4", "cI-4");

dropBtn.addEventListener("click", function() {
    if (!extended) {
        navBar.classList.add("extended");
        navBarLinks.classList.add("extended");
        navBarLinks.classList.add("extended-links");
        for (var i=0; i<navLink.length; i++) {
            navLink[i].style.fontSize = "21px";
        }
        btnsDisplay(true);
        extended=true;
    } else {
        navBar.classList.remove("extended");
        navBarLinks.classList.remove("extended");
        navBarLinks.classList.remove("extended-links");
        for (var i=0; i<navLink.length; i++) {
            navLink[i].style.fontSize = "17px";
        }
        btnsDisplay(false);
        extended=false;
    }
});

function adjustBtns() {
    if (window.innerWidth<=1200) {
        document.getElementById('topSvg').setAttribute("height", "941.742");
        $('#acc').html('<i class="fas fa-user nav-icon" id="cI-4"></i>');
        $('#cart').html('<i class="fas fa-shopping-cart nav-icon"></i></a>');  
        $('#staticDiv').appendTo('.navbar-right');
    } else {
        document.getElementById('topSvg').removeAttribute("height");
        $('#acc').html('<i class="fas fa-user nav-icon" id="cI-4"></i>حسابي');
        $('#cart').html('<i class="fas fa-shopping-cart nav-icon"></i>السلة</a>');
        $('#staticDiv').appendTo('.navbar-links');
    }
    
    if (!extended) {
        if (window.innerWidth<=1200) {
            btnsDisplay(false);
            textField.classList.remove("text-field-round");
        } else {
            btnsDisplay(true);
            textField.classList.add("text-field-round");
        }
    } else {
        navBar.classList.remove("extended");   
        navBarLinks.classList.remove("extended");
        navBarLinks.classList.remove("extended-links");
        for (var i=0; i<navLink.length; i++) {
            navLink[i].style.fontSize = "17px";
        }
        btnsDisplay(false);
        extended=false;
    }
}

function btnsDisplay(visible) {
    var val = visible==true ? "block" : "none";
    for (var i=0; i<btns.length; i++) {
        btns[i].style.display = val;
    }
}
$('.cart-count-bg').on('click', function() {
    window.location.href = '/shop/shopping-cart';
});
function adjustCartCount() {
    $('.cart-count-bg').css('left', (document.querySelector('.fa-shopping-cart').getBoundingClientRect().right-10)+'px');
    $('.cart-count-bg').css('top', (document.querySelector('.fa-shopping-cart').getBoundingClientRect().top-10)+'px');
}
window.setInterval(function(){
    adjustCartCount();
}, 100);

$('.search-btn').on('click', function() {
    $('#submitSearch').trigger('click');
});

$('.search-btn').on('click', function() {
    $('#submitSearch').trigger('click');
});

$('.section-search').on('click', function(event) {
    $('.search-div input[type="text"]').attr('value', $(event.target).text());
    $('#submitSearch').trigger('click');
});
