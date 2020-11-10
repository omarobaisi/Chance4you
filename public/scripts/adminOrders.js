AOS.init();
$('#showDelivered').on('click', function() {
    showDelivered();
});
$('#showDelLbl').on('click', function() {
    showDelivered();
    $('#showDelivered').prop('checked',true);
});
$('#showNotDelivered').on('click', function() {
    showNotDelivered();
});
$('#showNotDelLbl').on('click', function() {
    showNotDelivered();
    $('#showNotDelivered').prop('checked',true);
});

for (var i=1; i<=Number($('.results-container').attr('data-ordersCount')); i++) {
    initCheckbox('#checkbox'+i, '#order'+i, "#submitDel"+i);
}

function initCheckbox (checkBoxId, orderId, formSubmitId) {
    $(checkBoxId).on('click', function () { 
        transferOrder(checkBoxId, orderId, formSubmitId);
    });
}

function transferOrder(checkBoxId, orderId, formSubmitId) {
    // if ($(checkBoxId).prop('checked')) {
    //     $(orderId).prependTo('#ordersDeliveredSec');
    // } else {
    //     $(orderId).prependTo('#ordersNotDeliveredSec');
    // }
    $(formSubmitId).trigger('click');
}

function showDelivered() {
    $('#notDeliveredHeader').css('display', 'none');
    $('#ordersNotDeliveredSec').css('display', 'none');
    $('#deliveredHeader').css('display', 'flex');
    $('#ordersDeliveredSec').css('display', 'flex');
}

function showNotDelivered() {
    $('#notDeliveredHeader').css('display', 'flex');
    $('#ordersNotDeliveredSec').css('display', 'flex');
    $('#deliveredHeader').css('display', 'none');
    $('#ordersDeliveredSec').css('display', 'none');
}