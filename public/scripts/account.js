AOS.init();
$('#phone').on("change input keyup paste", function(){
    var field = document.querySelector('#phone');
    if (field.value.length>10) {
        field.value = field.value.substring(0,10);
    }

    if (!field.value.match('/^\d+$/')) {
        field.value = field.value.replaceAll(/[^0-9]+/g, '');
    }
});
$('#contBtn').on("click", function() {
    $("#subBtn").trigger("click");
});