AOS.init();
addDropDown('catBtn', 'catMenu', 'catIcon');
$('.catMenuBtn').on('click', function() {
    $('#catBtn').attr('value',$(this).text());
});
addDropDown('avlBtn', 'avlMenu', 'avlIcon');
$('.avlMenuBtn').on('click', function() {
    $('#avlBtn').attr('value',$(this).text());
});
$("#priceInp").on("change input keydown keyup paste", function(){
    var priceField = document.getElementById("priceInp");
    var val = Number(priceField.value);
    if (!priceField.value.match('/^\d+$/')) {
        val = Number(priceField.value.replaceAll(/[^0-9]+/g, ''));
        priceField.value = val;
    }
});
$("#disPriceInp").on("change input keydown keyup paste", function(){
    var priceField = document.getElementById("disPriceInp");
    var val = Number(priceField.value);
    if (!priceField.value.match('/^\d+$/')) {
        val = Number(priceField.value.replaceAll(/[^0-9]+/g, ''));
        priceField.value = val;
    }
});
createIncDec("quan", "quanAdd", "quanMin", "0", false);
