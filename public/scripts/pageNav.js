$('#pageNum').on("change input keydown keyup paste", function(){
    var field = document.querySelector('#pageNum');
    var val = 0;
    if (!field.value.match('/^\d+$/')) {
        val = Number(field.value.replaceAll(/[^0-9]+/g, ''));
        field.value = val;
    }
    var max = Number(document.getElementsByClassName('results-container')[0].getAttribute('data-itemsCount'))/20;
    if (val>max) {
        field.value = max;
    }
});
